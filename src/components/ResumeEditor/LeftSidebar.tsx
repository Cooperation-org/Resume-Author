import {
  Box,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  FormLabel
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
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
import { updateSection } from '../../redux/slices/resume'

export const leftSections: (keyof Resume)[] = ['contact', 'languages']

const LeftSidebar = () => {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)

  const handleContactChange = (field: string, value: string) => {
    if (!resume) return

    let updatedContact = { ...resume.contact }

    if (field === 'location') {
      const locations = value
        .split(',')
        .map(loc => loc.trim())
        .filter(Boolean)
      updatedContact = {
        ...updatedContact,
        location: {
          ...updatedContact.location,
          city: locations.join(', ') // Store all locations in city field
        } as any
      }
    } else {
      updatedContact = {
        ...updatedContact,
        [field]: value
      }
    }

    dispatch(updateSection({ sectionId: 'contact', content: updatedContact }))
  }

  const handleLinksChange = (field: string, value: string) => {
    if (!resume) return

    const updatedLinks = {
      ...resume.contact.socialLinks,
      [field]: value
    }

    const updatedContact = {
      ...resume.contact,
      socialLinks: updatedLinks
    }

    dispatch(updateSection({ sectionId: 'contact', content: updatedContact }))
  }

  const handleLanguageChange = (value: string) => {
    if (!resume) return

    const languages = value
      .split(',')
      .map(lang => lang.trim())
      .filter(Boolean)
      .filter((lang, index, self) => self.indexOf(lang) === index)

    dispatch(
      updateSection({
        sectionId: 'languages',
        content: {
          items: languages
        }
      })
    )
  }

  const handleCustomSectionAdd = (sectionName: string) => {
    if (!resume || !sectionName.trim()) return

    dispatch(
      updateSection({
        sectionId: sectionName.toLowerCase().replace(/\s+/g, '_'),
        content: { items: [] }
      })
    )
  }

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
      sx={{ width: '25%', gap: '30px' }}
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
            value={resume?.contact.fullName || ''}
            onChange={e => handleContactChange('fullName', e.target.value)}
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
              value={resume?.contact.email || ''}
              onChange={e => handleContactChange('email', e.target.value)}
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
              value={resume?.contact.phone || ''}
              onChange={e => handleContactChange('phone', e.target.value)}
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
              value={resume?.contact?.location?.city || ''}
              onChange={e => handleContactChange('location', e.target.value)}
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
              value={resume?.contact?.socialLinks?.portfolio || ''}
              onChange={e => handleLinksChange('portfolio', e.target.value)}
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
              value={resume?.contact?.socialLinks?.linkedin || ''}
              onChange={e => handleLinksChange('linkedin', e.target.value)}
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
              value={resume?.contact?.socialLinks?.twitter || ''} // Using twitter field for Instagram
              onChange={e => handleLinksChange('twitter', e.target.value)}
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
              value={resume?.contact?.socialLinks?.github || ''} // Using github field for custom URL
              onChange={e => handleLinksChange('github', e.target.value)}
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
            value={resume?.languages.items.join(', ') || ''}
            onChange={e => handleLanguageChange(e.target.value)}
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
            size='small'
            InputProps={{
              endAdornment: (
                <InputAdornment sx={{ mt: 1 }} position='end'>
                  <SVGAdd />
                </InputAdornment>
              )
            }}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleCustomSectionAdd((e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).value = ''
              }
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
