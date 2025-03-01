import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  linearProgressClasses,
  styled,
  IconButton,
  TextField,
  CircularProgress
} from '@mui/material'
import LeftSidebar from './ResumeEditor/LeftSidebar'
import RightSidebar from './ResumeEditor/RightSidebar'
import Section from './ResumeEditor/Section'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/store'
import { SVGEditName } from '../assets/svgs'
import useGoogleDrive from '../hooks/useGoogleDrive'
import { useNavigate } from 'react-router-dom'
import { updateSection } from '../redux/slices/resume'
import OptionalSectionsManager from './ResumeEditor/OptionalSectionCard'
import { storeFileTokens } from '../firebase/storage'
import { getLocalStorage } from '../tools/cookie'

const ButtonStyles = {
  border: '2px solid #3A35A2',
  borderRadius: '100px',
  textTransform: 'none',
  fontWeight: 600,
  color: '#3A35A2',
  p: '5px 25px'
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '15px',
  borderRadius: '0px 30px 30px 0px',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#E1E2F6',
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800]
    })
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#614BC4',
    ...theme.applyStyles('dark', {
      backgroundColor: '#614BC4'
    })
  }
}))

const ResumeEditor: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'Professional Summary',
    'Work Experience',
    'Education',
    'Professional Affiliations',
    'Skills and Abilities'
  ])
  const [isEditingName, setIsEditingName] = useState(false)
  const [resumeName, setResumeName] = useState('Untitled')
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [isSigningSaving, setIsSigningSaving] = useState(false)

  const resume = useSelector((state: RootState) => state?.resume.resume)
  const { instances } = useGoogleDrive()
  const accessToken = getLocalStorage('auth')
  const refreshToken = getLocalStorage('refresh_token')

  const requiredSections = [
    'Professional Summary',
    'Work Experience',
    'Education',
    'Professional Affiliations',
    'Skills and Abilities'
  ]

  const handleAddSection = (sectionId: string) => {
    setSectionOrder(prev => [...prev, sectionId])
  }

  const handleRemoveSection = (sectionId: string) => {
    if (!requiredSections.includes(sectionId)) {
      setSectionOrder(prev => prev.filter(id => id !== sectionId))
    }
  }

  const handleAddFiles = () => {
    console.log('Add files clicked')
  }

  const handleAddCredential = (text: string) => {
    console.log('Add credential clicked', text)
  }

  const handlePreview = () => {
    console.log(resume)
    navigate('/resume/preview')
  }

  const handleSaveDraft = async () => {
    try {
      setIsDraftSaving(true)
      const savedResume = await instances?.resumeManager?.saveResume({
        resume: resume,
        type: 'unsigned'
      })
      console.log('Saved Resume:', savedResume)
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setIsDraftSaving(false)
    }
  }

  const handleSignAndSave = async () => {
    if (!instances?.resumeVC || !instances?.resumeManager) {
      console.error('Required services not available')
      return
    }

    // Set up a timer to ensure loading finishes after 3 seconds
    setIsSigningSaving(true)
    const loadingTimer = setTimeout(() => {
      setIsSigningSaving(false)
    }, 3000)

    try {
      // Generate key pair
      const keyPair = await instances.resumeVC.generateKeyPair()
      if (!keyPair) {
        throw new Error('Failed to generate key pair')
      }

      // Create DID document
      const didDoc = await instances.resumeVC.createDID({
        keyPair
      })
      if (!didDoc) {
        throw new Error('Failed to create DID document')
      }

      console.log('FORM DATA', resume)

      // Sign resume
      const signedResume = await instances.resumeVC.sign({
        formData: resume,
        issuerDid: didDoc.id,
        keyPair
      })
      if (!signedResume) {
        throw new Error('Failed to sign resume')
      }

      // Save resume
      const file = await instances.resumeManager.saveResume({
        resume: signedResume,
        type: 'sign'
      })
      if (!file || !file.id) {
        throw new Error('Failed to save resume')
      }

      // Store tokens
      await storeFileTokens({
        googleFileId: file.id,
        tokens: {
          accessToken: accessToken || '',
          refreshToken: refreshToken || ''
        }
      })

      console.log('Resume successfully signed and saved:', signedResume)

      // If process completes before 3 seconds, clear the timer
      // and manually set loading state to false
      if (loadingTimer) {
        clearTimeout(loadingTimer)
        setIsSigningSaving(false)
      }
    } catch (error) {
      console.error('Error signing and saving:', error)
      // If error occurs before 3 seconds, clear the timer
      // and manually set loading state to false
      if (loadingTimer) {
        clearTimeout(loadingTimer)
        setIsSigningSaving(false)
      }
    }
    // Note: No finally block needed as the timeout handles the loading state
  }

  const handleEditNameClick = () => {
    setIsEditingName(true)
    // Initialize with current resume name if available
    if (resume && resume.name) {
      setResumeName(resume.name)
    }
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResumeName(event.target.value)
  }

  const handleNameSave = () => {
    if (!resume) return

    dispatch(updateSection({ sectionId: 'name', content: resumeName }))
    setIsEditingName(false)
  }

  const handleNameKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleNameSave()
    } else if (event.key === 'Escape') {
      setIsEditingName(false)
      // Reset to original value
      if (resume && resume.name) {
        setResumeName(resume.name)
      } else {
        setResumeName('Untitled')
      }
    }
  }

  return (
    <Box sx={{ p: 6 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: '20px'
        }}
      >
        <Box sx={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {isEditingName ? (
              <TextField
                value={resumeName}
                onChange={handleNameChange}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyPress}
                autoFocus
                variant='standard'
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#000',
                    fontFamily: 'Poppins',
                    fontSize: '42px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '55.88px'
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#614BC4'
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#614BC4'
                  }
                }}
              />
            ) : (
              <Typography
                sx={{
                  color: '#000',
                  fontFamily: 'Poppins',
                  fontSize: '42px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '55.88px'
                }}
              >
                {resume?.name || 'Untitled'}
              </Typography>
            )}
            <IconButton onClick={handleEditNameClick}>
              <SVGEditName />
            </IconButton>
          </Box>
          <Typography
            sx={{
              color: '#2E2E48',
              fontFamily: 'DM Sans',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: 'normal',
              letterSpacing: '0.16px'
            }}
          >
            Name your resume with your first and last name so recruiters can easily locate
            your resume.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Button onClick={handlePreview} variant='outlined' sx={ButtonStyles}>
            Preview
          </Button>
          <Button
            variant='outlined'
            sx={ButtonStyles}
            onClick={handleSaveDraft}
            disabled={isDraftSaving}
            startIcon={
              isDraftSaving ? <CircularProgress size={20} color='inherit' /> : null
            }
          >
            {isDraftSaving ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button
            variant='outlined'
            sx={{ ...ButtonStyles, color: 'white', bgcolor: '#614BC4' }}
            onClick={handleSignAndSave}
            disabled={isSigningSaving}
            startIcon={
              isSigningSaving ? <CircularProgress size={20} color='inherit' /> : null
            }
          >
            {isSigningSaving ? 'Saving...' : 'Save and Sign'}
          </Button>
        </Box>
      </Box>

      <BorderLinearProgress variant='determinate' value={100} />
      <Typography
        sx={{
          color: '#2E2E48',
          fontFamily: 'DM Sans',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: 'normal',
          letterSpacing: '0.16px',
          mt: '20px'
        }}
      >
        Any section left blank will not appear on your resume.
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
        <LeftSidebar />

        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }}
        >
          {sectionOrder.map(sectionId => (
            <Section
              key={sectionId}
              sectionId={sectionId}
              onDelete={() => handleRemoveSection(sectionId)}
              onAddFiles={handleAddFiles}
              onAddCredential={handleAddCredential}
              isRemovable={!requiredSections.includes(sectionId)}
            />
          ))}

          {/* Optional sections manager */}
          <OptionalSectionsManager
            activeSections={sectionOrder}
            onAddSection={handleAddSection}
          />
        </Box>

        <RightSidebar />
      </Box>
    </Box>
  )
}

export default ResumeEditor
