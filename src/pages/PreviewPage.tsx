import React, { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography, IconButton } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { GoogleDriveStorage } from '@linked-claims/vc-storage'
import { getLocalStorage } from '../tools/cookie'
import ResumePreview from '../components/resumePreview'
import ResumePreviewTopbar from '../components/ResumePreviewTopbar'
import html2pdf from 'html2pdf.js'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedResume } from '../redux/slices/resume'
import { AppDispatch, RootState } from '../redux/store'

const PreviewPage = () => {
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [isSigningSaving, setIsSigningSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<any>(null)
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  
  // Get the resume from Redux state first
  const reduxResume = useSelector((state: RootState) => state.resume?.resume)

  // Get resumeId from URL parameters
  const queryParams = new URLSearchParams(location.search)
  const resumeId = queryParams.get('id')

  useEffect(() => {
    // If we already have the resume in Redux state, prefer it over fetching
    // This ensures we show the most recent changes immediately after saving
    if (reduxResume) {
      console.log('Using resume from Redux state for preview', {
        hasExperience: !!reduxResume.experience?.items?.length,
        firstExpCredLink: reduxResume.experience?.items?.[0]?.credentialLink?.substring(0, 50)
      })
      setResumeData(reduxResume)
      setIsLoading(false)
      // Don't return here - still fetch from Drive to ensure we have the latest saved version
      // but the UI will show Redux state immediately
    }

    const fetchResumeFromDrive = async () => {
      try {
        const accessToken = getLocalStorage('auth')

        if (!accessToken) throw new Error('No authentication token found')

        if (!resumeId) throw new Error('No resume ID found')

        const storage = new GoogleDriveStorage(accessToken as string)
        const fileData = await storage.retrieve(resumeId)

        if (fileData?.data ?? fileData) {
          const data = fileData.data ?? fileData
          // Only update if the data from Drive is different (to avoid UI flashing)
          setResumeData((prevData: any) => {
            // If we don't have previous data or it's different, update
            if (!prevData || JSON.stringify(prevData) !== JSON.stringify(data)) {
              console.log('Updating preview with data from Google Drive')
              return data
            }
            return prevData
          })
          // Also update Redux state so Sign and Save has access to the resume data
          dispatch(setSelectedResume(data))
        } else {
          setResumeData(fileData)
          dispatch(setSelectedResume(fileData))
        }
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching resume:', err)
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load resume. Please try again later.'
        )
        setIsLoading(false)
      }
    }

    if (resumeId) {
      fetchResumeFromDrive()
    } else if (reduxResume) {
      // If no resumeId but we have Redux state, use it
      console.log('No resumeId provided, using resume from Redux state')
      setResumeData(reduxResume)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [resumeId, reduxResume, dispatch])

  const exportResumeToPDF = () => {
    if (!resumeData) return

    const element = document.getElementById('resume-preview')
    if (!element) return

    const options = {
      margin: [0, 0, 0, 0],
      filename: `${resumeData.contact?.fullName ?? 'Resume'}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    const metadata = {
      title: `${resumeData.contact?.fullName ?? 'Resume'}'s Resume`,
      creator: 'T3 Resume Author',
      subject: 'Resume',
      keywords: ['Resume', 'CV', resumeData.contact?.fullName ?? 'Resume'],
      custom: { resumeData: JSON.stringify(resumeData) }
    }

    html2pdf().set(metadata).from(element).set(options).save()
  }

  if (isLoading) {
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

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <ResumePreviewTopbar
        isDraftSaving={isDraftSaving}
        isSigningSaving={isSigningSaving}
        setIsDraftSaving={setIsDraftSaving}
        setIsSigningSaving={setIsSigningSaving}
        resumeId={resumeId}
      />

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
            onClick={exportResumeToPDF}
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
