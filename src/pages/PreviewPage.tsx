import React, { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography, IconButton } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { GoogleDriveStorage } from '@cooperation/vc-storage'
import { getLocalStorage } from '../tools/cookie'
import ResumePreview from '../components/resumePreview'
import ResumePreviewTopbar from '../components/ResumePreviewTopbar'
import html2pdf from 'html2pdf.js'
import { useLocation } from 'react-router-dom'

const PreviewPage = () => {
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [isSigningSaving, setIsSigningSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<any>(null)
  const location = useLocation()

  // Get resumeId from URL parameters
  const queryParams = new URLSearchParams(location.search)
  const resumeId = queryParams.get('id')

  useEffect(() => {
    const fetchResumeFromDrive = async () => {
      try {
        const accessToken = getLocalStorage('auth')

        if (!accessToken) throw new Error('No authentication token found')

        if (!resumeId) throw new Error('No resume ID found')

        const storage = new GoogleDriveStorage(accessToken as string)
        const fileData = await storage.retrieve(resumeId)

        if (fileData?.data ?? fileData) {
          // If it's a VC format, transform it
          const data = fileData.data || fileData
          
          console.log('[PreviewPage.tsx] Raw resume content:', data)
          
          // Check if this is a signed VC (has credentialSubject)
          if (data.credentialSubject) {
            // For signed VCs, we need to properly extract all the fields
            // The summary is stored in credentialSubject.professionalSummary.credentialSubject.narrative
            const credentialSubject = data.credentialSubject
            
            // Extract professional summary from the nested structure
            // It's at the root level of data for signed resumes
            const professionalSummaryText = data.professionalSummary?.credentialSubject?.narrative || 
                                           credentialSubject?.professionalSummary?.credentialSubject?.narrative || 
                                           '';
            
            // Extract the resume data from the VC format
            const transformedData = {
              ...data,
              // Make sure summary is at the top level where the preview expects it
              summary: professionalSummaryText || 
                       credentialSubject?.narrative?.text || 
                       credentialSubject?.summary || 
                       data.summary || 
                       '',
              // Preserve other fields that might be nested
              contact: credentialSubject?.person?.contact || data.contact,
              experience: credentialSubject?.experience ? { items: credentialSubject.experience } : data.experience,
              education: credentialSubject?.educationAndLearning ? { items: credentialSubject.educationAndLearning } : data.education,
              skills: credentialSubject?.skills ? { items: credentialSubject.skills } : data.skills,
              certifications: credentialSubject?.certifications ? { items: credentialSubject.certifications } : data.certifications,
              professionalAffiliations: credentialSubject?.professionalAffiliations ? { items: credentialSubject.professionalAffiliations } : data.professionalAffiliations,
              projects: credentialSubject?.projects ? { items: credentialSubject.projects } : data.projects,
              volunteerWork: credentialSubject?.volunteerWork ? { items: credentialSubject.volunteerWork } : data.volunteerWork,
              languages: credentialSubject?.languages ? { items: credentialSubject.languages } : data.languages,
              hobbiesAndInterests: credentialSubject?.hobbiesAndInterests || data.hobbiesAndInterests,
              publications: credentialSubject?.publications ? { items: credentialSubject.publications } : data.publications
            }
            
            console.log('[PreviewPage.tsx] Transformed VC data:', {
              originalSummary: credentialSubject?.narrative?.text,
              transformedSummary: transformedData.summary,
              hasSummary: !!transformedData.summary
            })
            
            setResumeData(transformedData)
          } else {
            // It's already in resume format
            console.log('[PreviewPage.tsx] Resume format data:', {
              summary: data.summary,
              hasSummary: !!data.summary
            })
            setResumeData(data)
          }
        } else {
          setResumeData(fileData)
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
    } else {
      setIsLoading(false)
    }
  }, [resumeId])

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
        resumeData={resumeData} // Pass resumeData
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
