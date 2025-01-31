import React from 'react'
import { Box, Typography, styled } from '@mui/material'
import { SVGCopyCheck, SVGLink, SVGMobileImg, SVGline } from '../../assets/svgs'

const FeatureCard = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '144px',
  height: '144px',
  borderRadius: '100px',
  backgroundColor: '#E9E6F8',
  position: 'absolute',
  right: '-130px',
  top: '30px',
  border: '10px solid #F7F9FC',
  zIndex: 10
})

const LandingPage = () => {
  const sectionData = [
    {
      text: 'Import data from your existing resume, LinkedIn, or start with a blank template.',
      icon: <SVGCopyCheck />
    },
    {
      text: 'Edit or add details, and link to credentials and evidence to strengthen your resume.',
      icon: <SVGLink />
    },
    {
      text: 'Sign and save a verifiable presentation of your resume, proof it’s human-made.',
      icon: <SVGMobileImg />
    }
  ]
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '150px 20px 130px 20px',
        textAlign: 'center',
        backgroundColor: '#FFF',
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
        How Resume Author Works{' '}
      </Typography>

      <Typography
        sx={{
          color: '#000',
          fontSize: '32px',
          marginBottom: '70px'
        }}
      >
        Just 3 easy steps to get started.{' '}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: '0 120px',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          maxWidth: '100%'
        }}
      >
        {sectionData.map((section, index) => (
          <Box
            sx={{
              borderRadius: '20px',
              background: 'linear-gradient(180deg, #361F7D 0%, #414FCD 100%)',
              width: '18%',
              position: 'relative',
              p: '30px',
              minHeight: '200px'
            }}
          >
            <Typography
              sx={{
                color: '#FFF',
                fontFamily: 'Nunito Sans',
                fontSize: '32px',
                fontWeight: 500,
                lineHeight: 'normal',
                letterSpacing: '-0.32px'
              }}
            >
              {section.text}
            </Typography>
            <FeatureCard>{section.icon}</FeatureCard>
            {index !== sectionData.length - 1 && (
              <Box
                sx={{ position: 'absolute', right: '-170px', top: '100px', zIndex: 9 }}
              >
                <SVGline />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default LandingPage
