import Logo from '../assets/logo.png'
import { AppBar, Toolbar, Box, Typography, Stack, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingOverlay from './Loading'
import { getLocalStorage, removeLocalStorage } from '../tools/cookie'

const navStyles = {
  color: 'white',
  textTransform: 'capitalize',
  fontWeight: 600,
  fontSize: '16px',
  fonstFamily: 'Nunito sans'
}

const Nav = () => {
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLogged, setIsLogged] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (window.location.hash) {
      setLoading(true)
      navigate('/resume/new')
      setLoading(false)
    }
    const token = getLocalStorage('auth')
    if (token) {
      setIsLogged(true)
    }
  }, [navigate])

  const habdleLogout = () => {
    removeLocalStorage('auth')
    setIsLogged(false)
  }

  return (
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
          <Button onClick={habdleLogout} color='inherit' sx={navStyles}>
            Logout
          </Button>
        )}
      </Toolbar>
      <LoadingOverlay open={loading} />
    </AppBar>
  )
}

export default Nav
