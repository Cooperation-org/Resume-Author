// import { Resume } from '@cooperation/vc-storage'
// import { Title } from '@mui/icons-material'
import {
  Box,
  Typography,
  Button,
  Divider,
  // Collapse,
  // IconButton,
  Paper,
  CircularProgress
} from '@mui/material'
import {
  // DeleteIcon,
  FileText,
  Sparkles
} from 'lucide-react'
import { getCookie, removeCookie, removeLocalStorage } from '../../tools'
import { login } from '../../tools/auth'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { RootState } from '../../redux/store'

const RightSidebar = () => {
  const { vcs, status, error } = useSelector((state: RootState) => state.vcReducer)

  const accessToken = getCookie('accessToken')
  const handleAuth = () => {
    if (!accessToken) {
      handleGoogleLogin()
    } else {
      handleLogout()
    }
  }

  const handleLogout = () => {
    removeCookie('accessToken')
    removeLocalStorage('user_info')
    removeLocalStorage('auth')
    setClaims([])
  }

  const handleGoogleLogin = () => {
    login()
  }

  const isValidClaim = (claim: any) => {
    return (
      claim[0]?.data?.credentialSubject?.achievement[0]?.name &&
      claim[0]?.data?.credentialSubject?.name
    )
  }

  return (
    <Box sx={{ width: 280 }}>
      {/* Title */}
      <Typography variant='subtitle1' fontWeight='600'>
        Title of Resume (editable)
      </Typography>
      <Typography variant='caption' color='gray' mb={4}>
        12:53pm Saved
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {/* Add Credentials */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            mb: 2
          }}
        >
          <Typography variant='subtitle1' fontWeight='600'>
            Add Credentials
          </Typography>
          <Button size='small' sx={{ textTransform: 'none', ml: 1 }}>
            Learn more
          </Button>
        </Box>
        <Button
          onClick={handleAuth}
          variant='outlined'
          fullWidth
          startIcon={<FileText />}
          sx={{
            mb: 2,
            fontSize: '0.8rem',
            display: 'flex',
            justifyContent: 'start'
          }}
        >
          {accessToken ? 'Log out' : 'Connect Google Drive'}
        </Button>
        <Button
          variant='outlined'
          fullWidth
          startIcon={<FileText />}
          sx={{
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            display: 'flex',
            justifyContent: 'start'
          }}
        >
          Connect Digital Wallet
        </Button>
      </Box>

      {status === 'loading' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {vcs.map(
            claim =>
              isValidClaim(claim) && (
                <Paper
                  key={claim[0]?.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid gray',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.25rem'
                    }}
                  >
                    {claim[0]?.data?.credentialSubject?.achievement[0]?.name} -
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {claim[0]?.data?.credentialSubject?.name} -{' '}
                  </Typography>
                </Paper>
              )
          )}
        </Box>
      )}

      {/* Insights */}
      <Box>
        <Typography variant='subtitle1' fontWeight='600' mb={1}>
          Insights
        </Typography>
        <Typography variant='body2' color='gray' mb={2}>
          Get AI insights on your resume, with suggestions on how to improve
        </Typography>
        <Button variant='outlined' fullWidth startIcon={<Sparkles />}>
          Get Insights
        </Button>
      </Box>
    </Box>
  )
}

export default RightSidebar
