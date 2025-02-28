import React from 'react'
import { Box, CircularProgress, Typography, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import ResumePreview from '../components/resumePreview'
import html2pdf from 'html2pdf.js'

const PreviewPage = () => {
  const resumeData = useSelector((state: RootState) => state.resume?.resume)

  const exportResumeToPDF = (data: any) => {
    const element = document.getElementById('resume-preview')
    if (!element) return

    const options = {
      margin: [0, 0, 0, 0],
      filename: `${data.contact.fullName}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    const metadata = {
      title: `${data.contact.fullName}'s Resume`,
      creator: 'Reactive Resume',
      subject: 'Resume',
      keywords: ['Resume', 'CV', data.contact.fullName],
      custom: { resumeData: JSON.stringify(data) }
    }

    html2pdf().set(metadata).from(element).set(options).save()
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
