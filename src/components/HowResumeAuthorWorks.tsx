import React from 'react'
import { Box, Typography, styled } from '@mui/material'
import { SVGCopyCheck, SVGLink, SVGMobileImg } from '../assets/svgs'

const FeatureCard = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '200px',
  height: '200px',
  borderRadius: '100px',
  backgroundColor: '#E9E6F8'
})

const LandingPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '150px 20px 80px 20px',
        textAlign: 'center',
        backgroundColor: '#F7F9FC',
        gap: '30px'
      }}
    >
      <Typography
        variant='h1'
        sx={{
          color: '#292489',
          fontSize: '55px',
          fontWeight: '600',
          marginBottom: '16px'
        }}
      >
        Why choose Resume Author?
      </Typography>

      <Typography
        sx={{
          color: '#000',
          fontSize: '32px',
          marginBottom: '70px'
        }}
      >
        Empowering you to showcase your skills through a tamper-proof verifable resume.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          marginBottom: '48px'
          // p: '0 40px'
        }}
      >
        <Box
          sx={{
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}
        >
          <FeatureCard>
            <SVGCopyCheck />
          </FeatureCard>
          <Typography variant='h6' sx={{ fontWeight: '600' }}>
            Tell Your Story
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#666666' }}>
            Add credentials to validate your skills.
          </Typography>
        </Box>

        <Box
          sx={{
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            mb: '30px'
          }}
        >
          <FeatureCard>
            <SVGLink />
          </FeatureCard>
          <Typography variant='h6' sx={{ fontWeight: '600' }}>
            Link Credentials
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#666666' }}>
            Show how users can link their narrative to credentials
          </Typography>
        </Box>

        <Box
          sx={{
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}
        >
          <FeatureCard>
            <SVGMobileImg />
          </FeatureCard>
          <Typography variant='h6' sx={{ fontWeight: '600' }}>
            Share Anywhere
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#666666' }}>
            Publish your verified resume on LinkedIn or send it directly to employers.
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: '50px',
          fontWeight: '500',
          lineHeight: 'normal',
          color: '#000',
          fontFamily: 'Poppins',
          maxWidth: '1000px'
        }}
      >
        Whether you're a student, front-line worker, freelancer, or experienced
        professional, Resume Author helps you stand out with an interactive, verifiable
        resume.
      </Typography>
    </Box>
  )
}

export default LandingPage
