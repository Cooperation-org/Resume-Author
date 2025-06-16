'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  styled,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  ListItemText
} from '@mui/material'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import useGoogleDrive, { DriveFileMeta } from '../../hooks/useGoogleDrive'

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

export interface FileItem {
  id: string
  file: File
  name: string
  url: string
  uploaded: boolean
  fileExtension: string
  googleId?: string
}

interface FileListProps {
  files: FileItem[]
  onDelete: (e: React.MouseEvent, id: string) => void
  onNameChange: (id: string, newName: string) => void
  onUploadFile: (fileItem: FileItem) => Promise<void>
  uploadingId?: string
  accessToken?: string
}

const FileListContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  paddingBottom: '20px',
  width: '100%'
})

const isImage = (n: string) => /\.(jpe?g|png|gif|bmp|webp)$/i.test(n)
const isPDF = (n: string) => n.toLowerCase().endsWith('.pdf')
const isMP4 = (n: string) => n.toLowerCase().endsWith('.mp4')

const renderPDFThumbnail = async (file: FileItem): Promise<string> => {
  try {
    const loadingTask = file.url.startsWith('data:')
      ? (() => {
          const base64 = file.url.split(',')[1]
          const bin = atob(base64)
          const arr = new Uint8Array(bin.length)
          for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
          return getDocument({ data: arr })
        })()
      : getDocument(file.url)
    const pdf = await loadingTask.promise
    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 0.1 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
    return canvas.toDataURL()
  } catch {
    return '/fallback-pdf-thumbnail.svg'
  }
}

const generateVideoThumbnail = (file: FileItem): Promise<string> =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = file.url
    video.addEventListener('loadeddata', () => (video.currentTime = 1), {
      once: true
    })
    video.addEventListener(
      'seeked',
      () => {
        const c = document.createElement('canvas')
        c.width = video.videoWidth
        c.height = video.videoHeight
        const ctx = c.getContext('2d')
        if (!ctx) return reject(new Error('Canvas error'))
        ctx.drawImage(video, 0, 0, c.width, c.height)
        resolve(c.toDataURL('image/png'))
      },
      { once: true }
    )
    video.addEventListener('error', () => reject(new Error('Video load failed')))
  })

