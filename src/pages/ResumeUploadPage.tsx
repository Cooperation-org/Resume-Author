import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSelectedResume } from '../redux/slices/resume'

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#FFFFFF',
  padding: '20px'
}))

const FormContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
  maxWidth: '600px',
  padding: '40px',
  borderRadius: '10px',
  border: '1px solid #E1E5E9',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
}))

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#2563EB',
  color: '#FFFFFF',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  padding: '12px 24px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#1d4ed8'
  },
  '&:disabled': {
    backgroundColor: '#9CA3AF',
    color: '#FFFFFF'
  }
}))

// Function to transform VC data to resume format
const transformVCToResume = (vcData: any) => {
  const credentialSubject = vcData.credentialSubject
  const person = credentialSubject.person
  const contact = person.contact

  const transformedResume = {
    name: person.name?.formattedName || '',
    contact: {
      fullName: contact?.fullName || person.name?.formattedName || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      location: {
        street: contact?.location?.street || '',
        city: contact?.location?.city || '',
        state: contact?.location?.state || '',
        country: contact?.location?.country || '',
        postalCode: contact?.location?.postalCode || ''
      },
      socialLinks: {
        linkedin: contact?.socialLinks?.linkedin || '',
        github: contact?.socialLinks?.github || '',
        portfolio: contact?.socialLinks?.portfolio || '',
        twitter: contact?.socialLinks?.twitter || ''
      }
    },
    summary: credentialSubject.narrative?.text?.replace(/<[^>]*>/g, '') || '',
    experience: {
      items: (credentialSubject.employmentHistory || []).map((exp: any) => ({
        id: exp.id || `exp-${Date.now()}-${Math.random()}`,
        company: exp.organization?.tradeName || '',
        position: exp.title || '',
        title: exp.title || '',
        description: exp.description || '',
        duration: exp.duration || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        stillEmployed: exp.stillEmployed || false,
        verificationStatus: exp.verificationStatus || 'unverified'
      }))
    },
    education: {
      items: (credentialSubject.educationAndLearning || []).map((edu: any) => ({
        id: edu.id || `edu-${Date.now()}-${Math.random()}`,
        institution: edu.institution || '',
        type: edu.degree || '',
        programName: edu.fieldOfStudy || '',
        duration: edu.duration || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        inProgress: false,
        currentlyEnrolled: false,
        awardEarned: false,
        verificationStatus: edu.verificationStatus || 'unverified'
      }))
    },
    skills: {
      items: (credentialSubject.skills || []).map((skill: any) => ({
        id: skill.id || `skill-${Date.now()}-${Math.random()}`,
        skills: skill.name || '',
        verificationStatus: skill.verificationStatus || 'unverified'
      }))
    },
    certifications: {
      items: (credentialSubject.certifications || []).map((cert: any) => ({
        id: cert.id || `cert-${Date.now()}-${Math.random()}`,
        name: cert.name || '',
        issuer: cert.issuer || '',
        issueDate: cert.date || '',
        url: cert.url || '',
        noExpiration: false,
        verificationStatus: cert.verificationStatus || 'unverified'
      }))
    },
    projects: {
      items: (credentialSubject.projects || []).map((project: any) => ({
        id: project.id || `proj-${Date.now()}-${Math.random()}`,
        name: project.name || '',
        description: project.description || '',
        url: project.url || '',
        duration: project.duration || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        verificationStatus: project.verificationStatus || 'unverified'
      }))
    },
    professionalAffiliations: {
      items: (credentialSubject.professionalAffiliations || []).map(
        (affiliation: any) => ({
          id: affiliation.id || `aff-${Date.now()}-${Math.random()}`,
          name: affiliation.name || '',
          organization: affiliation.organization || '',
          role: affiliation.name || '',
          startDate: affiliation.startDate || '',
          endDate: affiliation.endDate || '',
          duration: affiliation.duration || '',
          activeAffiliation: affiliation.activeAffiliation || false,
          verificationStatus: affiliation.verificationStatus || 'unverified'
        })
      )
    },
    volunteerWork: {
      items: (credentialSubject.volunteerWork || []).map((volunteer: any) => ({
        id: volunteer.id || `vol-${Date.now()}-${Math.random()}`,
        role: volunteer.role || '',
        organization: volunteer.organization || '',
        location: volunteer.location || '',
        startDate: volunteer.startDate || '',
        endDate: volunteer.endDate || '',
        duration: volunteer.duration || '',
        currentlyVolunteering: volunteer.currentlyVolunteering || false,
        description: volunteer.description || '',
        verificationStatus: volunteer.verificationStatus || 'unverified'
      }))
    },
    languages: {
      items: (credentialSubject.languages || []).map((lang: any) => ({
        id: lang.id || `lang-${Date.now()}-${Math.random()}`,
        name: lang.name || '',
        proficiency: lang.proficiency || ''
      }))
    },
    hobbiesAndInterests: credentialSubject.hobbiesAndInterests || []
  }

  return transformedResume
}

