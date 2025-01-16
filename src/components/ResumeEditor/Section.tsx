import { Paper } from '@mui/material'
import SectionContent from './SectionContent'

interface SectionProps {
  sectionId: keyof Resume
  highlightedText: string
  tooltipPosition: { top: number; left: number } | null
}

const Section = ({ sectionId, highlightedText, tooltipPosition }: SectionProps) => {
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
      <SectionContent sectionId={sectionId} />
    </Paper>
  )
}

export default Section
