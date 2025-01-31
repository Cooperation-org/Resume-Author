import React, { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  Switch,
  Button,
  Stack,
  styled,
  alpha,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import {
  SVGSectionIcon,
  SVGDownIcon,
  SVGAddFiles,
  SVGAddcredential,
  SVGDeleteSection
} from '../../assets/svgs'
import TextEditor from '../TextEditor/Texteditor'

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#2D2D47',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#F5F5F5'
  },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '4px',
  '& .MuiButton-startIcon': {
    padding: '5px 0 0 0'
  },
  padding: '0 10px'
}))

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#34C759',
    '&:hover': {
      backgroundColor: alpha('#34C759', theme.palette.action.hoverOpacity)
    }
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#34C759'
  }
}))

export default function SectionDetails(sectionId: any) {
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [input3, setInput3] = useState('')
  const [showDuration, setShowDuration] = useState(true)

  return (
    <Box>
      {sectionId.sectionId === 'Professional Summary' && (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
          {' '}
          Write a brief summary highlighting your skills, experience, and achievements.
          Focus on what makes you stand out, including specific expertise or career goals.
          Keep it quantitative, clear, professional, and tailored to your target role.
        </Typography>
      )}
      {sectionId.sectionId === 'Work Experience' && (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
          {' '}
          Add your work experience in reverse chronological order. In the text editor, you
          may add credentials from your credential library to strengthen the value of your
          work experience. Don’t have any credentials? Visit www.linkedclaims.com to
          create your own credentials.
        </Typography>
      )}
      <Stack
        sx={{ bgcolor: '#F1F1FB', p: ' 20px', borderRadius: '4px', mt: 2 }}
        spacing={2}
      >
        {/* Job Title Section */}
        {sectionId.sectionId === 'Professional Summary' && (
          <TextEditor value='' onChange={() => {}} />
        )}

        {sectionId.sectionId === 'Work Experience' && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <Box display='flex' alignItems='center' justifyContent='space-between'>
              <Box display='flex' alignItems='center' gap={2}>
                <SVGSectionIcon />
                <Typography variant='body1'>Job Title</Typography>
              </Box>
              <SVGDownIcon />
            </Box>

            <TextField
              sx={{ bgcolor: '#FFF' }}
              size='small'
              fullWidth
              placeholder='Title of your position'
              value={input1}
              onChange={e => setInput1(e.target.value)}
              variant='outlined'
            />

            {/* Company Section */}
            <Typography>Company</Typography>
            <TextField
              sx={{ bgcolor: '#FFF' }}
              size='small'
              fullWidth
              placeholder='Employer name'
              value={input2}
              onChange={e => setInput2(e.target.value)}
            />

            {/* Dates Section */}
            <Box display='flex' alignItems='start' flexDirection='column'>
              <Typography variant='body1'>Dates</Typography>
              <Box display='flex' alignItems='center'>
                <PinkSwitch
                  checked={showDuration}
                  onChange={e => setShowDuration(e.target.checked)}
                  sx={{ color: '#34C759' }}
                />
                <Typography>Show duration instead of exact dates</Typography>
              </Box>
            </Box>

            <Box display='flex' alignItems='center' gap={2}>
              <TextField
                sx={{ bgcolor: '#FFF' }}
                size='small'
                placeholder='Enter total duration'
                value={input3}
                onChange={e => setInput3(e.target.value)}
                variant='outlined'
              />
              <Box display='flex' alignItems='center' gap={1}>
                <FormControlLabel
                  required
                  control={<Checkbox />}
                  label='Currently employed here'
                />
              </Box>
            </Box>

            {/* Description Section */}
            <Typography variant='body1'>Describe your role at this company:</Typography>
            <TextEditor value='' onChange={() => {}} />
          </Box>
        )}
        {/* Button Group */}
        {sectionId.sectionId !== 'Professional Summary' && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <StyledButton
              startIcon={<SVGAddcredential />}
              onClick={() => alert('Pressed!')}
            >
              Add credential(s)
            </StyledButton>
            <StyledButton startIcon={<SVGAddFiles />} onClick={() => alert('Pressed!')}>
              Add file(s)
            </StyledButton>
            <StyledButton
              startIcon={<SVGDeleteSection />}
              onClick={() => alert('Pressed!')}
            >
              Delete this item
            </StyledButton>
          </Box>
        )}
      </Stack>
    </Box>
  )
}
