import React from 'react'
import { Box, Paper, Typography, styled } from '@mui/material'
import { SVGCheckMark } from '../assets/svgs'

const BenefitItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
  gap: 3
}))

const BenefitsSection = (props: any) => {
  const videoId = 'pcC4Dr6Wj2Q'
  const benefits = [
    {
      text: 'People Skilled Through Alternative Routes: Call out skills you earned through life or on-the-job experiences.',
      marginRight: '21px'
    },
    {
      text: 'Job Seekers: Stand out with an interactive resume that employers trust.',
      marginRight: '18px'
    },
    {
      text: 'Freelancers: Showcase your skills and projects with credibility.',
      marginRight: '21px'
    },
    {
      text: 'Students and Recent Graduates: Highlight achievements from courses, internships, side projects, and learning programs.',
      marginRight: '20px',
      compressed: true
    },
    {
      text: 'Career Changers: Prove your transferable skills with evidence.',
      marginRight: '20px'
    }
  ]

  const VideoContainer = ({ children }: any) => (
    <Box
      sx={{
        position: 'relative',
        width: '998px',
        paddingTop: '56.25%', // 16:9 Aspect Ratio
        backgroundColor: 'red'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        {children}
      </Box>
    </Box>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        alignItems: 'center',
        pt: '130px',
        pb: '70px'
      }}
    >
      <Typography
        sx={{
          color: '#292489',
          fontSize: { xs: '30px', sm: '55px' },
          fontWeight: '600',
          mb: '70px',
          textAlign: 'center'
        }}
      >
        Who can benefit from Resume Author?
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '25px',
          mb: '70px'
        }}
      >
        {benefits.map((benefit, index) => (
          <BenefitItem key={index} className={benefit.compressed ? 'compressed' : ''}>
            <SVGCheckMark />
            <Typography
              sx={{
                fontSize: { xs: '18px', sm: '22px' }
              }}
            >
              {benefit.text}
            </Typography>
          </BenefitItem>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          alignSelf: 'stretch'
        }}
      >
        <Paper elevation={1}>
          <VideoContainer>
            <iframe
              title='pref'
              src={`https://www.youtube.com/embed/${videoId}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </VideoContainer>
        </Paper>
      </Box>
    </Box>
  )
}

export default BenefitsSection
