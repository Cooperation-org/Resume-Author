import React from 'react'
import { Box, CircularProgress, Typography, IconButton } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import ResumePreview from '../components/resumePreview'
import html2pdf from 'html2pdf.js'

const PreviewPage = () => {
  const resumeData = useSelector((state: RootState) => state.resume?.resume)

  const exportResumeToPDF = () => {
    if (!resumeData) return

    const element = document.getElementById('resume-preview')
    if (!element) return

    const options = {
      margin: [0, 0, 0, 0],
      filename: `${resumeData.contact.fullName}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    const metadata = {
      title: `${resumeData.contact.fullName}'s Resume`,
      creator: 'Reactive Resume',
      subject: 'Resume',
      keywords: ['Resume', 'CV', resumeData.contact.fullName],
      custom: { resumeData: JSON.stringify(resumeData) }
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
      <Box
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          display: { xs: 'none', sm: 'block' },
          '@media print': {
            display: 'none'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <IconButton
            onClick={() => exportResumeToPDF()}
            sx={{
              width: '36px',
              height: '36px',
              borderRadius: '4px',
              transition: 'transform, background-color',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'scale(1)'
              },
              '&:active': {
                transform: 'scale(0.95)'
              }
            }}
          >
            <PictureAsPdfIcon sx={{ width: '36px', height: '36px' }} />
          </IconButton>
        </Box>
      </Box>
      <ResumePreview data={resumeData} />
    </Box>
  )
}

export default PreviewPage
