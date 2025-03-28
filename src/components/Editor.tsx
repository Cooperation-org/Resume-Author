import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  linearProgressClasses,
  styled,
  IconButton,
  TextField,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert
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
import { prepareResumeForVC } from '../tools/resumeAdapter'

interface ResumeEditorProps {
  isEditMode?: boolean
}

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

const ResumeEditor: React.FC<ResumeEditorProps> = ({ isEditMode = false }) => {
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
  const [error, setError] = useState<{
    show: boolean
    message: string
    severity: 'error' | 'warning' | 'info' | 'success'
  }>({
    show: false,
    message: '',
    severity: 'error'
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const resume = useSelector((state: RootState) => state.resume.resume)
  const { instances } = useGoogleDrive()

  const getTokens = () => ({
    accessToken: getLocalStorage('auth'),
    refreshToken: getLocalStorage('refresh_token')
  })

  useEffect(() => {
    const checkAuth = () => {
      const currentAccessToken = getLocalStorage('auth')
      const currentRefreshToken = getLocalStorage('refresh_token')
      setIsAuthenticated(!!currentAccessToken && !!currentRefreshToken)
    }

    checkAuth()

    window.addEventListener('storage', checkAuth)

    window.addEventListener('auth-state-changed', checkAuth)

    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('auth-state-changed', checkAuth)
    }
  }, [])

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
    navigate('/resume/view')
  }

  const handleCloseError = () => {
    setError({ ...error, show: false })
  }

  const handleSaveDraft = async () => {
    try {
      setIsDraftSaving(true)

      if (!isAuthenticated) {
        setError({
          show: true,
          message: 'You need to sign in to save your resume as a draft',
          severity: 'warning'
        })
        return
      }

      if (!instances?.resumeManager || !resume) {
        setError({
          show: true,
          message: 'Unable to save resume. Please try again later.',
          severity: 'error'
        })
        return
      }

      const savedResume = await instances.resumeManager.saveResume({
        resume: resume,
        type: 'unsigned'
      })
      console.log('Saved Resume (new file):', savedResume)

      setError({
        show: true,
        message: 'Resume draft saved successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Error saving draft:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'

      if (
        errorMessage.includes('Invalid Credentials') ||
        errorMessage.includes('UNAUTHENTICATED')
      ) {
        setError({
          show: true,
          message: 'Authentication error. Please sign in again.',
          severity: 'error'
        })
      } else {
        setError({
          show: true,
          message: `Error saving draft: ${errorMessage}`,
          severity: 'error'
        })
      }
    } finally {
      setIsDraftSaving(false)
    }
  }

  const handleSignAndSave = async () => {
    if (!isAuthenticated) {
      setError({
        show: true,
        message: 'You need to sign in to sign and save your resume',
        severity: 'warning'
      })
      return
    }

    if (!instances?.resumeVC || !instances?.resumeManager) {
      setError({
        show: true,
        message: 'Required services not available. Please try again later.',
        severity: 'error'
      })
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
      if (!keyPair) throw new Error('Failed to generate key pair')

      // Create DID document
      const didDoc = await instances.resumeVC.createDID({ keyPair })
      if (!didDoc) throw new Error('Failed to create DID document')

      if (!resume) {
        throw new Error('Resume is null, cannot prepare for VC')
      }

      const preparedResume = prepareResumeForVC(resume)
      console.log('PREPARED FORM DATA', preparedResume)

      // Sign resume
      const signedResume = await instances.resumeVC.sign({
        formData: preparedResume,
        issuerDid: didDoc.id,
        keyPair
      })
      if (!signedResume) throw new Error('Failed to sign resume')

      // Save resume
      const file = await instances.resumeManager.saveResume({
        resume: signedResume,
        type: 'sign'
      })
      if (!file?.id) throw new Error('Failed to save resume')

      const { accessToken, refreshToken } = getTokens()
      await storeFileTokens({
        googleFileId: file.id,
        tokens: {
          accessToken: accessToken ?? '',
          refreshToken: refreshToken ?? ''
        }
      })

      console.log('Resume successfully signed and saved:', signedResume)

      setError({
        show: true,
        message: 'Resume successfully signed and saved!',
        severity: 'success'
      })

      // If process completes before 3 seconds, clear the timer
      // and manually set loading state to false
      if (loadingTimer) {
        clearTimeout(loadingTimer)
        setIsSigningSaving(false)
      }
    } catch (error) {
      console.error('Error signing and saving:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'

      if (
        errorMessage.includes('Invalid Credentials') ||
        errorMessage.includes('UNAUTHENTICATED')
      ) {
        setError({
          show: true,
          message: 'Authentication error. Please sign in again.',
          severity: 'error'
        })
      } else {
        setError({
          show: true,
          message: `Error signing and saving: ${errorMessage}`,
          severity: 'error'
        })
      }

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
    setResumeName(resume?.name ?? 'Untitled')
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
      setResumeName(resume?.name ?? 'Untitled')
    }
  }

  return (
    <Box sx={{ p: 6 }}>
      {isEditMode && (
        <Typography variant='body1' sx={{ mb: 2, color: 'gray' }}>
          Editing an existing resume
        </Typography>
      )}

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
                    fontWeight: 600,
                    lineHeight: '55.88px'
                  },
                  '& .MuiInput-underline:before': { borderBottomColor: '#614BC4' },
                  '& .MuiInput-underline:after': { borderBottomColor: '#614BC4' }
                }}
              />
            ) : (
              <Typography
                sx={{
                  color: '#000',
                  fontFamily: 'Poppins',
                  fontSize: '42px',
                  fontWeight: 600,
                  lineHeight: '55.88px'
                }}
              >
                {resume?.name ?? 'Untitled'}
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
              fontWeight: 500,
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

          <Tooltip title={!isAuthenticated ? 'Sign in to save your resume' : ''}>
            <span>
              <Button
                variant='outlined'
                sx={ButtonStyles}
                onClick={handleSaveDraft}
                disabled={isDraftSaving || !isAuthenticated}
                startIcon={
                  isDraftSaving ? <CircularProgress size={20} color='inherit' /> : null
                }
              >
                {isDraftSaving ? 'Saving...' : 'Save as Draft'}
              </Button>
            </span>
          </Tooltip>

          <Tooltip title={!isAuthenticated ? 'Sign in to sign and save your resume' : ''}>
            <span>
              <Button
                variant='outlined'
                sx={{ ...ButtonStyles, color: 'white', bgcolor: '#614BC4' }}
                onClick={handleSignAndSave}
                disabled={isSigningSaving || !isAuthenticated}
                startIcon={
                  isSigningSaving ? <CircularProgress size={20} color='inherit' /> : null
                }
              >
                {isSigningSaving ? 'Saving...' : 'Save and Sign'}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <BorderLinearProgress variant='determinate' value={100} />

      <Typography
        sx={{
          color: '#2E2E48',
          fontFamily: 'DM Sans',
          fontSize: '16px',
          fontWeight: 500,
          letterSpacing: '0.16px',
          mt: '20px'
        }}
      >
        Any section left blank will not appear on your resume.
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
        <LeftSidebar />

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
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
      <Snackbar
        open={error.show}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseError}
          severity={error.severity}
          sx={{ width: '100%' }}
        >
          {error.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ResumeEditor
