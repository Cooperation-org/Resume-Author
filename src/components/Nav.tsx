import Logo from '../assets/logo.png'
import { AppBar, Toolbar, Box, Typography, Stack, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLocalStorage, removeLocalStorage } from '../tools/cookie'
import { useSelector, useDispatch } from 'react-redux'
import { setAuth, clearAuth } from '../redux/slices/auth'
import { RootState } from '../redux/store'
import Notification from './common/Notification'

const navStyles = {
  color: 'white',
  textTransform: 'capitalize',
  fontWeight: 600,
  fontSize: '16px',
  fonstFamily: 'Nunito sans'
}

const Nav = () => {
  const dispatch = useDispatch()
  const isLogged = useSelector((state: RootState) => state.auth.isAuthenticated)
  const navigate = useNavigate()
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const token = getLocalStorage('auth')
    if (token) {
      dispatch(setAuth({ accessToken: token }))
    }
  }, [dispatch])

  const handleLogout = () => {
    removeLocalStorage('auth')
    dispatch(clearAuth())
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
              <Button color='inherit' sx={navStyles}>
                Why Resume Author?
              </Button>
              <Button color='inherit' sx={navStyles}>
                How it works
              </Button>
              <Button color='inherit' sx={navStyles}>
                Benefits
              </Button>
              <Button color='inherit' sx={navStyles}>
                Learn More
              </Button>
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
