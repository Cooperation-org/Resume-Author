import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import SectionContent from './SectionContent' // Import the reusable SectionContent component

interface LeftSidebarProps {
  highlightedText: string
}

export const leftSections: (keyof Resume)[] = ['contact', 'languages']

const LeftSidebar: React.FC<LeftSidebarProps> = ({ highlightedText }) => {
  return (
    <Box sx={{ width: 240 }}>
      <Typography variant='h6' mb={2}>
        Sections
      </Typography>
      {leftSections.map(sectionId => (
        <Paper key={sectionId} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
          {/* Use SectionContent for each section and pass tooltip props */}
          <SectionContent sectionId={sectionId} highlightedText={highlightedText} />
        </Paper>
      ))}
    </Box>
  )
}

export default LeftSidebar
