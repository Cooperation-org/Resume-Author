import React, { useRef, useState } from 'react'
import {
  Card,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  CircularProgress,
  Tooltip,
  Button
} from '@mui/material'
import { styled } from '@mui/material/styles'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import ShareIcon from '@mui/icons-material/Share'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DownloadIcon from '@mui/icons-material/Download'
import { LinkIcon } from 'lucide-react'

import { useDispatch } from 'react-redux'
import { updateSection } from '../redux/slices/resume'
import { GoogleDriveStorage, Resume } from '@cooperation/vc-storage'
import { getCookie } from '../tools'
import Logo from '../assets/blue-logo.png'
import { Link } from 'react-router-dom'

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  padding: '6px 12px',
  borderRadius: 8,
  color: '#3c4599',
  '& .MuiButton-startIcon': {
    marginRight: 4
  }
}))

interface ResumeCardProps {
  id: string
  title: string
  date: string
  credentials: number
  isDraft?: boolean
  lastUpdated?: string
  resume: any
  resumes: any
  addNewResume: (newResume: any, type: 'signed' | 'unsigned') => void
  removeResume: (id: string, type: 'signed' | 'unsigned') => void
}

const StyledCard = styled(Card)(() => ({
  border: `1px solid #001aff`,
  boxShadow: 'none',
  borderRadius: '12px',
  '&:hover': { backgroundColor: '#f9f9f9' }
}))

const ResumeCard: React.FC<ResumeCardProps> = ({
  id,
  title,
  date,
  credentials,
  isDraft = false,
  lastUpdated,
  resume,
  addNewResume,
  removeResume,
  resumes
}) => {
  const dispatch = useDispatch()
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [isLoading, setIsLoading] = useState(false) // Loading state for duplicate & delete
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const accessToken = getCookie('auth_token')
  const storage = new GoogleDriveStorage(accessToken as string)
  const resumeManager = new Resume(storage)

  const handleEditTitle = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value)
  }

  const handleBlurOrEnter = async (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (!e || e.key === 'Enter') {
      setIsEditing(false)
      if (editedTitle !== title) {
        dispatch(updateSection({ id, title: editedTitle }))
      }
    }
    await storage.update(id, { title: editedTitle })
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleDeleteResume = async () => {
    setIsLoading(true)
    await storage.delete(id) // Delete from Google Drive
    removeResume(id, isDraft ? 'unsigned' : 'signed') // Remove from state
    setIsLoading(false)
    handleMenuClose()
  }

  const handleDuplicateResume = async () => {
    setIsLoading(true)
    try {
      handleMenuClose()
      const newResume = await resumeManager.saveResume({
        resume: resume.content,
        type: 'unsigned'
      })

      console.log('Duplicated Resume:', newResume)

      const duplicatedResume = {
        id: newResume.id,
        content: newResume.content,
        type: 'unsigned'
      }

      addNewResume(duplicatedResume, 'unsigned')

      console.log('Updated Resumes:', resumes)
    } catch (error) {
      console.error('Error duplicating resume:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://example.com/resume/${id}`)
    setShowCopiedTooltip(true)
    setTimeout(() => setShowCopiedTooltip(false), 2000)
    handleMenuClose()
  }

  return (
    <StyledCard>
      <Box position='relative' sx={{ p: 2, opacity: isLoading ? 0.5 : 1 }}>
        {/* Loading Spinner */}
        {isLoading && (
          <Box
            position='absolute'
            top='50%'
            left='50%'
            sx={{ transform: 'translate(-50%, -50%)' }}
          >
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Main Content */}
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          {/* Left Side: Title and Metadata */}
          <Box display='flex' gap={1.5}>
            {!isDraft ? (
              <CheckCircleIcon
                sx={{
                  color: 'white',
                  backgroundColor: '#4F46E5',
                  borderRadius: '50%',
                  p: 0.5,
                  width: 15,
                  height: 15
                }}
              />
            ) : (
              <img src={Logo} alt='Résumé Author' style={{ height: 25 }} />
            )}
            <Box>
              {isEditing ? (
                <TextField
                  type='text'
                  value={editedTitle}
                  onChange={handleTitleChange}
                  onBlur={() => handleBlurOrEnter()}
                  autoFocus
                  variant='standard'
                  sx={{
                    fontSize: '0.875rem',
                    '& .MuiInputBase-root': { padding: 0 },
                    '& .MuiInputBase-input': {
                      padding: 0,
                      margin: 0,
                      fontSize: 'inherit',
                      fontWeight: 500,
                      color: '#3c4599'
                    },
                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                    '& .MuiInput-underline:after': { borderBottom: 'none' }
                  }}
                />
              ) : (
                <Link
                  to={`/resume/${id}`}
                  style={{
                    fontWeight: 500,
                    textDecoration: 'underline',
                    color: '#3c4599'
                  }}
                >
                  {title} - {date}
                </Link>
              )}
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ mt: 0.5, fontSize: '0.875rem' }}
              >
                {isDraft
                  ? `DRAFT - ${lastUpdated}`
                  : `Just now - ${credentials} Credentials`}
              </Typography>
            </Box>
          </Box>

          {/* Right Side: Action Buttons */}
          <Box display='flex' alignItems='center' color={'#3c4599'} gap={0.5}>
            <Box className='resume-card-actions'>
              {isDraft ? (
                <>
                  <ActionButton
                    size='small'
                    startIcon={<EditOutlinedIcon />}
                    onClick={handleEditTitle}
                  >
                    Edit
                  </ActionButton>
                  <ActionButton size='small' startIcon={<VisibilityOutlinedIcon />}>
                    Preview
                  </ActionButton>
                </>
              ) : (
                <>
                  <Tooltip title={showCopiedTooltip ? 'Copied!' : 'Copy Link'}>
                    <ActionButton
                      size='small'
                      startIcon={<LinkIcon />}
                      onClick={handleCopyLink}
                    >
                      Copy Link
                    </ActionButton>
                  </Tooltip>
                  <ActionButton size='small' startIcon={<DownloadIcon />}>
                    Download PDF
                  </ActionButton>
                  <ActionButton size='small' startIcon={<VisibilityOutlinedIcon />}>
                    Preview
                  </ActionButton>
                </>
              )}
            </Box>
            <StyledMoreButton size='small' onClick={handleMenuOpen}>
              <MoreVertIcon sx={{ fontSize: 18 }} />
            </StyledMoreButton>
          </Box>
        </Box>

        {/* Menu for Additional Actions */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem onClick={handleDeleteResume} disabled={isLoading}>
            <ListItemIcon>
              <DeleteIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Delete' />
          </MenuItem>
          <MenuItem onClick={handleDuplicateResume} disabled={isLoading}>
            <ListItemIcon>
              <ContentCopyIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Duplicate' />
          </MenuItem>
        </Menu>
      </Box>
    </StyledCard>
  )
}

export default ResumeCard

const StyledMoreButton = styled(IconButton)(({ theme }) => ({
  padding: 8,
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.grey[100]
  }
}))
