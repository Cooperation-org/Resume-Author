import { Paper } from '@mui/material';
import SectionContent from './SectionContent';

interface SectionProps {
  sectionId: keyof Resume;
}

const Section = ({ sectionId }: SectionProps) => {
  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
      <SectionContent sectionId={sectionId} />
    </Paper>
  );
};

export default Section;
