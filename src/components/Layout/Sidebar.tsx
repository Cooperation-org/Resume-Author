import React, { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import {
  SVGRightLine,
  SVGCopySidebar,
  SVGLineDown,
  SVGAddSidebar,
  SVGLogOut
} from '../../assets/svgs'
import logo from '../../assets/logo.png'
import { removeCookie, removeLocalStorage } from '../../tools/cookie'
import { useDispatch } from 'react-redux'
import { clearAuth } from '../../redux/slices/auth'
import Notification from '../common/Notification'

interface SidebarProps {
  onToggle: () => void
  isExpanded: boolean
}

const ui = {
  fontFamily: 'Poppins',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: '21px'
}

const Sidebar = ({ onToggle, isExpanded }: SidebarProps) => {
  const [selectedItem, setSelectedItem] = useState<string>('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showNotification, setShowNotification] = useState(false)

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
  const handleFAQClick = () => {
    setSelectedItem('FAQ')
    navigate('/faq')
  }
  const handleLogOutClick = () => {
    setSelectedItem('logOut')
    handleLogout()
  }

  const handleLogout = () => {
    removeCookie('auth_token')
    removeLocalStorage('user_info')
    removeLocalStorage('auth')
    removeLocalStorage('refresh_token')
    dispatch(clearAuth())
    setShowNotification(true)
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }

  const Icons = [
    <Box sx={boxStyles} key='rightLine'>
      <IconButton onClick={onToggle}>
        {isExpanded && (
          <Link
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
            to='/'
          >
            <img src={logo} alt='Résumé Author' style={{ height: '50px' }} />
            <Typography
              sx={{ ...ui, fontSize: '20px', mr: '10px', ml: '10px', color: '#FFF' }}
            >
              Resume Author
            </Typography>
          </Link>
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
    <IconButton key='logOut' onClick={handleLogOutClick} sx={getButtonStyles('logOut')}>
      <Box sx={boxStyles}>
        <SVGLogOut />
        {isExpanded && <Typography sx={getTextStyles('logOut')}>Logout</Typography>}
      </Box>
    </IconButton>,
    <IconButton key='lineDown' onClick={handleFAQClick} sx={getButtonStyles('faq')}>
      <Box sx={boxStyles}>
        <SVGLineDown />
        {isExpanded && <Typography sx={getTextStyles('faq')}>FAQs</Typography>}
      </Box>
    </IconButton>
  ]

  return (
    <>
      <Box sx={containerStyles}>{Icons.map(item => item)}</Box>
      <Notification
        open={showNotification}
        message="You've been successfully logged out"
        severity='success'
        onClose={() => setShowNotification(false)}
      />
    </>
  )
}

export default Sidebar
