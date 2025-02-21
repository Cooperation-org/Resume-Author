import React, { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  SVGRightLine,
  SVGCopySidebar,
  SVGLineDown,
  SVGAddSidebar,
  SVGLogOut
} from '../../assets/svgs'
import logo from '../../assets/logo.png'

interface SidebarProps {
  onToggle: () => void
  isExpanded: boolean
}

const ui = {
  fontFamily: 'Proxima Nova',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: '21px'
}

const Sidebar = ({ onToggle, isExpanded }: SidebarProps) => {
  const [selectedItem, setSelectedItem] = useState<string>('')
  const navigate = useNavigate()

  const boxStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    width: isExpanded ? '200px' : '48px',
    justifyContent: 'flex-start',
    borderRadius: '8px'
  }

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '15px',
    width: isExpanded ? '200px' : '48px',
    transition: 'width 0.3s ease'
  }

  const getIconStyles = (key: string) => ({
    '& svg path': {
      fill: selectedItem === key ? '#361F7D' : undefined
    }
  })

  const getTextStyles = (key: string) => ({
    ...ui,
    color: selectedItem === key ? '#361F7D' : '#FFF'
  })

  const getButtonStyles = (key: string) => ({
    backgroundColor: selectedItem === key ? '#F3F4F6' : 'transparent',
    borderRadius: '8px',
    ...getIconStyles(key),
    '&:hover': {
      backgroundColor: '#F3F4F6',
      '& svg path': {
        fill: '#361F7D'
      },
      '& .MuiTypography-root': {
        color: '#361F7D'
      }
    }
  })

  const handleMyResumesClick = () => {
    setSelectedItem('copy')
    navigate('/myresumes')
  }

  const handleNewResumeClick = () => {
    setSelectedItem('add')
    navigate('/resume/new')
  }

  const Icons = [
    <Box sx={boxStyles} key='rightLine'>
      <IconButton onClick={onToggle}>
        {isExpanded && (
          <>
            <img src={logo} alt='Résumé Author' style={{ height: '50px' }} />
            <Typography
              sx={{ ...ui, fontSize: '20px', mr: '10px', ml: '10px', color: '#FFF' }}
            >
              Resume Author
            </Typography>
          </>
        )}
        <SVGRightLine />
      </IconButton>
    </Box>,
    <IconButton key='copy' onClick={handleMyResumesClick} sx={getButtonStyles('copy')}>
      <Box sx={boxStyles}>
        <SVGCopySidebar />
        {isExpanded && <Typography sx={getTextStyles('copy')}>My Resumes</Typography>}
      </Box>
    </IconButton>,
    <IconButton key='add' onClick={handleNewResumeClick} sx={getButtonStyles('add')}>
      <Box sx={boxStyles}>
        <SVGAddSidebar />
        {isExpanded && <Typography sx={getTextStyles('add')}>New Resume</Typography>}
      </Box>
    </IconButton>,
    <IconButton
      key='settings'
      onClick={() => setSelectedItem('settings')}
      sx={getButtonStyles('settings')}
    >
      <Box sx={boxStyles}>
        <SVGLogOut />
        {isExpanded && <Typography sx={getTextStyles('settings')}>Logout</Typography>}
      </Box>
    </IconButton>,
    <IconButton
      key='lineDown'
      onClick={() => setSelectedItem('lineDown')}
      sx={getButtonStyles('lineDown')}
    >
      <Box sx={boxStyles}>
        <SVGLineDown />
        {isExpanded && <Typography sx={getTextStyles('lineDown')}>FAQs</Typography>}
      </Box>
    </IconButton>
  ]

  return <Box sx={containerStyles}>{Icons.map(item => item)}</Box>
}

export default Sidebar
