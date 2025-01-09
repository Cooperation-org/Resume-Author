import React, { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  FormLabel
} from '@mui/material'

import {
  SVGSectionIcon,
  SVGMail,
  SVGPhone,
  SVGLocation,
  SVGLinkedIn,
  SVGURL,
  SVGSearch,
  SVGAdd,
  SVGInstagram
} from '../../assets/svgs'

export const leftSections: (keyof Resume)[] = ['contact', 'languages']

const LeftSidebar = () => {
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [input3, setInput3] = useState('')
  const [input4, setInput4] = useState('')
  const [input5, setInput5] = useState('')
  const [input6, setInput6] = useState('')
  const [input7, setInput7] = useState('')
  const [input8, setInput8] = useState('')
  const [input9, setInput9] = useState('')
  const [input10, setInput10] = useState('')

  const paperStyle = {
    display: 'flex',
    padding: '20px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '20px',
    alignSelf: 'stretch',
    borderRadius: '8px',
    bgcolor: '#FFF',
    boxShadow: '0px 2px 20px 0px rgba(0,0,0,0.10)'
  }

  const labelStyles = {
    color: '#000',
    fontFamily: '"Proxima Nova", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    letterSpacing: '0.16px'
  }
  const boxStyle = {
    width: '24px',
    height: '24px',
    borderRadius: '100px',
    bgcolor: '#E2E6EE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }

  const placeholderStyle = {
    '& .MuiInputBase-input::placeholder': {
      color: 'var(--neutral-light-n-100, #7A869A)',
      fontFamily: '"Proxima Nova", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '20px',
      opacity: 1
    }
  }

  return (
    <Box
      display='flex'
      flexDirection='column'
      bgcolor='#FFFFFF'
      sx={{ width: 300, gap: '30px' }}
    >
      <Paper sx={paperStyle}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <SVGSectionIcon />
          <Typography sx={{ ...labelStyles, fontSize: '18px' }} variant='h6'>
            Contact Details
          </Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormLabel sx={labelStyles}>Full Name (required)</FormLabel>
          <TextField
            placeholder='Enter your full name'
            fullWidth
            value={input1}
            onChange={e => setInput1(e.target.value)}
            size='small'
            sx={placeholderStyle}
          />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormLabel sx={labelStyles}>Email (required)</FormLabel>
          <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Box sx={boxStyle}>
              <SVGMail />
            </Box>
            <TextField
              placeholder='Enter a valid email address'
              fullWidth
              value={input2}
              onChange={e => setInput2(e.target.value)}
              size='small'
              sx={placeholderStyle}
            />
          </Box>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormLabel sx={labelStyles}>Phone number</FormLabel>
          <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Box sx={boxStyle}>
              <SVGPhone />
            </Box>
            <TextField
              placeholder='###-###-####'
              fullWidth
              value={input3}
              onChange={e => setInput3(e.target.value)}
              size='small'
              sx={placeholderStyle}
            />
          </Box>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormLabel sx={labelStyles}>Location</FormLabel>
          <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Box sx={boxStyle}>
              <SVGLocation />
            </Box>
            <TextField
              placeholder='City, state or province'
              fullWidth
              value={input4}
              onChange={e => setInput4(e.target.value)}
              size='small'
              sx={placeholderStyle}
            />
          </Box>
        </Box>
      </Paper>

      <Paper sx={paperStyle}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <SVGSectionIcon />
          <Typography sx={{ ...labelStyles, fontSize: '18px' }} variant='h6'>
            Links
          </Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormLabel sx={labelStyles}>Personal Website (if any)</FormLabel>
          <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Box sx={boxStyle}>
              <SVGURL />
            </Box>
            <TextField
              placeholder='https://'
              fullWidth
              value={input5}
              onChange={e => setInput5(e.target.value)}
              size='small'
              sx={placeholderStyle}
            />
          </Box>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormLabel sx={labelStyles}>LinkedIn</FormLabel>
          <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Box
              sx={{
                width: '24px',
                height: '24px',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: '#0077B5'
              }}
            >
              <SVGLinkedIn />
            </Box>
            <TextField
              placeholder='Enter your LinkedIn URL'
              fullWidth
              value={input6}
              onChange={e => setInput6(e.target.value)}
              size='small'
              sx={placeholderStyle}
            />
          </Box>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormLabel sx={labelStyles}>Instagram</FormLabel>
          <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Box sx={boxStyle}>
              <SVGInstagram />
            </Box>
            <TextField
              placeholder='Enter your Instagram URL'
              fullWidth
              value={input7}
              onChange={e => setInput7(e.target.value)}
              size='small'
              sx={placeholderStyle}
            />
          </Box>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormLabel sx={labelStyles}>Add your own</FormLabel>
          <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Box sx={boxStyle}>
              <SVGURL />
            </Box>
            <TextField
              placeholder='Enter a URL'
              fullWidth
              value={input8}
              onChange={e => setInput8(e.target.value)}
              size='small'
              sx={placeholderStyle}
            />
          </Box>
        </Box>
      </Paper>

      <Paper sx={paperStyle}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <SVGSectionIcon />
          <Typography sx={{ ...labelStyles, fontSize: '18px' }} variant='h6'>
            Languages
          </Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            placeholder='Which languages do you speak?'
            fullWidth
            value={input9}
            onChange={e => setInput9(e.target.value)}
            size='small'
            InputProps={{
              endAdornment: (
                <InputAdornment
                  sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                  position='end'
                >
                  <SVGSearch />
                </InputAdornment>
              )
            }}
            sx={{
              bgcolor: '#F3F5F8',
              borderRadius: '3px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' }
              },
              ...placeholderStyle
            }}
          />
        </Box>
      </Paper>

      <Paper sx={paperStyle}>
        <Typography sx={{ ...labelStyles, fontSize: '18px' }} variant='h6'>
          Add Custom Section
        </Typography>
        <Box sx={{ width: '100%' }}>
          <TextField
            placeholder='Name this section'
            fullWidth
            value={input10}
            onChange={e => setInput10(e.target.value)}
            size='small'
            InputProps={{
              endAdornment: (
                <InputAdornment sx={{ mt: 1 }} position='end'>
                  <SVGAdd />
                </InputAdornment>
              )
            }}
            sx={{
              bgcolor: '#F3F5F8',
              borderRadius: '3px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' }
              },
              ...placeholderStyle
            }}
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default LeftSidebar
