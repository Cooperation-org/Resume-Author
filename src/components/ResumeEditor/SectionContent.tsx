import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateSection } from '../../redux/slices/resume';

interface SectionContentProps {
  sectionId: string;
  sectionData: any;
}

const SectionContent = ({ sectionId, sectionData }: SectionContentProps) => {
  const dispatch = useDispatch();

  // Handle strings directly
  const [localValue, setLocalValue] = useState(
    typeof sectionData === 'string' ? sectionData : ''
  );

  // Handle arrays (e.g., items)
  const [items, setItems] = useState(
    Array.isArray(sectionData?.items) ? [...sectionData.items] : []
  );

  // Update string field
  const handleStringChange = (value: string) => {
    setLocalValue(value);
    dispatch(updateSection({ sectionId, content: value }));
  };

  // Update array items
  const handleItemChange = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    setItems(updatedItems);
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }));
  };

  // Add a new input field
  const handleAddItem = () => {
    const updatedItems = [...items, ''];
    setItems(updatedItems);
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }));
  };

  // Remove an input field
  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }));
  };

  return (
    <Box>
      {/* If the sectionData is a string */}
      {typeof sectionData === 'string' && (
        <TextField
          fullWidth
          variant="outlined"
          label="Edit Content"
          value={localValue}
          onChange={e => handleStringChange(e.target.value)}
          placeholder="Enter content..."
        />
      )}

      {/* If the sectionData has items */}
      {Array.isArray(sectionData?.items) && (
        <Box>
          <Typography
            variant="body1"
            fontWeight="600"
            mb={1}
          >
            Items
          </Typography>
          {items.map((item, index) => (
            <Paper
              key={index}
              sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2 }}
            >
              <TextField
                fullWidth
                label={`Item ${index + 1}`}
                value={item}
                onChange={e => handleItemChange(index, e.target.value)}
                placeholder="Enter item content..."
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveItem(index)}
                sx={{ ml: 1 }}
              >
                <Trash2 size={16} />
              </IconButton>
            </Paper>
          ))}

          {/* Add new item button */}
          <Button
            variant="outlined"
            startIcon={<Plus />}
            onClick={handleAddItem}
            sx={{ mt: 1 }}
          >
            Add Item
          </Button>
        </Box>
      )}

      {/* Default fallback */}
      {!(typeof sectionData === 'string') &&
        !Array.isArray(sectionData?.items) && (
          <Typography>No editable content available</Typography>
        )}
    </Box>
  );
};

export default SectionContent;
