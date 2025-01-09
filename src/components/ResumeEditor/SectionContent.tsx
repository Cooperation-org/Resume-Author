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
import CredentialDialog from '../CredentialDialog'
import { SVGAdd, SVGDelete, SVGSectionIcon } from '../../assets/svgs'
import TextEditor from '../TextEditor/Texteditor'

interface SectionContentProps {
  sectionId: keyof Resume
}

// Define types for our items
type CredentialItem = {
  text: string
  credentialId: string
  verified: boolean
}

type SectionItem = string | CredentialItem

const SectionContent: React.FC<SectionContentProps> = ({ sectionId }) => {
  const dispatch = useDispatch()
  const resume = useSelector((state: any) => state.resume.resume)
  const claims = useSelector((state: any) => state.resume.claims)
  const sectionData = resume[sectionId]

  const isStringBased = typeof sectionData === 'string'
  const isListBased = Array.isArray(sectionData?.items)

  const [content, setContent] = useState(sectionData || '')
  const [items, setItems] = useState<SectionItem[]>(sectionData?.items || [])
  const [editing, setEditing] = useState(false)
  const [newItemValue, setNewItemValue] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const [isCredentialDialogOpen, setIsCredentialDialogOpen] = useState(false)

  useEffect(() => {
    if (isListBased) {
      setItems(sectionData.items || [])
    } else {
      setContent(sectionData || '')
    }
  }, [sectionData, isListBased])

  const toggleEdit = () => {
    if (editing) {
      const updatedContent = isStringBased ? content : { items }
      dispatch(updateSection({ sectionId, content: updatedContent }))
    }
    setEditing(!editing)
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const handleAddNewItem = () => {
    if (!newItemValue.trim()) return
    const updatedItems = [...items, newItemValue.trim()]
    setItems(updatedItems)
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }))
    setNewItemValue('')
  }

  const handleUpdateItem = (index: number, newValue: string) => {
    const updatedItems = [...items]
    const currentItem = updatedItems[index]

    if (typeof currentItem === 'object') {
      updatedItems[index] = {
        ...currentItem,
        text: newValue
      }
    } else {
      updatedItems[index] = newValue
    }

    setItems(updatedItems)
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }))
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index)
    setItems(updatedItems)
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }))
  }

  const handleCredentialsSelected = (selectedClaims: any[]) => {
    const newCredentialItems: CredentialItem[] = selectedClaims.map(claim => ({
      text: `${claim[0]?.data?.credentialSubject?.achievement[0]?.name} - ${claim[0]?.data?.credentialSubject?.name}`,
      credentialId: claim[0]?.id,
      verified: true
    }))

    const updatedItems = [...items, ...newCredentialItems]

    setItems(updatedItems)
    dispatch(updateSection({ sectionId, content: { items: updatedItems } }))
  }

  const renderListItem = (item: SectionItem, index: number) => {
    const itemText = typeof item === 'string' ? item : item.text
    const isCredential = typeof item === 'object'

    return (
      <ListItem
        key={isCredential ? item.credentialId : index}
        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
      >
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {editing ? (
                <TextEditor value={itemText} onChange={e => handleUpdateItem(index, e)} />
              ) : (
                <>
                  <Typography>{itemText}</Typography>
                  {isCredential && (
                    // we can remove it or use it as openCreds
                    <Typography
                      component='span'
                      sx={{
                        bgcolor: 'success.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem'
                      }}
                    >
                      Verified
                    </Typography>
                  )}
                </>
              )}
            </Box>
          }
        />
        <IconButton onClick={() => handleRemoveItem(index)}>
          <Trash2 size={16} />
        </IconButton>
      </ListItem>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <SVGSectionIcon />
          <Typography variant='h6' fontWeight='600'>
            {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
          </Typography>
        </Box>
        <IconButton>
          <SVGDelete />
          <Typography sx={{ ml: 1, fontSize: '16px' }}>Delete</Typography>
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {isVisible && (
        <>
          {isStringBased ? (
            <Box>
              {editing ? (
                <TextEditor value={content} onChange={e => setContent(e)} />
              ) : (
                <Typography variant='body1'>
                  {content || `No ${sectionId} added yet.`}
                </Typography>
              )}
            </Box>
          ) : (
            <Box>
              {items.length === 0 && !editing ? (
                <Typography variant='body2' color='textSecondary'>
                  No {sectionId} items added yet. Click edit to add new items.
                </Typography>
              ) : (
                <List>{items.map((item, index) => renderListItem(item, index))}</List>
              )}

              {editing && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <TextEditor value={newItemValue} onChange={e => setNewItemValue(e)} />
                  <Button
                    variant='outlined'
                    sx={{ borderRadius: 5 }}
                    startIcon={<Plus />}
                    onClick={handleAddNewItem}
                  >
                    Add
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </>
      )}

      <CredentialDialog
        open={isCredentialDialogOpen}
        onClose={() => setIsCredentialDialogOpen(false)}
        claims={claims || []}
        sectionId={sectionId}
        onCredentialsSelected={handleCredentialsSelected}
      />
    </Box>
  )
}

export default SectionContent