const FileListDisplay: React.FC<FileListProps> = ({
  files,
  onDelete,
  onNameChange,
  onUploadFile,
  uploadingId,
  accessToken
}) => {
  const { instances, isInitialized, listFilesMetadata } = useGoogleDrive()
  const [remoteFiles, setRemoteFiles] = useState<DriveFileMeta[]>([])
  const [loadingRemote, setLoadingRemote] = useState(false)

  const reloadRemote = useCallback(async () => {
    if (!isInitialized || !instances.storage) return
    setLoadingRemote(true)
    try {
      const folderId = await instances.storage.getMediaFolderId()
      const list = await listFilesMetadata(folderId)
      setRemoteFiles(list)
    } finally {
      setLoadingRemote(false)
    }
  }, [isInitialized, instances.storage, listFilesMetadata])

  useEffect(() => {
    reloadRemote()
  }, [reloadRemote])

  const [pdfThumbs, setPdfThumbs] = useState<Record<string, string>>({})
  const [vidThumbs, setVidThumbs] = useState<Record<string, string>>({})
  useEffect(() => {
    files.forEach(f => {
      if (isPDF(f.name) && !pdfThumbs[f.id]) {
        renderPDFThumbnail(f).then(t => setPdfThumbs(p => ({ ...p, [f.id]: t })))
      }
      if (isMP4(f.name) && !vidThumbs[f.id]) {
        generateVideoThumbnail(f)
          .then(t => setVidThumbs(v => ({ ...v, [f.id]: t })))
          .catch(() => setVidThumbs(v => ({ ...v, [f.id]: '/fallback-video.png' })))
      }
    })
  }, [files, pdfThumbs, vidThumbs])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

  const startEdit = (f: FileItem) => {
    setEditingId(f.id)
    setEditingValue(f.name.replace(/(\.[^/.]+)$/, ''))
  }

  const saveEdit = (f: FileItem) => {
    if (!editingValue.trim()) {
      setEditingId(null)
      return
    }
    const ext = f.name.split('.').pop()!
    onNameChange(f.id, `${editingValue.trim()}.${ext}`)
    setEditingId(null)
  }

  const handleUpload = async (f: FileItem) => {
    await onUploadFile(f)
    setEditingId(null)
    await new Promise(r => setTimeout(r, 500))
    reloadRemote()
  }

  const getDriveUrl = (id: string) =>
    accessToken
      ? `https://www.googleapis.com/drive/v3/files/${id}?alt=media&access_token=${accessToken}`
      : `https://drive.google.com/uc?export=view&id=${id}`

  const [preview, setPreview] = useState<{ url: string; mime: string } | null>(null)
  const openPreview = (url: string, mime: string) => setPreview({ url, mime })
  const closePreview = () => setPreview(null)

  // only files not yet uploaded remain here
  const pending = files.filter(f => !f.uploaded)

  return (
    <>
      <FileListContainer>
        {pending.map(f => {
          const ext = f.name.split('.').pop()!
          const isEd = editingId === f.id
          const isUp = uploadingId === f.id

          return (
            <Box key={f.id} sx={{ width: '100%' }}>
              <Card sx={{ width: '100%', bgcolor: 'white', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isImage(f.name) ? (
                      <img
                        src={f.url}
                        width={80}
                        height={80}
                        style={{ borderRadius: 8 }}
                        onClick={() => openPreview(f.url, `image/${ext}`)}
                      />
                    ) : isPDF(f.name) ? (
                      <img
                        src={pdfThumbs[f.id] ?? '/fallback-pdf-thumbnail.svg'}
                        width={80}
                        height={80}
                        style={{ borderRadius: 8 }}
                        onClick={() => openPreview(f.url, 'application/pdf')}
                      />
                    ) : isMP4(f.name) ? (
                      <img
                        src={vidThumbs[f.id] ?? '/fallback-video.png'}
                        width={80}
                        height={80}
                        style={{ borderRadius: 8 }}
                        onClick={() => openPreview(f.url, 'video/mp4')}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: '#f3f3f3',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          color: '#666'
                        }}
                      >
                        FILE
                      </Box>
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      {isEd ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            size='small'
                            value={editingValue}
                            onChange={e => setEditingValue(e.target.value)}
                            fullWidth
                          />
                          <Typography>.{ext}</Typography>
                        </Box>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            wordBreak: 'break-all',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                          onClick={() =>
                            openPreview(
                              f.url,
                              isImage(f.name)
                                ? `image/${ext}`
                                : isPDF(f.name)
                                  ? 'application/pdf'
                                  : isMP4(f.name)
                                    ? 'video/mp4'
                                    : 'application/octet-stream'
                            )
                          }
                        >
                          {f.name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    bgcolor: '#242c41',
                    p: 2,
                    borderBottomLeftRadius: 2,
                    borderBottomRightRadius: 2
                  }}
                >
                  {!f.uploaded && !isUp && (
                    <Box
                      onClick={() => handleUpload(f)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer'
                      }}
                    >
                      <IconButton sx={{ color: 'white' }}>
                        <CloudUploadIcon />
                      </IconButton>
                      <Typography sx={{ color: 'white' }}>Upload</Typography>
                    </Box>
                  )}
                  {isUp && <Typography sx={{ color: 'white' }}>Uploading…</Typography>}
                  {isEd ? (
                    <Box
                      onClick={() => saveEdit(f)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer'
                      }}
                    >
                      <IconButton sx={{ color: 'white' }}>
                        <CheckIcon />
                      </IconButton>
                      <Typography sx={{ color: 'white' }}>Save</Typography>
                    </Box>
                  ) : (
                    <Box
                      onClick={() => startEdit(f)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer'
                      }}
                    >
                      <IconButton sx={{ color: 'white' }}>
                        <EditIcon />
                      </IconButton>
                      <Typography sx={{ color: 'white' }}>Edit</Typography>
                    </Box>
                  )}
                  <Box
                    onClick={e => onDelete(e, f.googleId ?? f.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer'
                    }}
                  >
                    <IconButton sx={{ color: 'white' }}>
                      <DeleteIcon />
                    </IconButton>
                    <Typography sx={{ color: 'white' }}>Delete</Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          )
        })}
      </FileListContainer>

      <Box>
        {loadingRemote ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography>Loading uploaded files…</Typography>
          </Box>
        ) : remoteFiles.length ? (
          <List dense>
            {remoteFiles.map(rf => {
              const thumb =
                rf.thumbnailLink ||
                (rf.mimeType.startsWith('image/')
                  ? getDriveUrl(rf.id)
                  : rf.mimeType === 'application/pdf'
                    ? '/fallback-pdf-thumbnail.svg'
                    : '/fallback-video.png')
              return (
                <ListItem
                  key={rf.id}
                  disablePadding
                  sx={{ pr: 8 }}
                  secondaryAction={
                    <Typography variant='caption' sx={{ pr: 2 }}>
                      Uploaded
                    </Typography>
                  }
                >
                  <ListItemButton
                    onClick={() => openPreview(getDriveUrl(rf.id), rf.mimeType)}
                  >
                    <ListItemAvatar>
                      <Avatar src={thumb} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={rf.name}
                      sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                      primaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        ) : (
          <Typography>No uploaded files yet.</Typography>
        )}
      </Box>

      <Dialog open={!!preview} onClose={closePreview} maxWidth='md' fullWidth>
        <DialogContent sx={{ textAlign: 'center' }}>
          {preview?.mime.startsWith('image/') && (
            <Box
              component='img'
              src={preview.url}
              alt='preview'
              sx={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          )}
          {preview?.mime.startsWith('video/') && (
            <Box
              component='video'
              src={preview.url}
              controls
              sx={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          )}
          {preview?.mime === 'application/pdf' && (
            <Box
              component='iframe'
              src={preview.url}
              sx={{ width: '100%', height: '80vh', border: 0 }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FileListDisplay
