import React, { useState, useCallback } from 'react'
import { Box, TextField, Typography, Switch, FormControlLabel } from '@mui/material'
import TextEditor from '../../TextEditor/Texteditor'
import { StyledButton } from './StyledButton'
import { SVGAddcredential, SVGAddFiles, SVGDeleteSection } from '../../../assets/svgs'

interface VolunteerWorkProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

const VolunteerWork: React.FC<VolunteerWorkProps> = ({
  onAddFiles,
  onDelete,
  onAddCredential
}) => {
  const [volunteer, setVolunteer] = useState({
    organization: '',
    role: '',
    duration: '',
    showDuration: false,
    description: ''
  })

  const handleChange = useCallback((field: string, value: any) => {
    setVolunteer(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant='h6'>Volunteer Work</Typography>

      <TextField
        size='small'
        fullWidth
        label='Organization'
        value={volunteer.organization}
        onChange={e => handleChange('organization', e.target.value)}
        sx={{ bgcolor: '#FFF' }}
      />

      <TextField
        size='small'
        fullWidth
        label='Role'
        value={volunteer.role}
        onChange={e => handleChange('role', e.target.value)}
        sx={{ bgcolor: '#FFF' }}
      />

      <Box>
        <Typography>Dates</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={volunteer.showDuration}
              onChange={e => handleChange('showDuration', e.target.checked)}
            />
          }
          label='Show duration instead of exact dates'
        />
      </Box>

      <TextField
        size='small'
        fullWidth
        label='Duration'
        value={volunteer.duration}
        onChange={e => handleChange('duration', e.target.value)}
        sx={{ bgcolor: '#FFF' }}
      />

      <Typography>Description:</Typography>
      <TextEditor
        value={volunteer.description}
        onChange={val => handleChange('description', val)}
        onAddCredential={onAddCredential}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2
        }}
      >
        <StyledButton
          startIcon={<SVGAddcredential />}
          onClick={() => onAddCredential?.('')}
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

export default VolunteerWork
