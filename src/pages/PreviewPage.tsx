import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import ResumePreview from '../components/resumePreview'

const PreviewPage = () => {
  const [resumeData, setResumeData] = useState(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const response = await fetch('/resume-sample.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setResumeData(data)
      } catch (error) {
        console.error('Error loading resume data:', error)
        setError('Failed to load resume data. Please try again later.')
      }
    }

    loadResumeData()
  }, [])

  if (error) {
    return (
      <Box
        sx={{
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography color='error' variant='body1'>
          {error}
        </Typography>
      </Box>
    )
  }

  if (!resumeData) {
    return (
      <Box
        sx={{
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress size={24} />
        <Typography variant='body1' color='text.secondary'>
          Loading resume data...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      <ResumePreview data={resumeData} />
    </Box>
  )
}

export default PreviewPage
