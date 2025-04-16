import { Box, Typography, Button, Link, CircularProgress } from '@mui/material'
import { SVGLogoDescreption, SVGALoginLogo } from '../assets/svgs'
import { useNavigate } from 'react-router-dom'
import { login } from '../tools/auth'
import { useState, useEffect, useRef } from 'react'
import QRCode from 'react-qr-code'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

export default function LoginScanStep() {
  const navigate = useNavigate()
  const [qrData, setQrData] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [authStatus, setAuthStatus] = useState('pending') // 'pending', 'authenticated', 'failed'
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const fetchQrData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('http://localhost:3000/api/lcw/qr-code')

        if (!response.ok) {
          throw new Error('Failed to fetch QR code data')
        }

        const data = await response.json()
        console.log('🚀 ~ fetchQrData ~ data:', data)
        setSessionId(data.sessionId)

        const qrValue = `walletapp://import?payload=${encodeURIComponent(JSON.stringify(data))}`
        setQrData(qrValue)
      } catch (err: any) {
        console.error('Error fetching QR code data:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQrData()

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current as NodeJS.Timeout)
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [connectionAttempts])

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handleGoogleSignIn = () => {
    login(`/resume/import`)
  }

  const handleRefresh = () => {
    // Reset states
    setQrData('')
    setSessionId('')
    setError('')
    setAuthStatus('pending')
    setTimeRemaining(300)
    setConnectionAttempts(prev => prev + 1)
  }

  const handleButtonClick = () => {
    if (error) {
      handleRefresh()
    } else {
      handleGoogleSignIn()
    }
  }

  return (
    <Box sx={{ width: '100%', bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box
        sx={{
          width: '100%',
          bgcolor: '#F7F9FC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 3, md: 6 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            maxWidth: 'fit-content'
          }}
        >
          <Box sx={{ transform: { xs: 'scale(0.8)', sm: 'scale(0.9)', md: 'scale(1)' } }}>
            <SVGALoginLogo />
          </Box>
          <Typography
            sx={{
              fontSize: { xs: 24, sm: 32, md: 40, lg: 48 },
              fontWeight: 700,
              color: '#44464D',
              textAlign: 'center',
              lineHeight: 1.2,
              fontFamily: 'Poppins'
            }}
          >
            Login with Learner Credential Wallet
          </Typography>
        </Box>
      </Box>

      {/* Main Content Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
          px: { xs: 2, sm: 4, md: 8, lg: 25 },
          py: { xs: 4, md: 8 },
          gap: { xs: 6, md: 15 },
          bgcolor: '#FFFFFF'
        }}
      >
        {/* Left Section with Logo */}
        <Box
          sx={{
            width: { xs: '100%', sm: '80%', md: '40%' },
            maxWidth: { xs: 400, md: 'none' },
            transform: { xs: 'scale(0.9)', md: 'scale(1)' }
          }}
        >
          <SVGLogoDescreption />
          <Box
            sx={{
              bgcolor: '#E9E6F8',
              borderRadius: 2,
              '& .MuiOutlinedInput-input': { fontSize: 14 },
              mt: 2,
              p: '15px',
              width: '221px'
            }}
          >
            <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
              Need Learner Credential Wallet?
            </Typography>
            <Link
              href='#'
              sx={{
                color: 'var(--Primary-Link, #2563EB)',
                fontFamily: '"Nunito Sans"',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 'normal',
                letterSpacing: '-0.14px',
                textDecoration: 'underline',
                textDecorationStyle: 'solid',
                textDecorationSkipInk: 'auto',
                textUnderlineOffset: 'auto',
                textUnderlinePosition: 'from-font',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              Go here to download and install
            </Link>
          </Box>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' }
          }}
        >
          {/* Headers with Poppins */}
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24, md: 30 },
              fontWeight: 700,
              color: '#44464D',
              mb: 2,
              textAlign: { xs: 'center', md: 'left' },
              width: '100%',
              fontFamily: 'Poppins'
            }}
          >
            Choose Login Method
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24, md: 30 },
              fontWeight: 700,
              color: '#44464D',
              mb: 2,
              textAlign: { xs: 'center', md: 'left' },
              width: '100%',
              fontFamily: 'Poppins'
            }}
          >
            Scan the QR Code
          </Typography>

          {/* Regular text with Nunito Sans */}
          <Typography
            sx={{
              color: '#2D2D47',
              fontSize: { xs: 14, sm: 18 },
              mb: 3,
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: { xs: '100%', sm: '90%', md: '100%' },
              fontFamily: 'Nunito Sans'
            }}
          >
            If you have the Learner Credential Wallet installed on your phone, use your
            phone's camera to scan this QR code to authorize Resume Author to store your
            credentials and resumes in Learner Credential Wallet.
          </Typography>
          <Box
            sx={{
              my: 3,
              transform: { xs: 'scale(0.9)', sm: 'scale(1)' },
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              width: '100%',
              bgcolor: 'white',
              p: 2,
              borderRadius: 1,
              border: '1px solid #eee',
              position: 'relative'
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 256,
                  width: 256
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 256,
                  width: 256
                }}
              >
                <ErrorIcon color='error' sx={{ fontSize: 48, mb: 2 }} />
                <Typography color='error' textAlign='center' sx={{ px: 2 }}>
                  {error}
                </Typography>
              </Box>
            ) : (
              <>
                <QRCode
                  value={qrData}
                  size={256}
                  level='H'
                  fgColor='#3A35A2'
                  bgColor='#FFFFFF'
                />
                {authStatus === 'authenticated' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 1
                    }}
                  >
                    <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 64, mb: 2 }} />
                    <Typography
                      sx={{
                        color: '#4CAF50',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        textAlign: 'center'
                      }}
                    >
                      Authentication Successful
                    </Typography>
                    <Typography sx={{ mt: 1, textAlign: 'center' }}>
                      Redirecting to Resume Author...
                    </Typography>
                  </Box>
                )}

                {/* QR Code Timer */}
                {!error && authStatus !== 'authenticated' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      fontSize: '0.8rem'
                    }}
                  >
                    {formatTimeRemaining()}
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Status message */}
          <Box sx={{ width: '100%', mb: 2 }}>
            {authStatus === 'pending' && !error && (
              <Typography
                sx={{
                  color: '#2D2D47',
                  fontSize: { xs: 14, sm: 16 },
                  textAlign: { xs: 'center', md: 'left' },
                  fontFamily: 'Nunito Sans'
                }}
              >
                Waiting for wallet connection... The QR code will expire in{' '}
                {formatTimeRemaining()}.
              </Typography>
            )}
            {authStatus === 'authenticated' && (
              <Typography
                sx={{
                  color: '#4CAF50',
                  fontSize: { xs: 14, sm: 16 },
                  fontWeight: 'bold',
                  textAlign: { xs: 'center', md: 'left' },
                  fontFamily: 'Nunito Sans'
                }}
              >
                Connection successful! You will be redirected shortly.
              </Typography>
            )}
          </Box>

          {/* Regular text with Nunito Sans */}
          <Typography
            sx={{
              color: '#2D2D47',
              fontSize: { xs: 14, sm: 18 },
              mb: 4,
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: { xs: '100%', sm: '90%', md: '100%' },
              fontFamily: 'Nunito Sans'
            }}
          >
            If your screen doesn't automatically refresh after you consent in the wallet,
            select the Launch Resume Author button to continue:
          </Typography>

          {/* Buttons section */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' },
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}
          >
            <Button
              onClick={() => navigate('/')}
              variant='outlined'
              sx={{
                border: '2px solid #3A35A2',
                color: '#3A35A2',
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 'bold',
                minWidth: { xs: '80%', sm: 120 },
                p: '21px 31px',
                fontFamily: 'Nunito Sans'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleButtonClick}
              variant='outlined'
              sx={{
                border: '2px solid #3A35A2',
                bgcolor: '#FFF',
                color: '#3A35A2',
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 700,
                minWidth: { xs: '80%', sm: 200 },
                p: '21px 31px',
                fontFamily: 'Nunito Sans'
              }}
            >
              {error ? 'Refresh QR Code' : 'Launch Resume Author'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
