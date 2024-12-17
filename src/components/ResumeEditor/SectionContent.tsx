import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateSection } from '../../redux/slices/resume';

interface SectionContentProps {
  sectionId: string;
  sectionData: any;
}

const SectionContent = ({ sectionId, sectionData }: SectionContentProps) => {
  const dispatch = useDispatch();

  // Local states
  const [localValue, setLocalValue] = useState(
    typeof sectionData === 'string' ? sectionData : ''
  );
  const [items, setItems] = useState(
    Array.isArray(sectionData?.items) ? [...sectionData.items] : []
  );
  const [newItemValue, setNewItemValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Update single string section
  const handleStringChange = (value: string) => {
    console.log(value);
    setLocalValue(value);
    dispatch(updateSection({ sectionId, content: value }));
  };

  // Add a new item
  const handleAddNewItem = () => {
    if (newItemValue.trim()) {
      const updatedItems = [...items, newItemValue.trim()];
      console.log('🚀 ~ handleAddNewItem ~ updatedItems:', updatedItems);
      setItems(updatedItems);

      // Dispatch the update with the correct 'items' format
      dispatch(
        updateSection({
          sectionId,
          content: { items: updatedItems }, // Correct format
        })
      );

      setNewItemValue(''); // Reset input
    }
  };

  // Update an existing item
  const handleUpdateItem = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    setItems(updatedItems);
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }));
  };

  // Remove an item
  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }));
  };

  const sectionsName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="h6"
          fontWeight="600"
        >
          {sectionsName}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* If section is a string */}
      {typeof sectionData === 'string' && (
        <TextField
          fullWidth
          multiline
          rows={4}
          value={localValue}
          onChange={e => handleStringChange(e.target.value)}
          placeholder="Enter content here..."
        />
      )}

      {/* If section has items */}
      {Array.isArray(sectionData?.items) && (
        <Box>
          {/* Display current items */}
          <Typography
            variant="body1"
            fontWeight="600"
          >
            Current {sectionsName}s:
          </Typography>
          <List>
            {items.map((item, index) => (
              <ListItem
                key={index}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <ListItemText
                  primary={
                    editingIndex === index ? (
                      <TextField
                        fullWidth
                        value={item}
                        onChange={e => handleUpdateItem(index, e.target.value)}
                        onBlur={() => setEditingIndex(null)} // Finish editing
                        autoFocus
                      />
                    ) : (
                      sectionId.charAt(0).toUpperCase() + sectionId.slice(1)
                    )
                  }
                />
                <Box>
                  <IconButton onClick={() => setEditingIndex(index)}>
                    <Edit size={16} />
                  </IconButton>
                  <IconButton onClick={() => handleRemoveItem(index)}>
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>

          {/* Add New Item */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              placeholder={
                'Add new' +
                ' ' +
                sectionId.charAt(0).toUpperCase() +
                sectionId.slice(1)
              }
              value={newItemValue}
              onChange={e => setNewItemValue(e.target.value)}
            />
            <Button
              variant="contained"
              startIcon={<Plus />}
              onClick={handleAddNewItem}
            >
              Add
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SectionContent;
