import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import SectionContent from './SectionContent' // Import the reusable SectionContent component
import { SectionId } from '../../types/resumeTypes'

export const leftSections: SectionId[] = ['contact', 'languages']

const LeftSidebar = () => {
  return (
    <Box sx={{ width: 240 }}>
      <Typography variant='h6' mb={2}>
        Sections
      </Typography>
      {leftSections.map(sectionId => (
        <Paper key={sectionId} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
          {/* Use SectionContent for each section */}
          <SectionContent sectionId={sectionId} />
        </Paper>
      ))}
    </Box>
  )
}

export default LeftSidebar
