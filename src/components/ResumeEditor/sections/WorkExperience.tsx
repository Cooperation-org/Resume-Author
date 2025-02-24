import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Typography,
  Switch,
  styled,
  alpha,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import {
  SVGSectionIcon,
  SVGDownIcon,
  SVGAddcredential,
  SVGAddFiles,
  SVGDeleteSection
} from '../../../assets/svgs'
import TextEditor from '../../TextEditor/Texteditor'
import { StyledButton } from './StyledButton'
import { useDispatch, useSelector } from 'react-redux'
import { updateSection } from '../../../redux/slices/resume'
import { RootState } from '../../../redux/store'
import stripHtmlTags from '../../../tools/stripHTML'

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

interface WorkExperienceProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

export default function WorkExperience({
  onAddFiles,
  onDelete,
  onAddCredential
}: WorkExperienceProps) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)

  const [workExperience, setWorkExperience] = useState({
    title: '',
    company: '',
    duration: '',
    currentlyEmployed: false,
    description: '',
    showDuration: true
  })

  // Load existing work experience from Redux
  useEffect(() => {
    if (resume?.experience?.items && resume.experience.items.length > 0) {
      const existingExperience = resume.experience.items[0]

      // Prevent redundant updates to avoid infinite loop
      const isChanged = Object.keys(existingExperience).some(
        key =>
          workExperience[key as keyof typeof workExperience] !==
          existingExperience[key as keyof typeof existingExperience]
      )

      if (isChanged) {
        setWorkExperience(existingExperience as any)
      }
    }
  }, [resume, workExperience])

  const handleWorkExperienceChange = (field: string, value: any) => {
    const updatedExperience = {
      ...workExperience,
      [field]: field === 'description' ? stripHtmlTags(value) : value
    }

    // Prevent unnecessary Redux updates if the content hasn't changed
    const isChanged =
      workExperience[field as keyof typeof workExperience] !==
      updatedExperience[field as keyof typeof updatedExperience]

    if (isChanged) {
      setWorkExperience(updatedExperience)

      dispatch(
        updateSection({
          sectionId: 'experience',
          content: {
            items: [updatedExperience]
          }
        })
      )
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            onChange={e => handleWorkExperienceChange('showDuration', e.target.checked)}
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
        onAddCredential={onAddCredential}
      />

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
          onClick={() => onAddCredential && onAddCredential('')}
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
    </Box>
  )
}
