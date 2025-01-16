// src/components/Layout/Layout.tsx
import { Box } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
import { SidebarContainer, MainContent } from './styles'
import Sidebar from './Sidebar'

const Layout = () => {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  if (isLandingPage) {
    return <Outlet />
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <MainContent>
        <Outlet />
      </MainContent>
    </Box>
  )
}

export default Layout