export default function ResumeUploadPage() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleTestSample = () => {
    setUrl(
      'https://linkedcreds.allskillscount.org/api/credential-raw/1nJczh7i0Ogp7ztADjdMisajja9CviDmJ'
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      let vcData

      // Try direct fetch first
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        vcData = await response.json()
      } catch (corsError) {
        console.log('Direct fetch failed, likely due to CORS. Trying backend proxy...')

        // Use the backend server as a proxy
        try {
          const backendUrl =
            process.env.REACT_APP_SERVER_URL || 'https://linkedcreds.allskillscount.org'
          const proxyUrl = `${backendUrl}/api/proxy-credential?url=${encodeURIComponent(url)}`

          const proxyResponse = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          })

          if (!proxyResponse.ok) {
            throw new Error(`Backend proxy error! status: ${proxyResponse.status}`)
          }

          vcData = await proxyResponse.json()
        } catch (backendError) {
          console.log('Backend proxy failed. Trying public CORS proxy...')

          // Fallback to public CORS proxy
          try {
            const publicProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
            const publicProxyResponse = await fetch(publicProxyUrl)

            if (!publicProxyResponse.ok) {
              throw new Error(`Public proxy error! status: ${publicProxyResponse.status}`)
            }

            const publicProxyData = await publicProxyResponse.json()
            vcData = JSON.parse(publicProxyData.contents)
          } catch (publicProxyError) {
            // If all attempts fail, provide user-friendly error message
            throw new Error(
              "Unable to fetch data due to CORS restrictions. This usually happens when the credential server doesn't allow cross-origin requests. Please contact the credential provider or try a different URL."
            )
          }
        }
      }

      // Validate that it's a verifiable credential with the expected structure
      if (!vcData || !vcData.credentialSubject || !vcData.credentialSubject.person) {
        throw new Error(
          'Invalid credential format: Missing required fields. Please ensure the URL returns a valid verifiable credential.'
        )
      }

      // Transform the VC data to resume format
      const transformedResume = transformVCToResume(vcData)

      // Store the transformed data in Redux
      dispatch(setSelectedResume(transformedResume))

      // Generate a temporary ID for the new resume
      const tempId = `temp-${Date.now()}`

      // Navigate to the resume editor with the loaded data
      navigate(`/resume/new?id=${tempId}`)
    } catch (err) {
      console.error('Error fetching resume data:', err)
      let errorMessage = 'Failed to fetch resume data from URL'

      if (err instanceof Error) {
        if (err.message.includes('CORS') || err.message.includes('cors')) {
          errorMessage =
            'CORS Error: The server does not allow cross-origin requests. Please contact the credential provider to enable CORS or use a different URL.'
        } else if (
          err.message.includes('NetworkError') ||
          err.message.includes('Failed to fetch')
        ) {
          errorMessage =
            'Network Error: Unable to connect to the URL. Please check your internet connection and ensure the URL is correct.'
        } else if (err.message.includes('Invalid credential format')) {
          errorMessage = err.message
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/resume/import')
  }

  return (
    <Container>
      <FormContainer>
        <Typography
          variant='h4'
          sx={{
            color: '#07142B',
            textAlign: 'center',
            fontFamily: 'Poppins',
            fontSize: '32px',
            fontWeight: 600,
            mb: 2
          }}
        >
          Upload Resume from URL
        </Typography>

        <Typography
          variant='body1'
          sx={{
            color: '#1F2937',
            textAlign: 'center',
            fontSize: '16px',
            mb: 3
          }}
        >
          Enter the URL of your verifiable credential to import your resume data
        </Typography>

        <Box sx={{ mb: 3, p: 2, backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
          <Typography variant='body2' sx={{ color: '#374151', mb: 1, fontWeight: 600 }}>
            💡 Tips for success:
          </Typography>
          <Typography variant='body2' sx={{ color: '#6B7280', fontSize: '14px', mb: 1 }}>
            • Make sure the URL is publicly accessible
          </Typography>
          <Typography variant='body2' sx={{ color: '#6B7280', fontSize: '14px', mb: 1 }}>
            • The URL should return a verifiable credential in JSON format
          </Typography>
          <Typography variant='body2' sx={{ color: '#6B7280', fontSize: '14px' }}>
            • If you encounter CORS errors, the system will automatically try proxy
            solutions
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label='Resume URL'
              placeholder='https://example.com/api/credential-raw/your-credential-id'
              value={url}
              onChange={e => setUrl(e.target.value)}
              disabled={isLoading}
              variant='outlined'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
            />
            <Button
              type='button'
              onClick={handleTestSample}
              disabled={isLoading}
              sx={{
                minWidth: '120px',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                '&:hover': {
                  backgroundColor: '#E5E7EB'
                }
              }}
            >
              Use Sample
            </Button>
          </Box>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              type='button'
              onClick={handleCancel}
              sx={{
                color: '#6B7280',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                '&:hover': {
                  backgroundColor: '#F9FAFB'
                }
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <StyledButton
              type='submit'
              disabled={isLoading || !url.trim()}
              startIcon={
                isLoading ? <CircularProgress size={20} color='inherit' /> : null
              }
            >
              {isLoading ? 'Loading...' : 'Import Resume'}
            </StyledButton>
          </Box>
        </form>
      </FormContainer>
    </Container>
  )
}
