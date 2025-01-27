import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  TextField,
  List,
  Checkbox,
  Stack,
  InputAdornment,
  Divider
} from '@mui/material'
import { getCookie, removeCookie, removeLocalStorage } from '../../tools'
import { SVGLine, SVGSearch } from '../../assets/svgs'
import { signInWithGoogle } from '../../firebase/auth'
import { useSelector } from 'react-redux'
import { useState } from 'react'

const paperStyle = {
  display: 'flex',
  padding: '20px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '20px',
  alignSelf: 'stretch',
  borderRadius: '8px',
  bgcolor: '#FFF',
  boxShadow: '0px 2px 20px 0px rgba(0,0,0,0.10)',
  height: 'fit-content'
}

const placeholderStyle = {
  '& .MuiInputBase-input::placeholder': {
    color: 'var(--neutral-light-n-100, #7A869A)',
    fontFamily: '"Proxima Nova", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '20px',
    opacity: 1
  }
}
const RightSidebar = () => {
  const [loading, setLoading] = useState(false)
  const [selectedClaims, setSelectedClaims] = useState<string[]>([])

  const { vcs: claims, status } = useSelector((state: any) => state.vcReducer)
  console.log('🚀 ~ RightSidebar ~ claims:', claims)
  const handleAuth = () => {
    const accessToken = getCookie('accessToken')
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
    // setClaims([])
    setSelectedClaims([])
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    await signInWithGoogle()
  }

  const handleClaimToggle = (claimId: string) => {
    setSelectedClaims(prev => {
      const isSelected = prev.includes(claimId)
      if (isSelected) {
        return prev.filter(id => id !== claimId)
      } else {
        return [...prev, claimId]
      }
    })
  }

  const isValidClaim = (claim: any) => {
    console.log('🚀 ~ isValidClaim ~ claim:', claim)
    const body = JSON.parse(claim[0].data.body)
    console.log('🚀 ~ isValidClaim ~ body:', body)
    return body.credentialSubject.name && body.credentialSubject?.name
  }

  return (
    <Box sx={{ width: 300, ...paperStyle }}>
      <Typography
        sx={{
          fontFamily: '"Proxima Nova", "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: '18px',
          fontWeight: 700
        }}
      >
        Credential Library
      </Typography>

      {/* Add Credentials */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Proxima Nova", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '13px',
            fontWeight: 700
          }}
        >
          Add Credentials
        </Typography>
        <SVGLine />
        <Button
          size='small'
          sx={{
            textTransform: 'none',
            fontFamily: '"Proxima Nova", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            color: '#6B79F6'
          }}
        >
          Learn more
        </Button>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Button
          onClick={handleAuth}
          variant='outlined'
          fullWidth
          sx={{
            fontSize: '0.8rem',
            border: '1px solid #3A35A2',
            color: '#3A35A2',
            borderRadius: '100px'
          }}
        >
          Connect Google Drive
        </Button>
        <Button
          variant='outlined'
          fullWidth
          sx={{
            fontSize: '0.8rem',
            borderRadius: '100px',
            border: '1px solid #3A35A2',
            color: '#3A35A2'
          }}
        >
          Connect Digital Wallet
        </Button>
      </Box>

      {/* Credentials Section */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Typography
          sx={{
            fontFamily: '"Proxima Nova", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: '#47516B',
            mb: 1,
            mt: 1
          }}
        >
          Your Credentials
        </Typography>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            placeholder='Search for a credential'
            fullWidth
            value={''}
            onChange={() => {}}
            size='small'
            InputProps={{
              endAdornment: (
                <InputAdornment
                  sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                  position='end'
                >
                  <SVGSearch />
                </InputAdornment>
              )
            }}
            sx={{
              bgcolor: '#F3F5F8',
              borderRadius: '3px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' }
              },
              ...placeholderStyle
            }}
          />
        </Box>

        {status !== 'succeeded' ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack>
            <List sx={{ p: 0 }}>
              {claims.map(
                (claim: any) =>
                  isValidClaim(claim) && (
                    <Paper key={claim[0]?.id} elevation={0}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'end' }}>
                          <Checkbox
                            size='small'
                            sx={{
                              mt: 0.5,
                              color: '#47516B',
                              '&.Mui-checked': {
                                color: '#3A35A2'
                              }
                            }}
                            checked={selectedClaims.includes(claim[0]?.id)}
                            onChange={() => handleClaimToggle(claim[0]?.id)}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant='subtitle2' sx={{ mb: 1 }}>
                              {
                                JSON.parse(claim[0].data.body).credentialSubject
                                  ?.achievement[0]?.name
                              }
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Divider />
                    </Paper>
                  )
              )}
            </List>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default RightSidebar
