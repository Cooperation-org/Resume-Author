// src/components/Layout/styles.tsx
import { Box, styled } from '@mui/material'

export const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 48,
  background: 'linear-gradient(180deg, #361E7D, #414FCD)',
  padding: theme.spacing(4, 4),
  height: '100%',
  position: 'fixed',
  left: 0,
  top: 0,
  transition: 'width 0.3s ease',
  '&.expanded': {
    width: 250
  }
}))

export const MainContent = styled(Box)(({ theme }) => ({
  marginLeft: 90,
  minHeight: '100vh',
  width: 'calc(100% - 90px)',
  transition: 'width 0.3s ease',
  '&.sidebar-expanded': {
    marginLeft: 300
  }
}))

export const FullWidthContent = styled(Box)({
  width: '100%',
  minHeight: '100vh'
})
