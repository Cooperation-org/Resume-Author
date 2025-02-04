import { Container, Box, Typography, Stack, Button } from '@mui/material'
import React from 'react'
import HeroImage from '../assets/image 1.png'
import HeroImage2 from '../assets/Union.png'
import HeroImage3 from '../assets/Union-2.png'
import { Link, useNavigate } from 'react-router-dom'
import HowItWorksSection from './landingPageSections/HowItWorksSection'
import HowResumeAuthorWorks from './landingPageSections/HowResumeAuthorWorks'
import WhoBenefitsSection from './landingPageSections/WhoBenefitsSection'
import SelectCards from './landingPageSections/SelectCards'
import MoreAbout from './landingPageSections/MoreAboutResumeAuthor'
import Footer from './landingPageSections/Footer'
import { getCookie } from '../tools/cookie'
import { login } from '../tools/auth'

const Hero = () => {
  const navigate = useNavigate()
  const handleLogin = async () => {
    const accessToken = getCookie('auth_token') // Make sure this matches the correct cookie key

    if (accessToken) {
      console.log('Already logged in')
      navigate('/resume/new') // Redirect if already logged in
      return
    }

    await login() // Redirects to Google OAuth login
  }
  return (
    <div>
      <Container maxWidth='lg' sx={{ mt: 8, pb: 8 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '50px',
            minHeight: '60vh'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant='h1'
              sx={{
                color: 'white',
                fontSize: '50px',
                fontWeight: 700,
                mb: 2
              }}
            >
              Prove your skills in a verifiable resume that employers trust.{' '}
            </Typography>
            <Typography sx={{ color: 'white', mb: 4, fontSize: '1.2rem' }}>
              Resume Author transforms bullet points into verified proof of your skills,
              turning your experience into a compelling, interactive story.
            </Typography>
            <Stack direction='row' spacing={2}>
              <Link to='/resume/import'>
                <Button
                  variant='contained'
                  sx={{
                    bgcolor: '#4527A0',
                    color: 'white',
                    p: '11px 80px',
                    borderRadius: '100px',
                    border: '2px solid #FFF',
                    textTransform: 'capitalize'
                  }}
                >
                  Sign Up
                </Button>
              </Link>
              <Link to='/resume/new'>
                <Button
                  variant='outlined'
                  sx={{
                    color: '#4527A0',
                    bgcolor: 'white',
                    p: '11px 80px',
                    borderRadius: '100px',
                    textTransform: 'capitalize',
                    fontWeight: 700
                  }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Link>
            </Stack>
            <Typography
              sx={{ mt: 4, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}
            >
              Created for you by the US Chamber of Commerce Foundation T3 Innovation
              Network.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: '27px' }}>
            <Box
              component='img'
              src={HeroImage}
              alt='Construction worker'
              sx={{ width: 200, height: 400 }}
            />
            <Box
              component='img'
              src={HeroImage2}
              alt='Construction worker'
              sx={{ width: 200, height: 400 }}
            />
            <Box
              component='img'
              src={HeroImage3}
              alt='Construction worker'
              sx={{ width: 200, height: 400 }}
            />
          </Box>
        </Box>
      </Container>
      <HowItWorksSection />
      <WhoBenefitsSection />
      <HowResumeAuthorWorks />
      <SelectCards />
      <MoreAbout />
      <Footer />
    </div>
  )
}

export default Hero
