import { Paper } from '@mui/material';
import SectionContent from './SectionContent';

interface SectionProps {
  sectionId: string;
  sectionData: any;
}

const Section = ({ sectionId, sectionData }: SectionProps) => {
  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
      <SectionContent
        sectionId={sectionId}
        sectionData={sectionData}
      />
    </Paper>
  );
};

export default Section;
