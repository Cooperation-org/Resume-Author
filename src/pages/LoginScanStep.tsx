import { Box, Typography, CircularProgress } from '@mui/material'
import { SVGLogoDescreption, SVGALoginLogo } from '../assets/svgs'
import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import ErrorIcon from '@mui/icons-material/Error'
import { v4 as uuidv4 } from 'uuid'
import { getOrCreateAppInstanceDid } from '@cooperation/vc-storage'

export default function LoginScanStep() {
  const [qrData, setQrData] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      const sessionId = uuidv4()
      const { did: resumeDid } = await getOrCreateAppInstanceDid()

      const SERVER_URL = 'http://192.168.1.26:3000'
      const WALLET_DEEP_LINK = 'walletapp://import'
      const exchangeUrl = `${SERVER_URL}/api/exchanges/${sessionId}`

      const res = await fetch(exchangeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appInstanceDid: resumeDid })
      })

      if (!res.ok) {
        setError('Failed to connect to the wallet')
        setIsLoading(false)
        return
      }

      const chapiRequest = {
        credentialRequestOrigin: SERVER_URL,
        protocols: {
          vcapi: exchangeUrl
        }
      }

      const encodedRequest = encodeURIComponent(JSON.stringify(chapiRequest))
      const lcwRequestUrl = `${WALLET_DEEP_LINK}?request=${encodedRequest}`

      setQrData(lcwRequestUrl)
      setIsLoading(false)
    })()
  }, [])

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
            Connect with Learner Credential Wallet
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
        {/* Left Section */}
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
              mt: 2,
              p: '15px',
              width: '221px'
            }}
          >
            <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
              Need Learner Credential Wallet?
            </Typography>
            <Typography
              component='a'
              href='#'
              sx={{
                color: '#2563EB',
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'underline',
                '&:hover': { opacity: 0.8 }
              }}
            >
              Go here to download and install
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24, md: 30 },
              fontWeight: 700,
              color: '#44464D',
              mb: 2,
              textAlign: 'center',
              fontFamily: 'Poppins'
            }}
          >
            Scan the QR Code
          </Typography>

          <Typography
            sx={{
              color: '#2D2D47',
              fontSize: { xs: 14, sm: 18 },
              mb: 3,
              textAlign: 'center',
              fontFamily: 'Nunito Sans',
              maxWidth: 400
            }}
          >
            Open LCW on your phone and scan this QR code to connect and transfer your
            resume into the wallet.
          </Typography>

          {/* QR Block */}
          <Box
            sx={{
              my: 3,
              display: 'flex',
              justifyContent: 'center',
              width: 256,
              height: 256,
              bgcolor: 'white',
              p: 2,
              borderRadius: 1,
              border: '1px solid #eee',
              position: 'relative'
            }}
          >
            {isLoading ? (
              <CircularProgress />
            ) : error ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <ErrorIcon color='error' sx={{ fontSize: 48, mb: 2 }} />
                <Typography color='error' textAlign='center'>
                  {error}
                </Typography>
              </Box>
            ) : (
              <QRCode value={qrData} size={256} level='H' />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
