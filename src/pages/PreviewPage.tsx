import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography, Button } from '@mui/material'
import ResumePreview from '../components/resumePreview'
import html2pdf from 'html2pdf.js'

const PreviewPage = () => {
  const [resumeData, setResumeData] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const exportResumeToPDF = (resumeData: any) => {
    const element = document.getElementById('resume-preview') // The container for the resume content
    const options = {
      margin: [0, 0, 0, 0], // No margins
      filename: `${resumeData.contact.fullName}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Allow cross-origin images
        logging: true // Enable logging for debugging
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    }

    // Add JSON data as metadata
    const metadata = {
      title: `${resumeData.contact.fullName}'s Resume`,
      creator: 'Reactive Resume',
      subject: 'Resume',
      keywords: ['Resume', 'CV', resumeData.contact.fullName],
      custom: { resumeData: JSON.stringify(resumeData) } // Embed JSON data
    }

    html2pdf().set(metadata).from(element).set(options).save()
  }
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
      <Button
        variant='contained'
        onClick={() => exportResumeToPDF(resumeData)}
        sx={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}
      >
        Export as PDF
      </Button>
      <ResumePreview data={resumeData} />
    </Box>
  )
}

export default PreviewPage
