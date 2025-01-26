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

const Sidebar = () => {
  const Icons = [
    <Box sx={{ mb: 2 }}>
      <IconButton>
        <SVGRightLine />
      </IconButton>
    </Box>,
    <IconButton>
      <SVGCopySidebar />
    </IconButton>,
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
