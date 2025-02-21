import React, { useState, useCallback } from 'react'
import { Box, Typography } from '@mui/material'
import TextEditor from '../../TextEditor/Texteditor'

interface ProfessionalSummaryProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

export default function ProfessionalSummary({
  onAddFiles,
  onDelete,
  onAddCredential
}: ProfessionalSummaryProps) {
  const [description, setDescription] = useState('')

  const handleDescriptionChange = useCallback((val: string) => {
    setDescription(val)
  }, [])

  return (
    <Box>
      <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
        Write a brief summary highlighting your skills, experience, and achievements.
        Focus on what makes you stand out, including specific expertise or career goals.
        Keep it quantitative, clear, professional, and tailored to your target role.
      </Typography>

      <TextEditor
        value={description}
        onChange={handleDescriptionChange}
        onAddCredential={onAddCredential}
      />
    </Box>
  )
}
