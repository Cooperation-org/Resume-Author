import { Box, Typography, Button, Divider, Stack } from '@mui/material'
import {
  getCookie,
  getLocalStorage,
  removeCookie,
  removeLocalStorage
} from '../../tools/cookie'
import { login } from '../../tools/auth'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import {
  fileIconSVG,
  checkmarkBlueSVG,
  checkmarkgraySVG,
  uploadArrowUpSVG
} from '../../assets/svgs'

interface RootState {
  vcReducer: {
    vcs: any[]
    status: string
  }
}

const RightSidebar = () => {
  const [selectedClaims, setSelectedClaims] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { vcs: claims, status } = useSelector((state: any) => state.vcReducer)
  const accessToken = getLocalStorage('auth')

  console.log('🚀 ~ RightSidebar ~ claims:', claims)

  // Redux state connection kept for future use
  useSelector((state: RootState) => state.vcReducer)

  const dummyCredentials = [
    { id: '1', name: 'Case Study' },
    { id: '2', name: 'Google UX Certification' },
    { id: '3', name: 'Coursera UX Design Essentials' },
    { id: '4', name: 'English Language Proficiency Certification' },
    { id: '5', name: 'Foundations of User Experience (UX) Design' },
    { id: '6', name: 'Language Description and Documentation' },
    { id: '7', name: 'Start the UX Design Process: Empathize, Define, and Ideate' },
    { id: '8', name: 'Introduction to Interaction Design' },
    { id: '9', name: 'UX Design for Beginners' },
    { id: '10', name: 'User Interface Design Essentials' }
  ]

  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles') ?? '[]')
    setUploadedFiles(savedFiles)
  }, [])

  const handleAuth = () => {
    const accessToken = getCookie('auth_token') // Ensure this matches the correct cookie key
    if (!accessToken) {
      handleGoogleLogin() // If no token, login
    } else {
      handleLogout() // If logged in, logout
    }
  }

  const handleLogout = () => {
    removeCookie('auth_token') // Ensure it matches the correct key
    removeLocalStorage('user_info')
    removeLocalStorage('auth')
    setSelectedClaims([]) // Clear selected claims
  }

  const handleGoogleLogin = async () => {
    await login() // Redirects to Google OAuth login
  }

  const handleClaimToggle = (claimId: string) => {
    setSelectedClaims(prev => {
      const isSelected = prev.includes(claimId)
      if (isSelected) {
        return prev.filter(id => id !== claimId)
      } else {
        return [...prev, claimId]
      }
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileNames = Array.from(files).map(file => file.name)
      setUploadedFiles(prevFiles => {
        const newFiles = [...prevFiles, ...fileNames]
        localStorage.setItem('uploadedFiles', JSON.stringify(newFiles))
        return newFiles
      })
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name)
      setUploadedFiles(prevFiles => {
        const newFiles = [...prevFiles, ...fileNames]
        localStorage.setItem('uploadedFiles', JSON.stringify(newFiles))
        return newFiles
      })
    }
  }

  return (
    <Box
      sx={{
        width: '29%',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        bgcolor: 'white',
        pr: '40px'
      }}
    >
      {/* Section 1: Library Header and Buttons */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          backgroundColor: '#FFF',
          padding: '20px',
          borderRadius: 2,
          boxShadow: '0px 2px 20px rgba(0,0,0,0.10)'
        }}
      >
        <Typography
          sx={{ fontSize: 18, fontWeight: 700, color: 'black', fontFamily: 'Poppins' }}
        >
          Library
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Typography sx={{ fontSize: 16, color: '#47516B', fontFamily: 'Nunito Sans' }}>
            To access credentials from Google Drive, select the Import from Google Drive
            button.
          </Typography>
          <Button
            disabled={!!accessToken}
            fullWidth
            variant='outlined'
            sx={{
              borderRadius: '100px',
              borderColor: '#3A35A2',
              color: '#3A35A2',
              fontSize: 18,
              textTransform: 'none',
              backgroundColor: 'transparent',
              fontFamily: 'Nunito Sans'
            }}
            onClick={handleAuth}
          >
            Import Credentials from Google Drive
          </Button>
        </Box>
        <Divider sx={{ borderColor: '#47516B' }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Typography sx={{ fontSize: 16, color: '#47516B' }}>
            To check for new credentials in your wallet, select the refresh button below:
          </Typography>
          <Button
            onClick={() => alert('Pressed!')}
            variant='outlined'
            fullWidth
            sx={{
              color: '#3A35A2',
              borderRadius: '100px',
              borderColor: '#3A35A2',
              fontSize: 18,
              textTransform: 'none',
              backgroundColor: 'transparent'
            }}
          >
            Refresh Learner Credential Wallet
          </Button>
        </Box>
      </Box>

      {/* Credentials Section */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#47516B',
            fontFamily: 'Poppins'
          }}
        >
          Your Credentials
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 24, height: 24, mr: '12px', display: 'flex' }}>
            {checkmarkBlueSVG()}
          </Box>
          <Typography
            sx={{
              fontSize: 14,
              color: '#2D2D47',
              fontWeight: 500,
              fontFamily: 'Nunito Sans'
            }}
          >
            Items with a filled-in checkmark are included in your resume.
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#47516B', mt: '3px' }} />

        <Box
          sx={{
            maxHeight: dummyCredentials.length > 10 ? 531 : 'auto',
            overflowY: dummyCredentials.length > 10 ? 'auto' : 'visible',
            paddingRight: 1
          }}
        >
          <Stack spacing={2}>
            {dummyCredentials.map(claim => (
              <Box sx={{ display: 'flex', alignItems: 'center' }} key={claim.id}>
                <Box sx={{ width: 24, height: 24, mr: '10px', display: 'flex' }}>
                  {selectedClaims.includes(claim.id)
                    ? checkmarkBlueSVG()
                    : checkmarkgraySVG()}
                </Box>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: '#2563EB',
                    textDecoration: 'underline',
                    fontFamily: 'Nunito Sans',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleClaimToggle(claim.id)}
                >
                  {claim.name}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Section 3: Your Files */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          backgroundColor: '#FFF',
          padding: '20px',
          borderRadius: 2,
          boxShadow: '0px 2px 20px rgba(0,0,0,0.10)'
        }}
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography
            sx={{
              fontSize: 16,
              color: '#47516B',
              fontWeight: 700,
              fontFamily: 'Poppins'
            }}
          >
            Your Files
          </Typography>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Box sx={{ width: 24, height: 24 }}>{uploadArrowUpSVG()}</Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 24, height: 24, mr: '12px', display: 'flex' }}>
            {checkmarkBlueSVG()}
          </Box>
          <Typography
            sx={{
              fontSize: 14,
              color: '#2D2D47',
              fontWeight: 500,
              fontFamily: 'Nunito Sans'
            }}
          >
            Items with a filled-in checkmark are included in your resume.
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#47516B' }} />

        {/* File Drop Area */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: '15px',
            mb: '10px',
            gap: '12px',
            cursor: 'pointer'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Typography
            sx={{
              fontSize: 24,
              color: '#9CA3AF',
              fontFamily: 'Poppins',
              fontWeight: 600
            }}
          >
            {uploadedFiles.length === 0 ? 'No files yet...' : 'Your Uploaded Files'}
          </Typography>
          <Box sx={{ width: 'auto', height: 54, display: 'flex' }}>{fileIconSVG()}</Box>
          <Typography
            sx={{ fontSize: 16, textAlign: 'center', fontFamily: 'Nunito Sans' }}
          >
            Drop your file here or browse
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: '#9CA3AF',
              textAlign: 'center',
              fontFamily: 'Nunito Sans'
            }}
          >
            Maximum size: 50MB
          </Typography>

          <input
            type='file'
            id='file-upload'
            multiple
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            accept='application/pdf, image/*'
          />
        </Box>

        {/* Uploaded Files List */}
        <Box
          sx={{
            maxHeight: uploadedFiles.length > 10 ? 531 : 'auto',
            overflowY: uploadedFiles.length > 10 ? 'auto' : 'visible',
            textWrap: 'wrap',
            wordBreak: 'break-word',
            paddingRight: 1
          }}
        >
          <Stack spacing={2}>
            {uploadedFiles.map((file, index) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }} key={file}>
                <Box sx={{ width: 24, height: 24, mr: '10px', display: 'flex' }}>
                  {checkmarkBlueSVG()}
                </Box>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: '#2563EB',
                    textDecoration: 'underline',
                    fontFamily: 'Nunito Sans',
                    cursor: 'pointer'
                  }}
                >
                  {file}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default RightSidebar
