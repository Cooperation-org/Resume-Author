import React, { useState, useCallback } from 'react'
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Switch,
  styled,
  alpha
} from '@mui/material'
import { SVGAddcredential, SVGAddFiles, SVGDeleteSection } from '../../../assets/svgs'
import { StyledButton } from './StyledButton'

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
interface ProfessionalAffiliationsProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

const ProfessionalAffiliations: React.FC<ProfessionalAffiliationsProps> = ({
  onAddFiles,
  onDelete,
  onAddCredential
}) => {
  const [affiliation, setAffiliation] = useState({
    name: '',
    organization: '',
    startDate: '',
    endDate: '',
    showDuration: false,
    activeAffiliation: false
  })

  const handleChange = useCallback((field: string, value: any) => {
    setAffiliation(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant='h6'>Professional Affiliations</Typography>

      <TextField
        sx={{ bgcolor: '#FFF' }}
        size='small'
        fullWidth
        placeholder='Member'
        label='Name'
        value={affiliation.name}
        onChange={e => handleChange('name', e.target.value)}
      />

      <TextField
        sx={{ bgcolor: '#FFF' }}
        size='small'
        fullWidth
        placeholder='UXPA'
        label='Organization'
        value={affiliation.organization}
        onChange={e => handleChange('organization', e.target.value)}
      />

      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography>Dates</Typography>
        <FormControlLabel
          control={
            <PinkSwitch
              checked={affiliation.showDuration}
              onChange={e => handleChange('showDuration', e.target.checked)}
              sx={{ color: '#34C759' }}
            />
          }
          label='Show duration instead of exact dates'
        />
      </Box>

      {!affiliation.showDuration ? (
        <Box display='flex' gap={2}>
          <TextField
            sx={{ bgcolor: '#FFF' }}
            size='small'
            type='date'
            value={affiliation.startDate}
            onChange={e => handleChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={{ bgcolor: '#FFF' }}
            size='small'
            type='date'
            value={affiliation.endDate}
            onChange={e => handleChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      ) : (
        <TextField
          sx={{ bgcolor: '#FFF' }}
          size='small'
          placeholder='Enter total duration'
          value={`${affiliation.startDate} - ${affiliation.endDate}`}
          disabled
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={affiliation.activeAffiliation}
            onChange={e => handleChange('activeAffiliation', e.target.checked)}
          />
        }
        label='Active affiliation'
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

export default ProfessionalAffiliations
