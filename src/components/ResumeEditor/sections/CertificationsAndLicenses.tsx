import React, { useState, useCallback } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import TextEditor from '../../TextEditor/Texteditor'
import { StyledButton } from './StyledButton'
import { SVGAddcredential, SVGAddFiles, SVGDeleteSection } from '../../../assets/svgs'

interface CertificationsAndLicensesProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

const CertificationsAndLicenses: React.FC<CertificationsAndLicensesProps> = ({
  onAddFiles,
  onDelete,
  onAddCredential
}) => {
  const [certification, setCertification] = useState({
    name: '',
    issuer: '',
    expiryDate: '',
    description: ''
  })

  const handleChange = useCallback((field: string, value: any) => {
    setCertification(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant='h6'>Certifications and Licenses</Typography>

      <TextField
        size='small'
        fullWidth
        label='Certification/License Name'
        value={certification.name}
        onChange={e => handleChange('name', e.target.value)}
        sx={{ bgcolor: '#FFF' }}
      />

      <TextField
        size='small'
        fullWidth
        label='Issuing Organization'
        value={certification.issuer}
        onChange={e => handleChange('issuer', e.target.value)}
        sx={{ bgcolor: '#FFF' }}
      />

      <TextField
        size='small'
        type='date'
        label='Expiry Date'
        value={certification.expiryDate}
        onChange={e => handleChange('expiryDate', e.target.value)}
        sx={{ bgcolor: '#FFF', width: '200px' }}
        InputLabelProps={{ shrink: true }}
      />

      <Typography>Description:</Typography>
      <TextEditor
        value={certification.description}
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

export default CertificationsAndLicenses
