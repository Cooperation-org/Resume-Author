'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Box, Typography, styled, Card, Snackbar, Alert } from '@mui/material'
import FileListDisplay from './FileList'
import { SVGUploadMedia } from '../../assets/svgs'

export interface FileItem {
  id: string
  file: File
  name: string
  url: string
  isFeatured: boolean
  uploaded: boolean
  fileExtension: string
  googleId?: string
}
const CardStyle = styled(Card)({
  padding: '40px 20px',
  cursor: 'default',
  width: '100%',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 8,
  gap: 8,
  border: '2px dashed #ccc'
})

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'video/mp4',
  'video/quicktime'
] as const

type Props = {
  files: FileItem[]
  maxFiles?: number
  maxSizeMB?: number
  onFilesSelected: (files: FileItem[]) => void
  onDelete: (e: React.MouseEvent, id: string) => void
  onNameChange: (id: string, name: string) => void
  onSetAsFeatured: (id: string) => void
  onReorder: (files: FileItem[]) => void
  hideUpload?: boolean
}

const MediaUploadSection: React.FC<Props> = ({
  files,
  maxFiles = 10,
  maxSizeMB = 20,
  onFilesSelected,
  onDelete,
  onNameChange,
  onSetAsFeatured,
  onReorder,
  hideUpload = false
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const openPicker = () => fileInputRef.current?.click()
  const handleCloseError = () => setError(null)

  const validateAndConvert = useCallback(
    (file: File): Promise<FileItem | null> =>
      new Promise(resolve => {
        if (!ALLOWED_TYPES.includes(file.type as any)) {
          setError(`Type not allowed: ${file.name}`)
          return resolve(null)
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`File too large (> ${maxSizeMB} MB): ${file.name}`)
          return resolve(null)
        }
        const reader = new FileReader()
        reader.onload = e =>
          resolve({
            id: crypto.randomUUID(),
            file,
            name: file.name,
            url: e.target?.result as string,
            isFeatured: false,
            uploaded: false,
            fileExtension: file.name.split('.').pop() ?? ''
          })
        reader.readAsDataURL(file)
      }),
    [maxSizeMB]
  )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list) return

    const overshoot = files.length + list.length - maxFiles
    if (overshoot > 0) {
      setError(`You can only upload ${maxFiles} files. Remove ${overshoot} first.`)
      return
    }

    const processed = await Promise.all(Array.from(list).map(validateAndConvert))
    const validItems = processed.filter(Boolean) as FileItem[]
    if (!validItems.length) {
      e.target.value = ''
      return
    }

    const merged = [...files]
    const hasFeatured = merged.some(f => f.isFeatured)
    validItems.forEach(item => {
      if (!hasFeatured && merged.length === 0) item.isFeatured = true
      const i = merged.findIndex(f => f.name === item.name)
      i !== -1 ? (merged[i] = item) : merged.push(item)
    })

    onFilesSelected(merged)
    e.target.value = ''
  }

  return (
    <Box width='100%'>
      <CardStyle variant='outlined'>
        <FileListDisplay
          files={files}
          onDelete={onDelete}
          onNameChange={onNameChange}
          onSetAsFeatured={onSetAsFeatured}
          onReorder={onReorder}
        />

        {/* Only show upload area if not hidden */}
        {!hideUpload && (
          <>
            <Box onClick={openPicker} sx={{ textAlign: 'center', cursor: 'pointer' }}>
              <SVGUploadMedia />
              <Typography variant='body1' color='primary'>
                + Add media
                <br />
                (images, documents, video)
              </Typography>
            </Box>
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={ALLOWED_TYPES.join(',')}
              multiple
              hidden
            />
          </>
        )}
      </CardStyle>

      <Snackbar open={!!error} onClose={handleCloseError} autoHideDuration={6000}>
        <Alert severity='error' onClose={handleCloseError} variant='filled'>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MediaUploadSection
