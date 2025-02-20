import React, { useState, useCallback } from 'react'
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

interface WorkExperience {
  title: string
  company: string
  duration: string
  currentlyEmployed: boolean
  description: string
  showDuration: boolean
}

interface SectionDetailsProps {
  sectionId: string
  onDelete?: () => void
  onAddFiles?: () => void
  onAddCredential?: (text: string) => void
}

export default function SectionDetails({
  sectionId,
  onDelete,
  onAddFiles,
  onAddCredential
}: SectionDetailsProps) {
  const [workExperience, setWorkExperience] = useState<WorkExperience>({
    title: '',
    company: '',
    duration: '',
    currentlyEmployed: false,
    description: '',
    showDuration: true
  })

  const handleWorkExperienceChange = useCallback(
    (field: keyof WorkExperience, value: any) => {
      setWorkExperience(prev => ({
        ...prev,
        [field]: value
      }))
    },
    []
  )

  const handleCredentialAdd = useCallback(
    (text: string) => {
      if (onAddCredential) {
        onAddCredential(text)
      }
    },
    [onAddCredential]
  )

  return (
    <Box>
      {sectionId === 'Professional Summary' && (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
          Write a brief summary highlighting your skills, experience, and achievements.
          Focus on what makes you stand out, including specific expertise or career goals.
          Keep it quantitative, clear, professional, and tailored to your target role.
        </Typography>
      )}
      {sectionId === 'Work Experience' && (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
          Add your work experience in reverse chronological order. In the text editor, you
          may add credentials from your credential library to strengthen the value of your
          work experience. Don't have any credentials? Visit www.linkedclaims.com to
          create your own credentials.
        </Typography>
      )}
      <Stack
        sx={{ bgcolor: '#F1F1FB', p: '20px', borderRadius: '4px', mt: 2 }}
        spacing={2}
      >
        {sectionId === 'Professional Summary' && (
          <TextEditor
            value={workExperience.description}
            onChange={val => handleWorkExperienceChange('description', val)}
            onAddCredential={handleCredentialAdd}
          />
        )}

        {sectionId === 'Work Experience' && (
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
              value={workExperience.title}
              onChange={e => handleWorkExperienceChange('title', e.target.value)}
              variant='outlined'
            />

            <Typography>Company</Typography>
            <TextField
              sx={{ bgcolor: '#FFF' }}
              size='small'
              fullWidth
              placeholder='Employer name'
              value={workExperience.company}
              onChange={e => handleWorkExperienceChange('company', e.target.value)}
            />

            <Box display='flex' alignItems='start' flexDirection='column'>
              <Typography variant='body1'>Dates</Typography>
              <Box display='flex' alignItems='center'>
                <PinkSwitch
                  checked={workExperience.showDuration}
                  onChange={e =>
                    handleWorkExperienceChange('showDuration', e.target.checked)
                  }
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
                value={workExperience.duration}
                onChange={e => handleWorkExperienceChange('duration', e.target.value)}
                variant='outlined'
              />
              <Box display='flex' alignItems='center' gap={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={workExperience.currentlyEmployed}
                      onChange={e =>
                        handleWorkExperienceChange('currentlyEmployed', e.target.checked)
                      }
                    />
                  }
                  label='Currently employed here'
                />
              </Box>
            </Box>

            <Typography variant='body1'>Describe your role at this company:</Typography>
            <TextEditor
              value={workExperience.description}
              onChange={val => handleWorkExperienceChange('description', val)}
              onAddCredential={handleCredentialAdd}
            />
          </Box>
        )}

        {sectionId !== 'Professional Summary' && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px'
            }}
          >
            <StyledButton
              startIcon={<SVGAddcredential />}
              onClick={() => handleCredentialAdd('')}
            >
              Add credential(s)
            </StyledButton>
            <StyledButton startIcon={<SVGAddFiles />} onClick={onAddFiles}>
              Add file(s)
            </StyledButton>
            <StyledButton startIcon={<SVGDeleteSection />} onClick={onDelete}>
              Delete this item
            </StyledButton>
          </Box>
        )}
      </Stack>
    </Box>
  )
}
