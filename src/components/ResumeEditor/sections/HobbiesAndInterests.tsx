import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import TextEditor from '../../TextEditor/Texteditor'
import { StyledButton } from './StyledButton'
import { SVGAddcredential, SVGAddFiles, SVGDeleteSection } from '../../../assets/svgs'

interface HobbiesAndInterestsProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

const HobbiesAndInterests: React.FC<HobbiesAndInterestsProps> = ({
  onAddFiles,
  onDelete,
  onAddCredential
}) => {
  const [content, setContent] = useState('')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant='h6'>Hobbies and Interests</Typography>
      <Typography variant='body1'>
        Share your interests and activities that demonstrate valuable skills or reflect
        your personality.
      </Typography>

      <TextEditor
        value={content}
        onChange={setContent}
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

export default HobbiesAndInterests
