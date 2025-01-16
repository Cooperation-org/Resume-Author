// src/components/Layout/Sidebar.tsx
import React from 'react'
import { Box } from '@mui/material'
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
      <SVGRightLine />
    </Box>,
    <SVGCopySidebar />,
    <SVGAddSidebar />,
    <SVGSettings />,
    <SVGLineDown />
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
