import {
  Save,
  Edit,
  Visibility,
  Delete,
  VisibilityOff,
} from '@mui/icons-material';
import { Paper, Box, Typography, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeSection,
  setSectionVisibility,
  updateSection,
} from '../../redux/slices/resume';
import SectionContent from './SectionContent';
import { RootState } from '../../redux/store';

interface SectionProps {
  type: string;
  title: string;
  content: any;
  onEdit?: (content: any) => void;
}

const Section = ({ type, title, content }: SectionProps) => {
  const [isEditing, setIsEditing] = useState(true);
  const [editContent, setEditContent] = useState(content);
  const dispatch = useDispatch();
  const isVisible = useSelector(
    (state: RootState) => state.resume.sectionVisibility[type]
  );
  const resume = useSelector((state: RootState) => state.resume.resume);

  useEffect(() => {
    console.log('Current Resume State:', resume);
  }, [resume]);

  const handleSave = () => {
    dispatch(updateSection({ sectionId: type, content: editContent }));
    console.log('resume', resume);
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(removeSection(type));
  };

  const handleVisibility = () => {
    dispatch(setSectionVisibility(type));
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Box sx={{ ml: 'auto' }}>
          {isEditing ? (
            <IconButton onClick={handleSave}>
              <Save />
            </IconButton>
          ) : (
            <IconButton onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          )}
          <IconButton onClick={handleVisibility}>
            {isVisible ? <Visibility /> : <VisibilityOff />}
          </IconButton>
          <IconButton onClick={handleDelete}>
            <Delete />
          </IconButton>
        </Box>
      </Box>
      <SectionContent
        type={type}
        content={editContent}
        isEditing={isEditing}
        onContentChange={setEditContent}
      />
    </Paper>
  );
};

export default Section;
