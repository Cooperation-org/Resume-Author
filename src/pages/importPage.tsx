import { Box, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useAuth0 } from '@auth0/auth0-react'

const InnerContainer = styled(Box)(() => ({
  backgroundColor: '#FFFFFF',
  justifyContent: 'space-between',
  paddingTop: '100px',
  width: '100%'
}))

const Section = styled(Box)(() => ({
  width: 280,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  borderRadius: 10,
  border: '1px solid #2563EB',
  paddingTop: 30,
  paddingBottom: 30,
  boxShadow: 'none',
  minHeight: 160,
  cursor: 'pointer'
}))

export default function ImportPage(props: any) {
  const { user, isAuthenticated } = useAuth0()
  console.log(':  LoginButton  user', user)

  const { loginWithRedirect, logout } = useAuth0()
  const handlesign = () => {
    if (!isAuthenticated) {
      loginWithRedirect({})
    } else {
      logout()
    }
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        height: '100vh'
      }}
    >
      <InnerContainer>
        <Typography
          variant='h4'
          sx={{
            color: '#07142B',
            textAlign: 'center',
            mb: 8
          }}
        >
          Where do you want to import from?
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: '30px',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            mb: { xs: '30px', md: 0 }
          }}
        >
          <Section sx={{ width: { xs: '280px', md: '430px' } }}>
            <Typography variant='h6' sx={{ color: '#07142B', fontWeight: 'bold' }}>
              Choose an existing resume
            </Typography>
            <Box
              component='img'
              src='https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3931be67-58fb-4780-bc18-f60c628f1a4a'
              sx={{
                height: 44,
                marginX: 'auto',
                objectFit: 'fill'
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant='body2' sx={{ color: '#1F2937' }}>
                  Drop your file here or
                </Typography>
                <Typography variant='body2' sx={{ color: '#2563EB', cursor: 'pointer' }}>
                  browse
                </Typography>
              </Box>
              <Typography
                variant='caption'
                sx={{ color: '#9CA3AF', textAlign: 'center', marginX: 12 }}
              >
                Maximum size: 50MB
              </Typography>
            </Box>
          </Section>

          <Section onClick={handlesign} sx={{ width: { xs: '280px', md: '430px' } }}>
            <Typography variant='h6' sx={{ color: '#07142B', fontWeight: 'bold' }}>
              Import LinkedIn profile
            </Typography>
            <Box
              component='img'
              src='https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3931be67-58fb-4780-bc18-f60c628f1a4a'
              sx={{
                height: 53,
                marginX: 'auto',
                objectFit: 'fill'
              }}
            />
            <Typography variant='body2' sx={{ color: '#1F2937', textAlign: 'center' }}>
              Must have a LinkedIn account
            </Typography>
          </Section>
        </Box>
      </InnerContainer>
    </Box>
  )
}
