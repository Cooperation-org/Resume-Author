import { Paper, Box, Typography, Divider, IconButton } from '@mui/material';
import SectionContent from './SectionContent';
import { Edit, Eye, Trash2 } from 'lucide-react';

interface SectionProps {
  sectionId: string;
  sectionData: any;
}

const Section = ({ sectionId, sectionData }: SectionProps) => {
  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="h6"
          fontWeight="600"
        >
          {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
        </Typography>
        <Box>
          <IconButton size="small">
            <Edit size={16} />
          </IconButton>
          <IconButton size="small">
            <Eye size={16} />
          </IconButton>
          <IconButton size="small">
            <Trash2 size={16} />
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <SectionContent
        sectionId={sectionId}
        sectionData={sectionData}
      />
    </Paper>
  );
};

export default Section;
