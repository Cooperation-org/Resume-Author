import React, { useState, useCallback } from 'react'
import {
  Box,
  TextField,
  Typography,
  styled,
  alpha,
  Switch,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '@mui/material'
import { SVGAddcredential, SVGAddFiles, SVGDeleteSection } from '../../../assets/svgs'
import { StyledButton } from './StyledButton'
import TextEditor from '../../TextEditor/Texteditor'

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

const Education: React.FC<EducationProps> = ({
  onAddFiles,
  onDelete,
  onAddCredential
}) => {
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

  const handleChange = useCallback((field: string, value: any) => {
    setEducation(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, bgcolor: '#F8F8FC' }}
    >
      <Box>
        <Typography variant='body2' mb={1}>
          Type
        </Typography>
        <TextField
          fullWidth
          size='small'
          sx={{ bgcolor: '#FFF' }}
          value={education.type}
          onChange={e => handleChange('type', e.target.value)}
        />
      </Box>

      <Box display='flex' gap={2}>
        <Box flex={1}>
          <Typography variant='body2' mb={1}>
            Program or Course Name
          </Typography>
          <TextField
            fullWidth
            size='small'
            sx={{ bgcolor: '#FFF' }}
            value={education.programName}
            onChange={e => handleChange('programName', e.target.value)}
          />
        </Box>
        <Box flex={1}>
          <Typography variant='body2' mb={1}>
            Institution or Organization Name
          </Typography>
          <TextField
            fullWidth
            size='small'
            sx={{ bgcolor: '#FFF' }}
            value={education.institutionName}
            onChange={e => handleChange('institutionName', e.target.value)}
          />
        </Box>
      </Box>

      <Typography variant='body2'>Dates</Typography>
      <FormControlLabel
        control={
          <PinkSwitch
            checked={education.showDuration}
            onChange={e => handleChange('showDuration', e.target.checked)}
            sx={{ color: '#34C759' }}
          />
        }
        label='Show duration instead of exact dates'
      />

      <Box>
        <TextField
          size='small'
          sx={{ bgcolor: '#FFF', width: '150px' }}
          value={education.duration}
          onChange={e => handleChange('duration', e.target.value)}
        />
      </Box>

      <FormGroup row sx={{ gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={education.currentlyEnrolled}
              onChange={e => handleChange('currentlyEnrolled', e.target.checked)}
            />
          }
          label='Currently enrolled here'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={education.inProgress}
              onChange={e => handleChange('inProgress', e.target.checked)}
            />
          }
          label='In progress'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={education.awardEarned}
              onChange={e => handleChange('awardEarned', e.target.checked)}
            />
          }
          label='Award earned'
        />
      </FormGroup>

      <Typography variant='body2'>
        Describe how this item relates to the job you want to get:
      </Typography>
      <TextEditor
        value={education.description}
        onChange={val => handleChange('description', val)}
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

export default Education
