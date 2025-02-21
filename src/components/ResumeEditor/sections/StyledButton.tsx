import { Button, styled, Theme } from '@mui/material'

export const StyledButton = styled(Button)(({ theme }: { theme: Theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#2D2D47',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#F5F5F5'
  },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '4px',
  '& .MuiButton-startIcon': {
    padding: '5px 0 0 0'
  },
  padding: '0 10px'
}))

export default StyledButton
