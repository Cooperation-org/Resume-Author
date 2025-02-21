import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import TextEditor from '../../TextEditor/Texteditor'
import { SVGAddcredential, SVGAddFiles, SVGDeleteSection } from '../../../assets/svgs'
import { StyledButton } from './StyledButton'

interface SkillsAndAbilitiesProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

const SkillsAndAbilities: React.FC<SkillsAndAbilitiesProps> = ({
  onAddFiles,
  onDelete,
  onAddCredential
}) => {
  const [skillsText, setSkillsText] = useState('')

  const handleSkillsChange = (text: string) => {
    setSkillsText(text)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant='h6'>Skills and Abilities</Typography>
      <Typography variant='body1'>
        Add skills and link them to credentials to strengthen their value on your resume.
      </Typography>

      <TextEditor
        value={skillsText}
        onChange={handleSkillsChange}
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

export default SkillsAndAbilities
