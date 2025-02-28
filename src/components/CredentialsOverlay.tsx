import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, Checkbox, styled } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../redux/store'
import { fetchVCs } from '../redux/slices/vc'

interface CredentialOverlayProps {
  onClose?: () => void
  onSelect: any
}

const StyledScrollbar = styled(Box)({
  '&::-webkit-scrollbar': {
    width: '10px',
    Height: '114px'
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#E1E2F5',
    borderRadius: '30px'
  }
})

const CredentialOverlay: React.FC<CredentialOverlayProps> = ({ onClose, onSelect }) => {
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([])

  const dispatch: AppDispatch = useDispatch()
  const { vcs } = useSelector((state: any) => state.vcReducer)

  useEffect(() => {
    // Dispatch the thunk to fetch VCs
    dispatch(fetchVCs())
  }, [dispatch])

  const handleSelectAll = () => {
    if (selectedCredentials.length === vcs.length) {
      setSelectedCredentials([])
    } else {
      setSelectedCredentials(vcs.map((cred: any) => cred?.originalItem?.id || cred.id))
    }
  }

  const handleToggleCredential = (credential: any) => {
    const credentialId = credential?.originalItem?.id || credential.id
    setSelectedCredentials(prev =>
      prev.includes(credentialId)
        ? prev.filter(id => id !== credentialId)
        : [...prev, credentialId]
    )
  }

  const handleClear = () => {
    setSelectedCredentials([])
  }

  const handleContinue = () => {
    onSelect(selectedCredentials)
    onClose?.()
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(5, 2, 69, 0.70)'
      }}
    >
      <Box
        sx={{
          width: '45vw',
          maxWidth: '800px',
          maxHeight: '900px',
          height: '80vh',
          bgcolor: '#FFFFFF',
          borderRadius: '4px',
          boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ px: '20px', py: '12px', flex: 1, overflow: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography
              sx={{
                color: '#2E2E48',
                fontSize: '18px',
                fontWeight: 500,
                fontFamily: 'Nunito Sans'
              }}
            >
              Select one or more credentials to add or remove them:
            </Typography>
            <Button
              onClick={handleClear}
              sx={{
                color: '#6B79F6',
                fontSize: '18px',
                fontWeight: 700,
                fontFamily: 'Nunito Sans',
                minWidth: 'auto',
                p: 0
              }}
            >
              Clear
            </Button>
          </Box>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}
          >
            <StyledScrollbar
              sx={{
                overflowY: 'auto'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: '12px'
                }}
              >
                <Checkbox
                  checked={selectedCredentials.length === vcs.length}
                  onChange={handleSelectAll}
                  sx={{
                    '&.Mui-checked': {
                      color: '#3A35A2'
                    }
                  }}
                />
                <Typography
                  sx={{
                    color: '#2563EB',
                    fontSize: '18px',
                    fontWeight: 700,
                    fontFamily: 'Nunito Sans'
                  }}
                >
                  Select All
                </Typography>
              </Box>

              {vcs.map((credential: any, index: any) => (
                <Box
                  key={credential.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: '10px',
                    mb: index === vcs.length - 1 ? 0 : '12px'
                  }}
                >
                  <Checkbox
                    checked={selectedCredentials.includes(
                      credential?.originalItem?.id || credential.id
                    )}
                    onChange={() => handleToggleCredential(credential)}
                    sx={{
                      '&.Mui-checked': {
                        color: '#3A35A2'
                      }
                    }}
                  />
                  <Typography
                    sx={{
                      color: '#2563EB',
                      fontSize: '18px',
                      fontWeight: 700,
                      fontFamily: 'Nunito Sans'
                    }}
                  >
                    {credential?.credentialSubject?.achievement[0]?.name}
                  </Typography>
                </Box>
              ))}
            </StyledScrollbar>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '15px',
            py: '24px',
            justifyContent: 'center',
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#38207E'
          }}
        >
          <Button
            onClick={onClose}
            variant='contained'
            sx={{
              bgcolor: 'white',
              color: '#6B79F6',
              fontSize: '18px',
              width: '172px',
              height: '53px',
              fontWeight: 700,
              lineHeight: '24px',
              fontFamily: 'Nunito Sans',
              textTransform: 'none',
              borderRadius: '100px',
              border: '3px solid #fff',
              '&:hover': {
                bgcolor: '#E9E6F8'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            variant='contained'
            sx={{
              color: '#fff',
              bgcolor: '#6B79F6',
              fontSize: '18px',
              width: '172px',
              height: '53px',
              fontWeight: 700,
              lineHeight: '24px',
              fontFamily: 'Nunito Sans',
              textTransform: 'none',
              borderRadius: '100px',
              border: '3px solid #6B79F6',
              '&:hover': {
                bgcolor: '#292489'
              }
            }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default CredentialOverlay
