// src/components/Layout/styles.tsx
import { Box, styled } from '@mui/material'

export const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 48,
  background: 'linear-gradient(180deg, #361E7D, #414FCD)',
  padding: theme.spacing(4, 4),
  height: '100%',
  position: 'fixed',
  left: 0,
  top: 0
}))

export const MainContent = styled(Box)(({ theme }) => ({
  marginLeft: 90,
  minHeight: '100vh',
  width: 'calc(100% - 90px)'
}))

export const FullWidthContent = styled(Box)({
  width: '100%',
  minHeight: '100vh'
})
