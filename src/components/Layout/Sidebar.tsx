// src/components/Layout/Sidebar.tsx
import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import {
  SVGSettings,
  SVGRightLine,
  SVGCopySidebar,
  SVGLineDown,
  SVGAddSidebar
} from '../../assets/svgs'
import { Link } from 'react-router-dom'

interface SidebarProps {
  onToggle: () => void
  isExpanded: boolean
}

const ui = {
  color: '#FFF',
  fontFamily: 'Proxima Nova',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: '21px'
}

const Sidebar = ({ onToggle, isExpanded }: SidebarProps) => {
  const boxStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    width: isExpanded ? '200px' : '48px',
    justifyContent: 'flex-start'
  }

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '15px',
    width: isExpanded ? '200px' : '48px',
    transition: 'width 0.3s ease'
  }

  const Icons = [
    <Box sx={boxStyles} key='rightLine'>
      <IconButton onClick={onToggle}>
        {isExpanded && (
          <Typography sx={{ ...ui, fontSize: '20px' }}>Resume Author</Typography>
        )}
        <SVGRightLine />
      </IconButton>
    </Box>,
    <IconButton key='copy'>
      <Box sx={boxStyles}>
        <SVGCopySidebar />
        {isExpanded && <Typography sx={ui}>My Resumes</Typography>}
      </Box>
    </IconButton>,
    <IconButton key='add'>
      <Box sx={boxStyles}>
        <SVGAddSidebar />
        {isExpanded && <Typography sx={ui}>New Resume</Typography>}
      </Box>
    </IconButton>,
    <IconButton key='settings'>
      <Box sx={boxStyles}>
        <SVGSettings />
        {isExpanded && <Typography sx={ui}>App Connections</Typography>}
      </Box>
    </IconButton>,
    <IconButton key='lineDown'>
      <Box sx={boxStyles}>
        <SVGLineDown />
        {isExpanded && <Typography sx={ui}>Help</Typography>}
      </Box>
    </IconButton>
  ]

  return <Box sx={containerStyles}>{Icons.map(item => item)}</Box>
}

export default Sidebar
