import { Paper } from '@mui/material'
import SectionContent from './SectionContent'
import { SectionId } from '../../types/resumeTypes'
interface SectionProps {
  sectionId: SectionId
}

const Section = ({ sectionId }: SectionProps) => {
  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
      <SectionContent sectionId={sectionId} />
    </Paper>
  )
}

export default Section
