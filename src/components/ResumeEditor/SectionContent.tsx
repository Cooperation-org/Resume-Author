import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material'
import { Edit, Eye, Save, Trash2, EyeOff, Plus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateSection } from '../../redux/slices/resume'
import TextEditor from '../TextEditor/Texteditor'

interface SectionContentProps {
  sectionId: keyof Resume
}

const cleanHTML = (htmlContent: string) => {
  return htmlContent
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p><\/p>/g, '')
    .replace(/<br>/g, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
}

const SectionContent: React.FC<SectionContentProps> = ({ sectionId }) => {
  const dispatch = useDispatch()
  const resume = useSelector((state: any) => state.resume.resume)
  const sectionData = resume[sectionId]

  // Determine section type
  const isStringBased = typeof sectionData === 'string'
  const isListBased = Array.isArray(sectionData?.items)

  // Local states
  const [content, setContent] = useState<string>(sectionData || '')
  const [items, setItems] = useState<string[]>(sectionData?.items || [])
  const [editing, setEditing] = useState(false)
  const [newItemValue, setNewItemValue] = useState('')
  const [isVisible, setIsVisible] = useState(true)

  // Sync local state with Redux state
  useEffect(() => {
    if (isListBased) {
      setItems([...sectionData.items])
    } else {
      setContent(sectionData || '')
    }
  }, [sectionData, isListBased])

  // Toggle editing
  const toggleEdit = () => {
    if (editing) {
      // Save changes
      const updatedContent = isStringBased ? content : { items }
      dispatch(updateSection({ sectionId, content: updatedContent }))
    }
    setEditing(!editing)
  }

  // Toggle visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  // Add new item (for list-based sections)
  const handleAddNewItem = () => {
    const trimmedVal = newItemValue.trim()
    if (!trimmedVal) return
    const updatedItems = [...items, trimmedVal]
    setItems(updatedItems)
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }))
    setNewItemValue('')
  }

  // Update an existing item
  const handleUpdateItem = (index: number, value: string) => {
    const updatedItems = [...items]
    updatedItems[index] = value
    setItems(updatedItems)
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }))
  }

  // Remove an item
  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index)
    setItems(updatedItems)
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }))
  }

  return (
    <Box>
      {/* Section Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography variant='h6' fontWeight='600'>
          {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={toggleEdit}>
            {editing ? <Save size={16} /> : <Edit size={16} />}
          </IconButton>
          <IconButton onClick={toggleVisibility}>
            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* String-based Section */}
      {isStringBased && isVisible && (
        <Box>
          {!editing ? (
            <Box sx={{ whiteSpace: 'pre-wrap' }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: content ? cleanHTML(content) : `No ${sectionId} added yet.`
                }}
              />
            </Box>
          ) : (
            <TextEditor value={content} onChange={setContent} />
          )}
        </Box>
      )}

      {/* List-based Section */}
      {isListBased && isVisible && (
        <Box>
          {/* Warning message when items length is zero */}
          {items.length === 0 && !editing && (
            <Typography variant='body2' color='textSecondary'>
              No {sectionId} items added yet. Click edit to add new items.
            </Typography>
          )}

          {/* List of items */}
          {items.length > 0 && (
            <List>
              {items.map((item: string, index: number) => (
                <ListItem
                  key={item}
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}
                >
                  {editing ? (
                    <Box sx={{ width: '100%' }}>
                      <TextEditor
                        value={item}
                        onChange={(val: string) => handleUpdateItem(index, val)}
                      />
                    </Box>
                  ) : (
                    <ListItemText
                      primary={
                        <Box
                          sx={{ whiteSpace: 'pre-wrap' }}
                          dangerouslySetInnerHTML={{ __html: cleanHTML(item) }}
                        />
                      }
                    />
                  )}

                  {editing && (
                    <IconButton onClick={() => handleRemoveItem(index)}>
                      <Trash2 size={16} />
                    </IconButton>
                  )}
                </ListItem>
              ))}
            </List>
          )}

          {/* Add New Item */}
          {editing && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextEditor value={newItemValue} onChange={setNewItemValue} />
              <Button
                variant='outlined'
                sx={{ borderRadius: 5, alignSelf: 'flex-start' }}
                startIcon={<Plus />}
                onClick={handleAddNewItem}
              >
                Add
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default SectionContent
