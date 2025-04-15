import React from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import Nav from '../components/Nav'
import Hero from '../components/Hero'

const Landing: React.FC = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        bgcolor: '#4527A0',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden'
      }}
    >
      <Nav />
      <Hero />
    </Box>
  )
}

export default Landing
