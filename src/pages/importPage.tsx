import { Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useAuth0 } from '@auth0/auth0-react'
import { SVGStartFromScratchicon, SVGFromLinkedin } from '../assets/svgs'

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

const StyledButton = styled(Button)({
  color: '#2563EB',
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: 400,
  textDecorationLine: 'underline',
  marginTop: '30px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#1d4ed8'
  }
})

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
          <Section onClick={handlesign} sx={{ width: { xs: '250px', md: '400px' } }}>
            <Typography variant='h6' sx={{ color: '#07142B', fontWeight: 'bold' }}>
              Start from scratch
            </Typography>
            <SVGStartFromScratchicon />
            <Typography variant='body2' sx={{ color: '#1F2937', textAlign: 'center' }}>
              Build a resume from a blank template
            </Typography>
          </Section>
          <Section sx={{ width: { xs: '250px', md: '400px' } }}>
            <Typography variant='h6' sx={{ color: '#07142B', fontWeight: 'bold' }}>
              Upload Resume
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
                  Supported file types
                </Typography>
              </Box>
              <Typography
                variant='caption'
                sx={{ color: '#9CA3AF', textAlign: 'center', marginX: 12 }}
              >
                (doc, docx, pdf, rtf, json, txt)
              </Typography>
            </Box>
          </Section>

          <Section onClick={handlesign} sx={{ width: { xs: '250px', md: '400px' } }}>
            <Typography variant='h6' sx={{ color: '#07142B', fontWeight: 'bold' }}>
              Import LinkedIn profile
            </Typography>
            <Box
              sx={{
                height: 'fit-content',
                width: 'fit-content',
                border: '2px solid #2563EB',
                p: '4px',
                borderRadius: '4px'
              }}
            >
              <SVGFromLinkedin />
            </Box>

            <Typography variant='body2' sx={{ color: '#1F2937', textAlign: 'center' }}>
              Must have a LinkedIn account
            </Typography>
          </Section>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <StyledButton>Go to My Resumes </StyledButton>
        </Box>
      </InnerContainer>
      <Box
        sx={{
          width: '100%',
          bgcolor: '#FFF',
          height: '80px',
          boxShadow: ' 4px -4px 10px 2px rgba(20, 86, 255, 0.25)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <Button
          variant='contained'
          sx={{
            backgroundColor: '#B5B5B5',
            color: '#FFFFFF',
            textTransform: 'none',
            px: 4,
            py: 1.5,
            mr: 6,
            borderRadius: '100px',
            border: '3px solid  #B5B5B5',
            '&:hover': {
              backgroundColor: '#1E40AF',
              border: '3px solid  #1E40AF'
            }
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  )
}
