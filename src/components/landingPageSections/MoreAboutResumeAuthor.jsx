import React from 'react'
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material'
import image from '../../assets/Resumes.png'
import image1 from '../../assets/Resumes-2.png'
import image2 from '../../assets/Resumes-3.png'

const MoreAbout = () => {
  const sectionData = [image, image1, image2]
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '130px',
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
          marginBottom: '70px'
        }}
      >
        Learn More About Resume Author{' '}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '60px'
        }}
      >
        {sectionData.map((section, index) => (
          <Card sx={{ maxWidth: 345, borderRadius: '20px 20px 0px 0px' }}>
            <CardMedia sx={{ height: 140 }} image={section} title='green iguana' />
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start'
              }}
            >
              <Typography
                sx={{ fontFamily: 'Nunito Sans', fontWeight: 700, fontSize: '20px' }}
                gutterBottom
              >
                Headline
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  fontFamily: 'Nunito Sans',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: 'text.secondary',
                  textAlign: 'left'
                }}
              >
                All Skills Count means any skill you have developed can be made into
                verifiable credential and embedded into your resume.
              </Typography>
              <Typography
                sx={{
                  color: '#2563EB',
                  fontFamily: 'Nunito Sans',
                  fontSize: '18px',
                  fontWeight: 500,
                  letterSpacing: '-0.18px',
                  textDecoration: 'underline',
                  textDecorationSkipInk: 'none',
                  textUnderlineOffset: 'auto',
                  textUnderlinePosition: 'from-font',
                  mt: '10px'
                }}
              >
                Read more{' '}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default MoreAbout
