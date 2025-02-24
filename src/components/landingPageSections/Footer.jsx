import React from 'react'
import { Box, Typography, Divider, Button } from '@mui/material'
import { SVGGitHub, SVGlisence, SVGCopyWriter } from '../../assets/svgs'

const StyledButton = ({ href, startIcon, children }) => (
  <Button
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    startIcon={startIcon}
    sx={{
      color: '#2563EB',
      fontFamily: 'Nunito Sans',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '40px',
      letterSpacing: '-0.26px',
      textDecoration: 'underline',
      textDecorationSkipInk: 'auto',
      textUnderlineOffset: 'auto',
      textUnderlinePosition: 'from-font',
      textTransform: 'none',
      padding: 0,
      minWidth: 0,
      '&:hover': {
        background: 'transparent'
      }
    }}
  >
    {children}
  </Button>
)

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#E9E6F8',
        padding: '30px 75px'
      }}
    >
      <Box
        sx={{}}
        display='flex'
        justifyContent='flex-start'
        alignItems='space-between'
        gap={2}
      >
        <Box display='flex' alignItems='center' gap={1}>
          <SVGCopyWriter />
          <Typography
            sx={{
              color: '#47516B',
              fontFamily: 'Nunito Sans',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '40px',
              letterSpacing: '-0.26px'
            }}
          >
            Copyright, Creative Commons License BY 4.0
          </Typography>
        </Box>
        <Divider orientation='vertical' flexItem />

        <Box display='flex' justifyContent='center' alignItems='center' gap={1}>
          <SVGlisence />
          <StyledButton>Apache 2 License</StyledButton>
        </Box>
        <Divider orientation='vertical' flexItem />

        <Box display='flex' alignItems='center' gap={1}>
          <SVGGitHub />
          <Typography
            sx={{
              color: '#47516B',
              fontFamily: 'Nunito Sans',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '40px',
              letterSpacing: '-0.26px'
            }}
          >
            Source Code:
          </Typography>
          <StyledButton href='https://github.com/orgs/Cooperation-org/projects/4/views/1'>
            https://github.com/....
          </StyledButton>
        </Box>
        <Divider orientation='vertical' flexItem />

        <StyledButton href='/privacy-policy'>Privacy Policy</StyledButton>
        <Divider orientation='vertical' flexItem />

        <Box display='flex' alignItems='center'>
          <Typography
            sx={{
              color: '#47516B',
              fontFamily: 'Nunito Sans',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '40px',
              letterSpacing: '-0.26px'
            }}
          >
            Contact Us:{' '}
            <span
              style={{
                color: 'var(--Primary-Link, #2563EB)',
                fontFamily: 'Nunito Sans',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '40px',
                letterSpacing: '-0.16px',
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationSkipInk: 'auto',
                textDecorationThickness: 'auto',
                textUnderlineOffset: 'auto',
                textUnderlinePosition: 'from-font'
              }}
            >
              contact@email.com
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Footer
