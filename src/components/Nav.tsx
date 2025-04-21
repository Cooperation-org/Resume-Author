import Logo from '../assets/logo.png'
import { AppBar, Toolbar, Box, Typography, Stack, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLocalStorage } from '../tools/cookie'
import { useSelector, useDispatch } from 'react-redux'
import { setAuth } from '../redux/slices/auth'
import { RootState } from '../redux/store'
import Notification from './common/Notification'
import { logout } from '../tools/auth'

const navStyles = {
  color: 'white',
  textTransform: 'capitalize',
  fontWeight: 600,
  fontSize: '16px',
  fontFamily: 'Nunito Sans'
}

const Nav = () => {
  const dispatch = useDispatch()
  const isLogged = useSelector((state: RootState) => state.auth.isAuthenticated)
  const navigate = useNavigate()
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const token = getLocalStorage('auth')
    if (token) dispatch(setAuth({ accessToken: token }))
  }, [dispatch])

  const handleLogout = () => {
    logout()
    setShowNotification(true)
    navigate('/')
  }

  return (
    <>
      <AppBar
        position='static'
        elevation={0}
        sx={{ bgcolor: '#4527A0', pt: 1, pr: 5, pl: 4 }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', flexGrow: 1 }}>
            <img src={Logo} alt='Résumé Author' style={{ height: '50px' }} />
            <Typography sx={{ fontFamily: 'Poppins', fontSize: '32px', fontWeight: 700 }}>
              Resume Author
            </Typography>
          </Box>

          {!isLogged ? (
            <Stack direction='row' spacing={5}>
              {['Why Resume Author?', 'How it works', 'Benefits', 'Learn More'].map(
                label => (
                  <Button key={label} color='inherit' sx={navStyles}>
                    {label}
                  </Button>
                )
              )}
            </Stack>
          ) : (
            <Button onClick={handleLogout} color='inherit' sx={navStyles}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification
        open={showNotification}
        message="You've been successfully logged out"
        severity='success'
        onClose={() => setShowNotification(false)}
      />
    </>
  )
}

export default Nav
