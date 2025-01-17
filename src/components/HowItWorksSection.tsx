import React from 'react'
import { Box, Typography } from '@mui/material'
import { SVGPreview, SVGRow } from '../assets/svgs'

const bosxText = [
  'Import data from your existing resume.',
  'Add details and link to your credentials.',
  'Share a verifiable presentation of your resume.'
]

const HowItWorksSection = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        alignItems: 'center',
        pt: { xs: '80px', sm: '150px' }, // responsive padding
        pb: { xs: '80px', sm: '150px' },
        gap: { xs: '20px', sm: '40px' } // responsive gap
      }}
    >
      <Typography
        variant='h1'
        sx={{
          color: '#292489',
          fontSize: { xs: '32px', sm: '55px' }, // responsive font size
          fontWeight: 600,
          textAlign: 'center' // Center text on small screens
        }}
      >
        How Resume Author Works
      </Typography>
      <Typography
        variant='h2'
        sx={{
          color: '#000',
          fontSize: { xs: '20px', sm: '32px' }, // responsive font size
          textAlign: 'center'
        }}
      >
        Just 3 easy steps to get started.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Stack items vertically on small screens
          gap: { xs: '20px', sm: '40px' }, // responsive gap
          alignItems: 'center',
          justifyContent: 'center',
          mt: { xs: '20px', sm: '40px' },
          mb: { xs: '80px', sm: '150px' }
        }}
      >
        {bosxText.map((text, index) => (
          <>
            <Box
              key={index}
              sx={{
                height: '109px',
                bgcolor: '#E9E6F8',
                borderRadius: '20px',
                p: { xs: '20px', sm: '20px' },
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                fontSize: { xs: '18px', sm: '28px' },
                justifyContent: 'center',
                maxWidth: { xs: '100%', sm: '340px' }
              }}
            >
              {text}
            </Box>
            {!text.includes('Share a verifiable presentation of your resume.') && (
              <SVGRow />
            )}
          </>
        ))}
      </Box>
      <SVGPreview /> {/* Ensure SVG scales correctly */}
    </Box>
  )
}

export default HowItWorksSection
