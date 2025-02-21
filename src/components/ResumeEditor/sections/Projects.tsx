import React, { useState, useCallback } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import TextEditor from '../../TextEditor/Texteditor'
import { StyledButton } from './StyledButton'
import { SVGAddcredential, SVGAddFiles, SVGDeleteSection } from '../../../assets/svgs'

interface ProjectsProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

const Projects: React.FC<ProjectsProps> = ({ onAddFiles, onDelete, onAddCredential }) => {
  const [project, setProject] = useState({
    name: '',
    description: ''
  })

  const handleChange = useCallback((field: string, value: any) => {
    setProject(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant='h6'>Projects</Typography>

      <TextField
        size='small'
        fullWidth
        label='Project Name'
        value={project.name}
        onChange={e => handleChange('name', e.target.value)}
        sx={{ bgcolor: '#FFF' }}
      />

      <Typography variant='body1'>Project Description:</Typography>
      <TextEditor
        value={project.description}
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

export default Projects
