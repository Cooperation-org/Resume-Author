import Logo from '../assets/logo.png'
import { AppBar, Toolbar, Box, Typography, Stack, Button } from '@mui/material'
import { login as googleLogin, handleRedirect } from '../tools/auth' // Import your auth functions
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingOverlay from './Loading'
import { getCookie, removeCookie, removeLocalStorage } from '../tools'

const Nav = () => {
  const [loading, setLoading] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (window.location.hash) {
      setLoading(true)
      handleRedirect({ navigate })
      setLoading(false)
    }
    const token = getCookie('auth_token')
    if (token) {
      setIsLogged(true)
    }
  }, [navigate])

  return (
    <AppBar
      position='static'
      elevation={0}
      sx={{ bgcolor: 'transparent', pt: 1, pr: 5, pl: 4 }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <img src={Logo} alt='Résumé Author' style={{ height: '50px' }} />
          <Typography sx={{ fontFamily: 'Poppins', fontSize: '32px', fontWeight: 700 }}>
            Resume Author
          </Typography>
        </Box>
        <Stack direction='row' spacing={5}>
          <Button
            color='inherit'
            sx={{
              color: 'white',
              textTransform: 'capitalize',
              fontWeight: 500,
              fontSize: '16px'
            }}
          >
            How it works
          </Button>
          <Button
            color='inherit'
            sx={{
              color: 'white',
              textTransform: 'capitalize',
              fontWeight: 500,
              fontSize: '16px'
            }}
          >
            Why Resume Author?
          </Button>
          <Button
            color='inherit'
            sx={{
              color: 'white',
              textTransform: 'capitalize',
              fontWeight: 500,
              fontSize: '16px'
            }}
          >
            Benefits
          </Button>
          <Button
            color='inherit'
            sx={{
              color: 'white',
              textTransform: 'capitalize',
              fontWeight: 500,
              fontSize: '16px'
            }}
          >
            Learn More
          </Button>
        </Stack>
      </Toolbar>
      <LoadingOverlay open={loading} />
    </AppBar>
  )
}

export default Nav
