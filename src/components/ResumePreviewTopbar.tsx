import React from 'react'
import {
  Box,
  Typography,
  Button,
  createTheme,
  CircularProgress,
  useMediaQuery,
  Stack
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { prepareResumeForVC } from '../tools/resumeAdapter'
import { getLocalStorage } from '../tools/cookie'
import { storeFileTokens } from '../firebase/storage'
import useGoogleDrive from '../hooks/useGoogleDrive'

const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Ubuntu',
      '"Helvetica Neue"',
      'Helvetica',
      'Arial',
      '"PingFang SC"',
      '"Hiragino Sans GB"',
      '"Microsoft Yahei UI"',
      '"Microsoft Yahei"',
      '"Source Han Sans CN"',
      'sans-serif'
    ].join(','),
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '42px',
      lineHeight: '56px'
    },
    body1: {
      fontFamily: '"Nunito Sans", sans-serif',
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '24.552px',
      letterSpacing: '0.18px'
    },
    button: {
      fontFamily: '"Nunito Sans", sans-serif',
      fontWeight: 700,
      fontSize: '18px',
      textTransform: 'none'
    }
  },
  palette: {
    primary: {
      main: '#3a35a2'
    },
    background: {
      default: '#ffffff'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '100px',
          borderWidth: '3px',
          minWidth: 'unset'
        }
      }
    }
  }
})

interface ResumePreviewTopbarProps {
  isDraftSaving?: boolean
  isSigningSaving?: boolean
  setIsDraftSaving?: React.Dispatch<React.SetStateAction<boolean>>
  setIsSigningSaving?: React.Dispatch<React.SetStateAction<boolean>>
}

