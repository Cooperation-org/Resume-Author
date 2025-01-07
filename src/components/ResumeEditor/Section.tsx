import { Paper } from '@mui/material'
import SectionContent from './SectionContent'

interface SectionProps {
  sectionId: keyof Resume
  highlightedText: string
  credentials: string[]
  tooltipPosition: { top: number; left: number } | null
}

const Section = ({
  sectionId,
  highlightedText,
  credentials,
  tooltipPosition
}: SectionProps) => {
  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
      <SectionContent
        sectionId={sectionId}
        highlightedText={highlightedText}
        credentials={credentials}
        tooltipPosition={tooltipPosition}
      />
    </Paper>
  )
}

export default Section
