import React from 'react'
import { Box, Typography } from '@mui/material'

const SelectCards = () => {
  const sectionData = [
    'People Skilled Through Alternative Routes (STARS)',
    'Job Seekers',
    'Career Changers',
    'Small to Medium Sized Business Owners',
    'Chamber of Commerce Foundation Partners',
    'Recruiters',
    'Students and Recent Graduates',
    'Freelancers',
    'International Workers',
    'People Returning to Work',
    'Open Source Software Companies ',
    'Hiring Managers'
  ]
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '130px',
        textAlign: 'center',
        backgroundColor: '#F3F5F8',
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
        How Resume Author Works
      </Typography>

      <Typography
        sx={{
          color: '#000',
          fontSize: '32px',
          marginBottom: '70px'
        }}
      >
        Just 3 easy steps to get started.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '60px'
        }}
      >
        <Box
          sx={{
            display: 'flex:',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {sectionData.slice(0, 4).map((section, index) => (
            <Box
              sx={{
                borderRadius: '20px',
                background: '#E9E6F8',
                p: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: '15px'
              }}
            >
              <Typography
                variant='h4'
                sx={{ color: '#292489', fontSize: '24px', fontWeight: '600' }}
              >
                {index + 1}. {section}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex:',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {sectionData.slice(4, 8).map((section, index) => (
            <Box
              sx={{
                borderRadius: '20px',
                background: '#E9E6F8',
                p: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: '15px'
              }}
            >
              <Typography
                variant='h4'
                sx={{ color: '#292489', fontSize: '24px', fontWeight: '600' }}
              >
                {index + 1}. {section}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex:',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {sectionData.slice(8, 12).map((section, index) => (
            <Box
              sx={{
                borderRadius: '20px',
                background: '#E9E6F8',
                p: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: '15px'
              }}
            >
              <Typography
                variant='h4'
                sx={{ color: '#292489', fontSize: '24px', fontWeight: '600' }}
              >
                {index + 1}. {section}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default SelectCards