const ResumePreviewTopbar: React.FC<ResumePreviewTopbarProps> = ({
  isDraftSaving = false,
  isSigningSaving = false,
  setIsDraftSaving,
  setIsSigningSaving
}) => {
  const navigate = useNavigate()
  const resume = useSelector((state: RootState) => state?.resume.resume)
  const { instances } = useGoogleDrive()
  const accessToken = getLocalStorage('auth')
  const refreshToken = getLocalStorage('refresh_token')

  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  const handleBackToEdit = () => {
    navigate('/resume/new')
  }

  const handleSaveDraft = async () => {
    if (!instances?.resumeManager) {
      console.error('Resume manager not available')
      return
    }

    try {
      const savedResume = await instances.resumeManager.saveResume({
        resume: resume,
        type: 'unsigned'
      })
      console.log('Saved Resume:', savedResume)
    } catch (error) {
      console.error('Error saving draft:', error)
    }
  }

  const onSaveDraft = async () => {
    if (typeof setIsDraftSaving === 'function') {
      setIsDraftSaving(true)
    }

    await handleSaveDraft()

    if (typeof setIsDraftSaving === 'function') {
      setIsDraftSaving(false)
    }
  }

  const handleSignAndSave = async () => {
    if (!instances?.resumeVC || !instances?.resumeManager) {
      console.error('Required services not available')
      return
    }

    try {
      const keyPair = await instances.resumeVC.generateKeyPair()
      if (!keyPair) {
        throw new Error('Failed to generate key pair')
      }

      const didDoc = await instances.resumeVC.createDID({
        keyPair
      })
      if (!didDoc) {
        throw new Error('Failed to create DID document')
      }

      if (!resume) {
        console.error('Resume is null, cannot prepare for VC')
        return
      }
      const preparedResume = prepareResumeForVC(resume)
      console.log('PREPARED FORM DATA', preparedResume)

      const signedResume = await instances.resumeVC.sign({
        formData: preparedResume,
        issuerDid: didDoc.id,
        keyPair
      })
      if (!signedResume) {
        throw new Error('Failed to sign resume')
      }

      const file = await instances.resumeManager.saveResume({
        resume: signedResume,
        type: 'sign'
      })
      if (!file?.id) {
        throw new Error('Failed to save resume')
      }

      await storeFileTokens({
        googleFileId: file.id,
        tokens: {
          accessToken: accessToken ?? '',
          refreshToken: refreshToken ?? ''
        }
      })

      console.log('Resume successfully signed and saved:', signedResume)
    } catch (error) {
      console.error('Error signing and saving:', error)
    }
  }

  const onSignAndSave = async () => {
    if (typeof setIsSigningSaving === 'function') {
      setIsSigningSaving(true)
    }

    await handleSignAndSave()

    if (typeof setIsSigningSaving === 'function') {
      setIsSigningSaving(false)
    }
    navigate('/resume/import')
  }

  const getButtonSx = (baseWidth: string) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: {
      xs: '100%',
      sm: isSm ? baseWidth : '100%'
    },
    height: {
      xs: '36px',
      sm: '40px',
      md: '44px'
    },
    padding: {
      xs: '10px 15px',
      sm: '15px 20px',
      md: '18px 31px'
    },
    borderRadius: '100px',
    borderWidth: '3px',
    borderColor: '#3a35a2',
    color: '#3a35a2',
    fontFamily: '"Nunito Sans", sans-serif',
    fontSize: {
      xs: '14px',
      sm: '16px',
      md: '18px'
    },
    fontWeight: 700,
    lineHeight: '24px',
    textAlign: 'center',
    whiteSpace: {
      xs: 'normal',
      sm: 'nowrap'
    },
    textTransform: 'none'
  })

  return (
    <Box
      sx={{
        width: 'calc(100% - 5vw)',
        m: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: {
            xs: '2px',
            sm: '5px'
          },
          padding: {
            xs: '0 15px',
            sm: '0 20px',
            md: '0 10px 0 50px'
          },
          width: '100%',
          margin: 0
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: {
              xs: '10px',
              sm: '15px'
            },
            width: '100%',
            padding: {
              xs: '15px 0 10px 20px',
              sm: '20px 0 12px 22px',
              md: '30px 0 15px 0'
            },
            m: 0
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row'
              },
              alignItems: {
                xs: 'flex-start',
                md: 'flex-end'
              },
              justifyContent: {
                xs: 'flex-start',
                md: 'flex-end'
              },
              gap: {
                xs: '15px',
                sm: '17px'
              },
              width: '100%',
              zIndex: 1,
              m: 0
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                flexGrow: 1,
                gap: {
                  xs: '10px',
                  sm: '17px'
                },
                zIndex: 2,
                width: {
                  xs: '100%',
                  md: 'auto'
                },
                m: 0
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  gap: '17px',
                  zIndex: 3,
                  m: 0
                }}
              >
                <Typography
                  variant='h1'
                  sx={{
                    color: '#000000',
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: {
                      xs: '28px',
                      sm: '36px',
                      md: '42px'
                    },
                    fontWeight: 600,
                    lineHeight: {
                      xs: '36px',
                      sm: '46px',
                      md: '56px'
                    },
                    whiteSpace: 'nowrap',
                    m: 0
                  }}
                >
                  Preview
                </Typography>
              </Box>
              <Typography
                variant='body1'
                sx={{
                  color: '#2d2d47',
                  fontFamily: '"Nunito Sans", sans-serif',
                  fontSize: {
                    xs: '14px',
                    sm: '16px',
                    md: '18px'
                  },
                  fontWeight: 500,
                  lineHeight: {
                    xs: '20px',
                    sm: '22px',
                    md: '24.552px'
                  },
                  letterSpacing: '0.18px',
                  whiteSpace: 'normal',
                  maxWidth: {
                    xs: '100%',
                    md: '100%'
                  }
                }}
              >
                If everything looks good, you can select Sign and Save to create a
                verifiable presentation of your resume.
              </Typography>
            </Box>

            <Stack
              direction={{
                xs: 'column',
                sm: 'row'
              }}
              spacing={{
                xs: 2,
                sm: 2,
                md: 3
              }}
              sx={{
                width: {
                  xs: '100%',
                  md: 'auto'
                },
                mt: {
                  xs: 2,
                  md: 0
                },
                zIndex: 7
              }}
            >
              <Button
                variant='outlined'
                onClick={handleBackToEdit}
                sx={getButtonSx('163px')}
              >
                Back to Edit
              </Button>
              <Button
                variant='outlined'
                onClick={onSaveDraft}
                disabled={isDraftSaving}
                startIcon={
                  isDraftSaving ? (
                    <CircularProgress size={isXs ? 16 : 20} color='inherit' />
                  ) : null
                }
                sx={getButtonSx('175px')}
              >
                {isDraftSaving ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button
                variant='contained'
                onClick={onSignAndSave}
                disabled={isSigningSaving}
                startIcon={
                  isSigningSaving ? (
                    <CircularProgress size={isXs ? 16 : 20} color='inherit' />
                  ) : null
                }
                sx={{
                  ...getButtonSx('181px'),
                  backgroundColor: '#3a35a2',
                  color: '#ffffff'
                }}
              >
                {isSigningSaving ? 'Saving...' : 'Sign and Save'}
              </Button>
            </Stack>
          </Box>
        </Box>
        {/* progress bar placeholder */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: {
              xs: '10px',
              sm: '20px'
            },
            width: '100%',
            padding: {
              xs: '0 15px',
              sm: '0 20px',
              md: '0 10px'
            },
            zIndex: 16,
            m: 0
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              alignSelf: 'stretch',
              gap: '5px',
              minWidth: 0,
              height: {
                xs: '14px',
                sm: '18px',
                md: '22px'
              },
              background: '#614bc4',
              zIndex: 17,
              borderRadius: '4px',
              m: 0
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ResumePreviewTopbar
