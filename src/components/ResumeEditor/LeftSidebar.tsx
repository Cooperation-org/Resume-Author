import { Box, Paper, Typography, IconButton } from '@mui/material';
import { Edit } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { removeSection } from '../../redux/slices/resume';

export const leftSections: (keyof Resume)[] = ['contact', 'languages'];
const LeftSidebar = () => {
  const dispatch = useDispatch();
  return (
    <Box sx={{ width: 240 }}>
      <Typography
        variant="h6"
        mb={2}
      >
        Sections
      </Typography>
      {leftSections.map(key => {
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
