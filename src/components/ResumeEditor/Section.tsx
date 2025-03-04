import React from 'react'
import { Paper, Box, Typography, Button } from '@mui/material'
import SectionDetails from './SectionDetails'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

interface SectionProps {
  sectionId: string
  onDelete?: () => void
  onAddFiles?: () => void
  onAddCredential?: (text: string) => void
  isRemovable?: boolean
}

const Section: React.FC<SectionProps> = ({
  sectionId,
  onDelete,
  onAddFiles,
  onAddCredential,
  isRemovable = false
}) => {
  const resume = useSelector((state: RootState) => state.resume.resume)

  // Helper function to map UI section names to data structure keys
  const getSectionKey = (sectionId: string): string => {
    const mapping: { [key: string]: string } = {
      'Professional Summary': 'summary',
      'Work Experience': 'experience',
      Education: 'education',
      'Skills and Abilities': 'skills',
      'Professional Affiliations': 'professionalAffiliations',
      Projects: 'projects',
      'Certifications and Licenses': 'certifications',
      'Volunteer Work': 'volunteerWork',
      'Hobbies and Interests': 'hobbiesAndInterests',
      Languages: 'languages'
    }
    return mapping[sectionId] || sectionId.toLowerCase().replace(/\s+/g, '')
  }

  // Get section data from the resume, handling both direct and content-nested structures
  const getSectionData = () => {
    if (!resume) return null

    const sectionKey = getSectionKey(sectionId)

    // Check if data is in content structure (draft resume)
    if ((resume as any).content && (resume as any).content[sectionKey]) {
      return (resume as any).content[sectionKey]
    }

    // Otherwise check direct path
    return (resume as any)[sectionKey]
  }

  return (
    <Paper
      sx={{
        bgcolor: '#FFF',
        p: '5px 20px 10px 20px',
        mb: '30px',
        borderRadius: '8px',
        boxShadow: '0px 2px 20px 0px rgba(0, 0, 0, 0.10)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          p: '15px 0 10px 0'
        }}
      >
        <Typography
          variant='h6'
          sx={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#2E2E48'
          }}
        >
          {sectionId}
        </Typography>
        {isRemovable && (
          <Button
            variant='outlined'
            color='error'
            size='small'
            onClick={onDelete}
            sx={{
              textTransform: 'none',
              borderColor: '#F1F1FB',
              color: '#2E2E48'
            }}
          >
            Remove Section
          </Button>
        )}
      </Box>

      <SectionDetails
        sectionId={sectionId}
        onDelete={onDelete}
        onAddFiles={onAddFiles}
        onAddCredential={onAddCredential}
        sectionData={getSectionData()}
      />
    </Paper>
  )
}

export default Section
