import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Typography,
  Switch,
  styled,
  alpha,
  Checkbox,
  FormControlLabel,
  FormGroup
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

interface EducationProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

export default function Education({
  onAddFiles,
  onDelete,
  onAddCredential
}: EducationProps) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)

  const [education, setEducation] = useState({
    type: 'Masters',
    programName: '',
    institutionName: '',
    duration: '1 year',
    showDuration: false,
    currentlyEnrolled: false,
    inProgress: false,
    awardEarned: false,
    description: ''
  })

  // Load existing education from Redux
  useEffect(() => {
    if (resume?.education?.items && resume.education.items.length > 0) {
      const existingEducation = resume.education.items[0]

      // Prevent redundant updates to avoid infinite loop
      const isChanged = Object.keys(existingEducation).some(
        key =>
          education[key as keyof typeof education] !==
          existingEducation[key as keyof typeof existingEducation]
      )

      if (isChanged) {
        setEducation(existingEducation as any)
      }
    }
  }, [education, resume])

  const handleEducationChange = (field: string, value: any) => {
    const updatedEducation = {
      ...education,
      [field]: field === 'description' ? stripHtmlTags(value) : value
    }

    // Prevent unnecessary Redux updates if the content hasn't changed
    const isChanged =
      education[field as keyof typeof education] !==
      updatedEducation[field as keyof typeof updatedEducation]

    if (isChanged) {
      setEducation(updatedEducation)

      dispatch(
        updateSection({
          sectionId: 'education',
          content: {
            items: [updatedEducation]
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
          <Typography variant='body1'>Type</Typography>
        </Box>
        <SVGDownIcon />
      </Box>

      <TextField
        sx={{ bgcolor: '#FFF' }}
        size='small'
        fullWidth
        value={education.type}
        onChange={e => handleEducationChange('type', e.target.value)}
        variant='outlined'
      />

      <Typography>Program or Course Name</Typography>
      <TextField
        sx={{ bgcolor: '#FFF' }}
        size='small'
        fullWidth
        placeholder='Enter program name'
        value={education.programName}
        onChange={e => handleEducationChange('programName', e.target.value)}
      />

      <Typography>Institution or Organization Name</Typography>
      <TextField
        sx={{ bgcolor: '#FFF' }}
        size='small'
        fullWidth
        placeholder='Enter institution name'
        value={education.institutionName}
        onChange={e => handleEducationChange('institutionName', e.target.value)}
      />

      <Box display='flex' alignItems='start' flexDirection='column'>
        <Typography variant='body1'>Dates</Typography>
        <Box display='flex' alignItems='center'>
          <PinkSwitch
            checked={education.showDuration}
            onChange={e => handleEducationChange('showDuration', e.target.checked)}
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
          value={education.duration}
          onChange={e => handleEducationChange('duration', e.target.value)}
          variant='outlined'
        />
      </Box>

      <FormGroup row sx={{ gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={education.currentlyEnrolled}
              onChange={e => handleEducationChange('currentlyEnrolled', e.target.checked)}
            />
          }
          label='Currently enrolled here'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={education.inProgress}
              onChange={e => handleEducationChange('inProgress', e.target.checked)}
            />
          }
          label='In progress'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={education.awardEarned}
              onChange={e => handleEducationChange('awardEarned', e.target.checked)}
            />
          }
          label='Award earned'
        />
      </FormGroup>

      <Typography variant='body1'>
        Describe how this item relates to the job you want to get:
      </Typography>
      <TextEditor
        value={education.description}
        onChange={val => handleEducationChange('description', val)}
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
