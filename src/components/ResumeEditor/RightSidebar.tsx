import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  CircularProgress,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Stack,
  InputAdornment
} from '@mui/material'
import { FileText, Sparkles, Search, School, Clock, Info } from 'lucide-react'
import useGoogleDrive from '../../hooks/useGoogleDrive'
import { useCallback, useEffect, useState } from 'react'
import { getLocalStorage, removeCookie, removeLocalStorage } from '../../tools'
import { login } from '../../tools/auth'
import { useDispatch } from 'react-redux'
import { setVCs } from '../../redux/slices/resume'

const RightSidebar = () => {
  const dispatch = useDispatch()

  const [claims, setClaims] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const accessToken = getLocalStorage('auth_token')

  const { storage } = useGoogleDrive()

  const getAllClaims = useCallback(async (): Promise<any> => {
    const claimsData = await storage?.getAllFilesByType('VCs')
    if (!claimsData?.length) return []
    return claimsData
  }, [storage])

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true)
      const claimsData = await getAllClaims()
      const vcs = claimsData.map((file: any[]) =>
        file.filter((f: { name: string }) => f.name !== 'RELATIONS')
      )
      const validVcs = vcs.filter((claim: any) => isValidClaim(claim))

      setClaims(vcs)
      dispatch(setVCs(validVcs) as any)
    } catch (error) {
      console.error('Error fetching claims:', error)
    } finally {
      setLoading(false)
    }
  }, [getAllClaims, dispatch])

  useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  const handleAuth = () => {
    if (!accessToken) {
      handleGoogleLogin()
    } else {
      handleLogout()
    }
  }

  const handleLogout = () => {
    removeCookie('auth_token')
    removeLocalStorage('user_info')
    removeLocalStorage('auth')
    setClaims([])
  }

  const handleGoogleLogin = () => {
    setLoading(true)
    login()
  }

  const isValidClaim = (claim: any) => {
    return (
      claim[0]?.data?.credentialSubject?.achievement[0]?.name &&
      claim[0]?.data?.credentialSubject?.name
    )
  }

  const defaultCredentials = [
    {
      type: 'Case Study',
      isCheckbox: true
    },
    {
      type: 'Service Mindset',
      institution: 'Arizona State University',
      date: 'Issued Feb 5, 2023',
      hasDetails: true
    },
    {
      type: 'Google UX Certification',
      icon: true
    }
  ]

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
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='subtitle1' fontWeight='600'>
              Add Credentials
            </Typography>
            <Info size={16} style={{ marginLeft: 8 }} />
          </Box>
          <Button size='small' sx={{ textTransform: 'none' }}>
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
            justifyContent: 'start',
            borderRadius: '100px'
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
            justifyContent: 'start',
            borderRadius: '100px',
            mb: 2
          }}
        >
          Connect Digital Wallet
        </Button>
      </Box>

      {/* Credentials Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant='subtitle1' fontWeight='600' sx={{ mb: 2 }}>
          Your Credentials
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          size='small'
          placeholder='Search for a credential'
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Search size={16} />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {/* Default Credentials */}
            <List sx={{ p: 0 }}>
              {defaultCredentials.map((credential, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  {credential.hasDetails ? (
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'start' }}>
                        <Checkbox size='small' sx={{ mt: 0.5, mr: 1 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant='subtitle2' sx={{ mb: 1 }}>
                            {credential.type}
                          </Typography>
                          <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <School size={16} />
                              <Typography variant='body2'>
                                {credential.institution}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Clock size={16} />
                              <Typography variant='body2'>{credential.date}</Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Checkbox size='small' />
                      </ListItemIcon>
                      <ListItemText primary={credential.type} />
                    </ListItem>
                  )}
                </Paper>
              ))}
            </List>

            {/* Google Drive Claims */}
            {claims.map(
              claim =>
                isValidClaim(claim) && (
                  <Paper
                    key={claim[0]?.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1.25rem'
                      }}
                    >
                      {claim[0]?.data?.credentialSubject?.achievement[0]?.name}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {claim[0]?.data?.credentialSubject?.name}
                    </Typography>
                  </Paper>
                )
            )}
          </Stack>
        )}
      </Box>

      {/* Insights */}
      <Box>
        <Typography variant='subtitle1' fontWeight='600' mb={1}>
          Insights
        </Typography>
        <Typography variant='body2' color='gray' mb={2}>
          Get AI insights on your resume, with suggestions on how to improve
        </Typography>
        <Button
          variant='outlined'
          fullWidth
          startIcon={<Sparkles />}
          sx={{ borderRadius: '100px' }}
        >
          Get Insights
        </Button>
      </Box>
    </Box>
  )
}

export default RightSidebar
