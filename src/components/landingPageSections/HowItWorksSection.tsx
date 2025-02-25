import { Box, Typography } from '@mui/material'
import { SVGYellowAdd, SVGResume, SVGFile, SVGVerefied, SVGVe } from '../../assets/svgs'

const HowItWorksSection = () => {
  const sectionData = [
    {
      title: 'Import data from your existing resume or start with a blank template.',
      icon: <SVGFile />,
      color: '#5BC930',
      fontFamily: 'Nunito Sans',
      fontWeight: 500
    },
    {
      title: 'Preview your resume and make any changes before finalizing.',
      icon: <SVGResume />,
      color: '#44C4C4',
      fontFamily: 'Nunito Sans',
      fontWeight: 500
    },
    {
      title:
        'Add credentials, recommendations, or evidence of your skills to strengthen your resume.',
      icon: <SVGYellowAdd />,
      color: '#EAB037',
      fontFamily: 'Nunito Sans',
      fontWeight: 500
    },
    {
      title:
        'Sign and save a verifiable presentation of your resume to prove it was created by a human.',
      icon: <SVGVerefied />,
      color: '#404CC8',
      fontFamily: 'Nunito Sans',
      fontWeight: 500
    }
  ]
  return (
    <Box
      sx={{
        display: 'flex',
        p: '76px 93px 20px 93px',
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        position: 'relative'
      }}
    >
      <Typography
        sx={{
          width: '30%',
          color: '#282488',
          fontSize: '45px',
          fontWeight: 600,
          fontFamily: 'Poppins',
          lineHeight: '52px'
        }}
      >
        A better way to build a resume
      </Typography>
      <Box
        sx={{
          display: 'flex',
          width: '65%',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}
      >
        {sectionData.map(section => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '32px',
              width: '45%',
              mb: '50px'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '20px',
                border: `2px solid ${section.color}`,
                p: '20px'
              }}
            >
              {section.icon}
            </Box>
            <Typography
              sx={{ fontFamily: section.fontFamily, fontWeight: section.fontWeight }}
            >
              {section.title}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ position: 'absolute', top: '50%', left: '0', zIndex: 111 }}>
        <SVGVe />
      </Box>
    </Box>
  )
}
export default HowItWorksSection
