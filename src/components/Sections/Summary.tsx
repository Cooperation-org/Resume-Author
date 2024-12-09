import { Box, Typography, TextField } from '@mui/material';

interface SummaryProps {
  content: string;
  onHighlight?: (text: string) => void;
  isEditing: boolean;
  onContentChange: (content: string) => void;
}

const Summary = ({
  content,
  onHighlight,
  isEditing,
  onContentChange,
}: SummaryProps) => {
  const handleTextSelect = () => {
    const selection = window.getSelection()?.toString();
    if (selection && onHighlight) {
      onHighlight(selection);
    }
  };

  return (
    <Box>
      {isEditing ? (
        <TextField
          multiline
          fullWidth
          value={content}
          onChange={e => onContentChange(e.target.value)}
          variant="outlined"
        />
      ) : (
        <Typography onMouseUp={handleTextSelect}>{content}</Typography>
      )}
    </Box>
  );
};

export default Summary;
