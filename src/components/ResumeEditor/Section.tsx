import { Paper } from '@mui/material'
import SectionContent from './SectionContent'

interface SectionProps {
  sectionId: keyof Resume
  highlightedText: string
  tooltipPosition: { top: number; left: number } | null
}

const Section = ({ sectionId, highlightedText, tooltipPosition }: SectionProps) => {
  return (
<!-- <<<<<<< 53-applying-the-list-view-component
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
      <SectionContent sectionId={sectionId} highlightedText={highlightedText} />
======= -->
    <Paper
      sx={{
        bgcolor: '#FFF',
        p: '5px 20px 10px 20px',
        mb: '30px',
        borderRadius: '8px',
        boxShadow: '0px 2px 20px 0px rgba(0, 0, 0, 0.10)'
      }}
    >
      <SectionContent
        sectionId={sectionId}
        highlightedText={''}
        tooltipPosition={undefined}
      />
    </Paper>
  )
}

export default Section
