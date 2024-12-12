import { Box, TextField, Typography } from '@mui/material';

interface SectionContentProps {
  type: keyof Resume;
  content: any;
  isEditing: boolean;
  onContentChange: (content: any) => void;
}

const SectionContent = ({
  type,
  content,
  isEditing,
  onContentChange,
}: SectionContentProps) => {
  return (
    <Box>
      {isEditing ? (
        <TextField
          multiline
          fullWidth
          value={content}
          onChange={e => onContentChange(e.target.value)} // Update local state
          variant="outlined"
        />
      ) : (
        <Typography>{content || 'Add content here...'}</Typography>
      )}
    </Box>
  );
};

export default SectionContent;
