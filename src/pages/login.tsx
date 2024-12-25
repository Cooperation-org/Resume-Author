import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Tooltip } from '@mui/material'
import { SVGFolder, SVGSinfo } from '../assets/svgs'
import LoadingOverlay from '../components/Loading'
import { login as googleLogin, handleRedirect } from '../tools/auth' // Import your auth functions

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate() // For navigation

  // Check and handle redirect if coming back from Google OAuth
  useEffect(() => {
    if (window.location.hash) {
      setLoading(true) // Show loading while processing
      handleRedirect({ navigate }) // Pass navigate to redirect logic
      setLoading(false) // Hide loading after processing
    }
  }, [navigate])

  // Handle the login button click
  const handleGoogleLogin = () => {
    setLoading(true) // Show loading while redirecting
    googleLogin()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        textAlign: 'center',
        height: '60vh',
        mt: 4
      }}
    >
      {/* Google Drive Icon */}
      <Box
        sx={{
          width: 100,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SVGFolder />
      </Box>

      {/* Main text */}
      <Typography
        sx={{
          fontSize: 24
        }}
      >
        First, connect to Google Drive so you can save your data.
      </Typography>

      {/* Google Login Button */}
      <Button
        variant='contained'
        color='primary'
        onClick={handleGoogleLogin}
        sx={{
          mt: 2,
          px: 4,
          py: 0.5,
          fontSize: '16px',
          borderRadius: 5,
          textTransform: 'none',
          backgroundColor: '#003FE0'
        }}
      >
        Connect to Google Drive{' '}
        <Tooltip title='You must have a Google Drive account and be able to log in. This is where your credentials will be saved.'>
          <Box sx={{ ml: 2, mt: '2px' }}>
            <SVGSinfo />
          </Box>
        </Tooltip>
      </Button>

      {/* Skip Login Button */}
      <Button
        variant='text'
        color='primary'
        onClick={() => navigate('/')} // Skip login and go to home page
        sx={{
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'underline',
          textTransform: 'none'
        }}
      >
        Continue without Saving
      </Button>

      {/* Loading Overlay */}
      <LoadingOverlay text='Connecting...' open={loading} />
    </Box>
  )
}

export default Login
