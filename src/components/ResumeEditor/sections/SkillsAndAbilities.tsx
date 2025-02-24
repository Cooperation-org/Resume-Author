import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import TextEditor from '../../TextEditor/Texteditor'
import { SVGAddcredential, SVGAddFiles, SVGDeleteSection } from '../../../assets/svgs'
import { StyledButton } from './StyledButton'
import { useDispatch, useSelector } from 'react-redux'
import { updateSection } from '../../../redux/slices/resume'
import { RootState } from '../../../redux/store'
import stripHtmlTags from '../../../tools/stripHTML'

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
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)

  const [skillsText, setSkillsText] = useState('')

  // Load existing skills from Redux
  useEffect(() => {
    if (resume?.skills?.items && resume.skills.items.length > 0) {
      const existingSkillsText = resume.skills.items.join(', ')

      // Prevent redundant updates to avoid infinite loop
      if (existingSkillsText !== skillsText) {
        setSkillsText(existingSkillsText)
      }
    }
  }, [resume, skillsText]) // Only run when resume changes

  const handleSkillsChange = (text: string) => {
    const plainText = stripHtmlTags(text) // Convert HTML to plain text

    // Prevent unnecessary Redux updates if the content hasn't changed
    if (plainText !== skillsText) {
      setSkillsText(plainText)

      dispatch(
        updateSection({
          sectionId: 'skills',
          content: {
            items: plainText.split(',').map(skill => skill.trim()) // Convert to array
          }
        })
      )
    }
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
