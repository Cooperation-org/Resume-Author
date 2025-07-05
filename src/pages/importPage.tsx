import { Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { SVGStartFromScratchicon, SVGUpload } from '../assets/svgs'

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
  const handleFromScratch = () => {
    window.location.href = '/resume/new'
  }
  const handleUpload = () => {
    window.location.href = '/resume/upload'
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
            mb: 8,
            fontFamily: 'Poppins',
            fontSize: '38px',
            fontWeight: 600
          }}
        >
          How do you want to create your resume?
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
          <Section
            onClick={handleFromScratch}
            sx={{ width: { xs: '250px', md: '400px' } }}
          >
            <Typography variant='h6' sx={{ color: '#07142B', fontWeight: 'bold' }}>
              Start from scratch
            </Typography>
            <SVGStartFromScratchicon />
            <Typography variant='body2' sx={{ color: '#1F2937', textAlign: 'center' }}>
              Build a resume from a blank template
            </Typography>
          </Section>
          <Section onClick={handleUpload} sx={{ width: { xs: '250px', md: '400px' } }}>
            <Typography
              variant='h6'
              sx={{
                color: '#07142B',
                fontWeight: 'bold'
              }}
            >
              Upload Resume
            </Typography>
            <SVGUpload />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant='body2' sx={{ color: '#1F2937' }}>
                  Import from verifiable credential URL
                </Typography>
              </Box>
            </Box>
          </Section>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <StyledButton onClick={() => (window.location.href = '/myresumes')}>
            Go to My Resumes{' '}
          </StyledButton>{' '}
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
            color: '#2E2E48',
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
