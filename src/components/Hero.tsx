import { Container, Box, Typography, Stack, Button } from '@mui/material'
import React from 'react'
import HeroImage from '../assets/hero.png'
import { Link } from 'react-router-dom'
import HowItWorksSection from './HowItWorksSection'
import HowResumeAuthorWorks from './HowResumeAuthorWorks'
import WhoBenefitsSection from './WhoBenefitsSection'

const Hero = () => {
  return (
    <div>
      <Container maxWidth='lg' sx={{ mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            minHeight: '60vh'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant='h1'
              sx={{
                color: 'white',
                fontSize: '3.5rem',
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
                    p: '11px 100px',
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
                    p: '11px 100px',
                    borderRadius: '100px',
                    textTransform: 'capitalize',
                    fontWeight: 700
                  }}
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

          <Box sx={{}}>
            <Box
              component='img'
              src={HeroImage}
              alt='Construction worker'
              sx={{ width: 400, height: 400, borderRadius: '50%' }}
            />
          </Box>
        </Box>
      </Container>
      <HowItWorksSection />
      <HowResumeAuthorWorks />
      <WhoBenefitsSection />
    </div>
  )
}

export default Hero
