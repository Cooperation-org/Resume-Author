'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  styled,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'

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
  onDelete: (event: React.MouseEvent, id: string) => void
  onNameChange: (id: string, newName: string) => void
}

const FileListContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  paddingBottom: '20px',
  marginTop: '1rem',
  width: '100%'
})

const isImage = (filename: string) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename)
const isPDF = (filename: string) => filename.toLowerCase().endsWith('.pdf')
const isMP4 = (filename: string) => filename.toLowerCase().endsWith('.mp4')

const renderPDFThumbnail = async (file: FileItem): Promise<string> => {
  try {
    const loadingTask = file.url.startsWith('data:')
      ? (() => {
          const base64 = file.url.split(',')[1]
          const binary = atob(base64)
          const len = binary.length
          const bytes = new Uint8Array(len)
          for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i)
          }
          return getDocument({ data: bytes })
        })()
      : getDocument(file.url)

    const pdf = await loadingTask.promise
    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 0.1 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({
      canvasContext: canvas.getContext('2d')!,
      viewport
    }).promise

    return canvas.toDataURL()
  } catch (err) {
    console.error('PDF thumbnail error:', err)
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
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Video canvas context error'))
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/png'))
      },
      { once: true }
    )
    video.addEventListener('error', () => reject(new Error('Video load error')))
  })

const FileListDisplay: React.FC<FileListProps> = ({ files, onDelete, onNameChange }) => {
  const [pdfThumbs, setPdfThumbs] = useState<Record<string, string>>({})
  const [vidThumbs, setVidThumbs] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState<string>('')

  useEffect(() => {
    const generateThumbs = async () => {
      for (const f of files) {
        if (isPDF(f.name) && !pdfThumbs[f.id]) {
          const thumb = await renderPDFThumbnail(f)
          setPdfThumbs(prev => ({ ...prev, [f.id]: thumb }))
        }
        if (isMP4(f.name) && !vidThumbs[f.id]) {
          try {
            const thumb = await generateVideoThumbnail(f)
            setVidThumbs(prev => ({ ...prev, [f.id]: thumb }))
          } catch {
            setVidThumbs(prev => ({
              ...prev,
              [f.id]: '/fallback-video.png'
            }))
          }
        }
      }
    }
    generateThumbs()
  }, [files, pdfThumbs, vidThumbs])

  const startEdit = (file: FileItem) => {
    setEditingId(file.id)
    setEditingValue(file.name.replace(/(\.[^/.]+)$/, ''))
  }

  const saveEdit = (file: FileItem) => {
    if (!editingValue.trim()) {
      setEditingId(null)
      return
    }
    const ext = file.name.split('.').pop() ?? ''
    onNameChange(file.id, `${editingValue.trim()}.${ext}`)
    setEditingId(null)
  }

  return (
    <FileListContainer>
      {files.map(f => {
        const ext = f.name.split('.').pop()
        const isEditing = editingId === f.id

        return (
          <Box key={f.id} sx={{ width: '100%' }}>
            <Card sx={{ width: '100%', bgcolor: 'white', borderRadius: 2 }}>
              <CardContent sx={{ p: 4, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Thumbnail */}
                  {isImage(f.name) && (
                    <img
                      src={f.url}
                      alt={f.name}
                      width={80}
                      height={80}
                      style={{ borderRadius: 8 }}
                    />
                  )}
                  {isPDF(f.name) && (
                    <img
                      src={pdfThumbs[f.id] ?? '/fallback-pdf-thumbnail.svg'}
                      alt={f.name}
                      width={80}
                      height={80}
                      style={{ borderRadius: 8 }}
                    />
                  )}
                  {isMP4(f.name) && (
                    <img
                      src={vidThumbs[f.id] ?? '/fallback-video.png'}
                      alt={f.name}
                      width={80}
                      height={80}
                      style={{ borderRadius: 8 }}
                    />
                  )}
                  {!isImage(f.name) && !isPDF(f.name) && !isMP4(f.name) && (
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

                  {/* Name / Edit Field */}
                  <Box sx={{ flexGrow: 1 }}>
                    {isEditing ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          size='small'
                          value={editingValue}
                          onChange={e => setEditingValue(e.target.value)}
                          sx={{ width: '100%' }}
                        />
                        <Typography>.{ext}</Typography>
                      </Box>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          wordBreak: 'break-all'
                        }}
                      >
                        {f.name}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>

              {/* Action Row */}
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
                {isEditing ? (
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
  )
}

export default FileListDisplay
