import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import TextEditor from '../../TextEditor/Texteditor'
import { useDispatch, useSelector } from 'react-redux'
import { updateSection } from '../../../redux/slices/resume'
import { RootState } from '../../../redux/store'
import stripHtmlTags from '../../../tools/stripHTML'

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
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)

  const [description, setDescription] = useState('')

  // ✅ Load existing summary from Redux if available
  useEffect(() => {
    if (resume?.summary) {
      const cleanSummary = stripHtmlTags(resume.summary)

      // Prevent unnecessary state updates
      if (cleanSummary !== description) {
        setDescription(cleanSummary)
      }
    }
  }, [description, resume])

  const handleDescriptionChange = (val: string) => {
    const plainText = stripHtmlTags(val)

    // ✅ Prevent unnecessary Redux updates
    if (plainText !== description) {
      setDescription(plainText)

      dispatch(
        updateSection({
          sectionId: 'summary',
          content: plainText
        })
      )
    }
  }

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
