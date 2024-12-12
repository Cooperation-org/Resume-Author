import { Save, Edit, Visibility, VisibilityOff } from '@mui/icons-material';
import { Paper, Box, Typography, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setSectionVisibility, updateSection } from '../../redux/slices/resume';
import SectionContent from './SectionContent';

interface SectionProps {
  type: keyof Resume;
  title: string;
}

const Section = ({ type, title }: SectionProps) => {
  const dispatch = useDispatch();

  // Fetch the current content from Redux
  const contentFromRedux = useSelector((state: RootState) => {
    const resume = state.resume.resume;
    return resume ? resume[type] : '';
  });

  const isVisible = useSelector(
    (state: RootState) => state.resume.sectionVisibility[type]
  );

  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(contentFromRedux);

  // Sync local state with Redux when the Redux state changes
  useEffect(() => {
    setLocalContent(contentFromRedux);
  }, [contentFromRedux]);

  const handleSave = () => {
    // Dispatch the updated content to Redux
    dispatch(updateSection({ sectionId: type, content: localContent }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset local content to the original Redux state and exit edit mode
    setLocalContent(contentFromRedux);
    setIsEditing(false);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Box sx={{ ml: 'auto' }}>
          {isEditing ? (
            <>
              <IconButton onClick={handleSave}>
                <Save />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <Edit /> {/* Use this as a cancel icon */}
              </IconButton>
            </>
          ) : (
            <IconButton onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          )}
          <IconButton onClick={() => dispatch(setSectionVisibility(type))}>
            {isVisible ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Box>
      </Box>
      <SectionContent
        type={type}
        content={localContent} // Pass local content
        isEditing={isEditing}
        onContentChange={setLocalContent} // Update local state
      />
    </Paper>
  );
};

export default Section;
