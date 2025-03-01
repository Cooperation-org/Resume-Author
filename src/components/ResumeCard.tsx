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
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DownloadIcon from '@mui/icons-material/Download'
import { LinkIcon } from 'lucide-react'
import { GoogleDriveStorage, Resume } from '@cooperation/vc-storage'
import { getLocalStorage } from '../tools/cookie'
import Logo from '../assets/blue-logo.png'
import { useNavigate } from 'react-router-dom'
import DeleteConfirmationDialog from './DeleteConfirmDialog'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../redux/store'
import { deleteResume, duplicateResume, updateTitle } from '../redux/slices/myresumes'
import { SVGBadge } from '../assets/svgs'
import { storeFileTokens } from '../firebase/storage'
import html2pdf from 'html2pdf.js'

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
  date: string // ISO date string like "2025-02-26T13:37:25.520Z" for non-drafts
  credentials: number
  isDraft?: boolean
  resume: any
}

const StyledCard = styled(Card)(() => ({
  border: `1px solid #001aff`,
  boxShadow: 'none',
  borderRadius: '12px',
  '&:hover': { backgroundColor: '#f9f9f9' }
}))

// Helper function to format date as "Month Day, Year"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

// Helper function to get time ago string (e.g., "2 days ago", "3 hours ago")
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  // Convert to appropriate units
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffYears > 0) {
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`
  } else if (diffMonths > 0) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`
  } else if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  } else if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  } else if (diffMins > 0) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
  } else {
    return `${diffSecs} ${diffSecs === 1 ? 'second' : 'seconds'} ago`
  }
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  id,
  title,
  date,
  credentials,
  isDraft,
  resume
}) => {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Format the date
  const formattedDate = formatDate(date)

  // Get time ago for the appropriate timestamp
  // For drafts, use lastUpdated; for non-drafts, use the date prop
  const timeAgo = isDraft
    ? resume?.content?.lastUpdated
      ? getTimeAgo(resume.content.lastUpdated)
      : 'Just now'
    : getTimeAgo(date)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const accessToken = getLocalStorage('auth')
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
        try {
          // ✅ Dispatch Redux Action to Update File Name
          dispatch(
            updateTitle({
              id,
              newTitle: editedTitle,
              type: isDraft ? 'unsigned' : 'signed'
            })
          )

          const newFileName = `${editedTitle}.json`
          await storage.updateFileData(id, { fileName: newFileName })

          console.log('✅ File renamed successfully:', newFileName)
        } catch (error) {
          console.error('❌ Error renaming file:', error)
        }
      }
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleDeleteResume = () => {
    setDeleteDialogOpen(true)
  }

  const handleDuplicateResume = async () => {
    dispatch(duplicateResume({ id, type: 'unsigned' }))
    // resume.content.resume.title = `${title} - Copy`
    const file = await resumeManager.saveResume({
      resume: resume.content,
      type: 'unsigned'
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://example.com/resume/${id}`)
    setShowCopiedTooltip(true)
    setTimeout(() => setShowCopiedTooltip(false), 2000)
    handleMenuClose()
  }

  const handleConfirmDelete = async () => {
    dispatch(deleteResume({ id, type: isDraft ? 'unsigned' : 'signed' }))
    setDeleteDialogOpen(false)
    handleMenuClose()
    const deleted = await storage.delete(id)
    console.log('🚀 ~ handleConfirmDelete ~ deleted:', deleted)
  }

  const handlePreviewResume = () => {
    if (isDraft) {
      navigate('/resume/preview')
    } else {
      navigate(`/resume/preview/${id}`)
    }
  }
  const exportResumeToPDF = (data: any) => {
    const element = document.getElementById('resume-preview')
    if (!element) return

    const options = {
      margin: [0, 0, 0, 0],
      filename: `${data.contact.fullName}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    const metadata = {
      title: `${data.contact.fullName}'s Resume`,
      creator: 'Reactive Resume',
      subject: 'Resume',
      keywords: ['Resume', 'CV', data.contact.fullName],
      custom: { resumeData: JSON.stringify(data) }
    }

    html2pdf().set(metadata).from(element).set(options).save()
  }

  return (
    <>
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
                <SVGBadge />
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
                    onKeyDown={e => e.key === 'Enter' && handleBlurOrEnter(e as any)}
                    inputRef={inputRef}
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
                  <Box
                    // to={`/resume/${id}`} // this will be after creating the review page and will replace box with link
                    style={{
                      fontWeight: 500,
                      textDecoration: 'underline',
                      color: '#3c4599'
                    }}
                  >
                    {title} - {formattedDate}
                  </Box>
                )}
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mt: 0.5, fontSize: '0.875rem' }}
                >
                  {isDraft
                    ? `DRAFT - ${timeAgo}`
                    : `${timeAgo} - ${credentials} Credentials`}
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
                    <ActionButton
                      size='small'
                      startIcon={<VisibilityOutlinedIcon />}
                      onClick={handlePreviewResume}
                    >
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
                    <ActionButton
                      onClick={() => exportResumeToPDF(resume)}
                      size='small'
                      startIcon={<DownloadIcon />}
                    >
                      Download PDF
                    </ActionButton>
                    <ActionButton
                      size='small'
                      startIcon={<VisibilityOutlinedIcon />}
                      onClick={handlePreviewResume}
                    >
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
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
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
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
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
