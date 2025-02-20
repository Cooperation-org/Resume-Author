import React, { useState } from 'react'
import { Box, Typography, Button, Checkbox, styled } from '@mui/material'

interface CredentialOverlayProps {
  onClose?: () => void
  onSelect: (selectedCredentials: string[]) => void
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

  const credentials = [
    { id: '1', name: 'Case Study' },
    { id: '2', name: 'Google UX Certification' },
    { id: '3', name: 'Coursera UX Design Essentials for Enterprise Designers' },
    { id: '4', name: 'Lorem ipsum dolor sit amet nuit' },
    { id: '5', name: 'Lorem ipsum dolor sit amet nuit' },
    { id: '6', name: 'Lorem ipsum dolor sit amet nuit' },
    { id: '7', name: 'Lorem ipsum dolor sit amet nuit' },
    { id: '8', name: 'Lorem ipsum dolor sit amet nuit' },
    { id: '9', name: 'Lorem ipsum dolor sit amet nuit' },
    { id: '10', name: 'Lorem ipsum dolor sit amet nuit' }
  ]

  const handleSelectAll = () => {
    if (selectedCredentials.length === credentials.length) {
      setSelectedCredentials([])
    } else {
      setSelectedCredentials(credentials.map(cred => cred.id))
    }
  }

  const handleToggleCredential = (credentialId: string) => {
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
                  checked={selectedCredentials.length === credentials.length}
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

              {credentials.map((credential, index) => (
                <Box
                  key={credential.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: '10px',
                    mb: index === credentials.length - 1 ? 0 : '12px'
                  }}
                >
                  <Checkbox
                    checked={selectedCredentials.includes(credential.id)}
                    onChange={() => handleToggleCredential(credential.id)}
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
                    {credential.name}
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
