// src/components/Layout/Sidebar.tsx
import React from 'react'
import { Box, IconButton } from '@mui/material'
import {
  SVGSettings,
  SVGRightLine,
  SVGCopySidebar,
  SVGLineDown,
  SVGAddSidebar
} from '../../assets/svgs'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const Icons = [
    <Box sx={{ mb: 2 }}>
      <Link to='/'>
        <IconButton>
          <SVGRightLine />
        </IconButton>
      </Link>
    </Box>,
    <Link to='/myresumes'>
      <IconButton>
        <SVGCopySidebar />
      </IconButton>
    </Link>,
    <IconButton>
      <SVGAddSidebar />
    </IconButton>,
    <IconButton>
      <SVGSettings />
    </IconButton>,
    <IconButton>
      <SVGLineDown />
    </IconButton>
  ]
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px' }}
    >
      {Icons.map(item => item)}
    </Box>
  )
}

export default Sidebar
