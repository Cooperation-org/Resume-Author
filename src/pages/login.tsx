import React from 'react'
import { Box, Button, Typography, Link } from '@mui/material'
import img from '../assets/image 116.png'
import Nav from '../components/Nav'
import Footer from '../components/landingPageSections/Footer'
import {
  SVGAddGreenCheck,
  SVGHelpSection,
  SVGHeroicon2,
  SVGHeroicon1
} from '../assets/svgs'

interface FeatureListItemProps {
  text: string
}

const FeatureListItem: React.FC<FeatureListItemProps> = ({ text }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 1,
      '& .MuiSvgIcon-root': {
        color: 'primary.main',
        mr: 1
      }
    }}
  >
    <SVGAddGreenCheck />
    <Typography>{text}</Typography>
  </Box>
)

const DigitalWalletLogin: React.FC = () => {
  const features = [
    'Secure storage for credentials',
    'Embed credentials from your wallet into your resume',
    'Easy sharing with employers or institutions',
    'Ownership and control of your personal data'
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Nav />
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            height: '100%'
          }}
        >
          {/* Left Section */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              padding: '30px 75px'
            }}
          >
            <Box sx={{ p: { xs: 4 } }}>
              <Typography
                sx={{ fontSize: '55px' }}
                variant='h4'
                component='h1'
                gutterBottom
              >
                Login or Sign Up with a Digital Wallet
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                A digital wallet securely stores your credentials and allows
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                you to manage and share your information easily.
              </Typography>

              <Box sx={{ my: 4 }}>
                {features.map((feature, index) => (
                  <FeatureListItem key={index} text={feature} />
                ))}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2
                }}
              >
                <Button
                  variant='contained'
                  onClick={() => (window.location.href = '/login/wallet')}
                  sx={{
                    bgcolor: '#FFF',
                    color: '#4527A0',
                    p: '10px 20px',
                    borderRadius: '100px',
                    border: '2px solid #4527A0',
                    textTransform: 'capitalize'
                  }}
                >
                  Login with Learner Credential Wallet
                </Button>
                <Button
                  variant='contained'
                  onClick={() => (window.location.href = '/login/wallet')}
                  sx={{
                    bgcolor: '#FFF',
                    color: '#4527A0',
                    p: '10px 20px',
                    borderRadius: '100px',
                    border: '2px solid #4527A0',
                    textTransform: 'capitalize'
                  }}
                >
                  Sign Up with Learner Credential Wallet
                </Button>
              </Box>

              <Typography variant='caption' sx={{ display: 'block', mt: 2 }}>
                We currently support Learner Credential Wallet, an open source mobile
                wallet app developed by the Digital Credentials Consortium.
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant='body2'>
                  Don't see the wallet you want?{' '}
                  <Link href='#' color='primary'>
                    Send us an email to add it to our roadmap
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              flex: 1,
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                '& img': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }
              }}
            >
              <img src={img} alt='Solar panel worker' />
            </Box>
            <Box sx={{ position: 'absolute', top: '26%', left: '43%', zIndex: 111 }}>
              <SVGHelpSection />
            </Box>
            <Box sx={{ position: 'absolute', top: '26%', left: '41.5%', zIndex: 111 }}>
              <SVGHeroicon1 />
            </Box>
            <Box sx={{ position: 'absolute', top: '47.5%', left: '45%', zIndex: 111 }}>
              <SVGHeroicon2 />
            </Box>
            <Box sx={{ position: 'absolute', top: '48%', left: '44%', zIndex: 111 }}>
              <SVGHeroicon2 />
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default DigitalWalletLogin
