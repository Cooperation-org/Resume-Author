import { Box, Paper, Typography, IconButton } from '@mui/material';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSectionVisibility, removeSection } from '../../redux/slices/resume';

interface LeftSidebarProps {
  sectionOrder: (keyof Resume)[];
}

const LeftSidebar = () => {
  const dispatch = useDispatch();
  const sectionOrder: (keyof Resume)[] = ['contact', 'languages'];
  return (
    <Box sx={{ width: 240 }}>
      <Typography
        variant="h6"
        mb={2}
      >
        Sections
      </Typography>
      {sectionOrder.map(key => {
        return (
          <Paper
            key={key}
            sx={{
              mb: 2,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="body1"
              fontWeight="500"
            >
              {key}
            </Typography>

            <IconButton
              size="small"
              onClick={() => dispatch(removeSection(key))}
            >
              <Edit size={16} />
            </IconButton>
          </Paper>
        );
      })}
    </Box>
  );
};

export default LeftSidebar;
