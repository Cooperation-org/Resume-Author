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
  CircularProgress
} from '@mui/material'
import LeftSidebar from './ResumeEditor/LeftSidebar'
import RightSidebar from './ResumeEditor/RightSidebar'
import Section from './ResumeEditor/Section'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/store'
import { SVGEditName } from '../assets/svgs'
import useGoogleDrive from '../hooks/useGoogleDrive'
import { useNavigate, useLocation } from 'react-router-dom'
import { updateSection, setSelectedResume } from '../redux/slices/resume'
import OptionalSectionsManager from './ResumeEditor/OptionalSectionCard'
import { storeFileTokens } from '../firebase/storage'
import { getLocalStorage } from '../tools/cookie'
import { prepareResumeForVC } from '../tools/resumeAdapter'

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
  const location = useLocation()
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
  const [isLoading, setIsLoading] = useState(false)

  const resume = useSelector((state: RootState) => state?.resume.resume)
  const { instances } = useGoogleDrive()
  const accessToken = getLocalStorage('auth')
  const refreshToken = getLocalStorage('refresh_token')

  // Parse the query parameters to get the resume ID
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const resumeId = queryParams.get('id')

    if (resumeId && instances) {
      const fetchResumeData = async () => {
        setIsLoading(true)

        try {
          // @ts-ignore - We've already checked that instances exists
          const fileData = await instances.storage.retrieve(resumeId)

          if (fileData) {
            // Use any data we get directly
            // @ts-ignore - We're handling the data as a generic object
            const resumeData = fileData.data || fileData

            // Dispatch to Redux
            dispatch(setSelectedResume(resumeData))

            // Try to set resume name if we can find it
            try {
              // @ts-ignore - Handling different possible structures
              const name =
                resumeData.contact?.fullName || resumeData.name || 'Untitled Resume'
              setResumeName(name)
            } catch (e) {
              setResumeName('Untitled Resume')
            }

            console.log('Resume loaded successfully')
          } else {
            console.error('Retrieved resume data is empty')
          }
        } catch (error) {
          console.error('Error retrieving resume data:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchResumeData()
    }
  }, [location.search, instances, dispatch])

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

      if (!resume) {
        console.error('Resume is null, cannot prepare for VC')
        return
      }
      const preparedResume = prepareResumeForVC(resume)
      console.log('PREPARED FORM DATA', preparedResume)

      // Sign resume
      const signedResume = await instances.resumeVC.sign({
        formData: preparedResume,
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        mx: 'auto',
        mt: 3,
        pr: 6,
        pl: 6
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading resume data...</Typography>
        </Box>
      ) : (
        <>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '0 20px'
            }}
          >
            {/* Resume Name */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isEditingName ? (
                  <TextField
                    autoFocus
                    value={resumeName}
                    onChange={handleNameChange}
                    onBlur={handleNameSave}
                    onKeyPress={handleNameKeyPress}
                    variant='standard'
                    sx={{ fontWeight: 'bold' }}
                  />
                ) : (
                  <>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: '#2E2E48'
                      }}
                    >
                      {resumeName}
                    </Typography>
                    <IconButton onClick={handleEditNameClick} size='small'>
                      <SVGEditName />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}
            >
              <Typography
                sx={{
                  color: '#2E2E48',
                  fontFamily: 'Nunito Sans',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  letterSpacing: '0.16px'
                }}
              >
                Name your resume with your first and last name so recruiters can easily
                locate your resume.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  onClick={handlePreview}
                  sx={{
                    ...ButtonStyles,
                    backgroundColor: '#3A35A2',
                    color: 'white',
                    '&:hover': { backgroundColor: '#322e8e' }
                  }}
                >
                  Preview
                </Button>
                <Button
                  onClick={handleSaveDraft}
                  disabled={isDraftSaving}
                  sx={{
                    ...ButtonStyles,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                  startIcon={
                    isDraftSaving && <CircularProgress size={20} color='inherit' />
                  }
                >
                  {isDraftSaving ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  onClick={handleSignAndSave}
                  disabled={isSigningSaving}
                  sx={{
                    ...ButtonStyles,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                  startIcon={
                    isSigningSaving && <CircularProgress size={20} color='inherit' />
                  }
                >
                  {isSigningSaving ? 'Signing...' : 'Sign And Save'}
                </Button>
              </Box>
            </Box>
          </Box>
          {/* Rest of the component */}
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
        </>
      )}
    </Box>
  )
}

export default ResumeEditor
