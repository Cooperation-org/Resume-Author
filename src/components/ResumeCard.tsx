import React, { useState } from 'react'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LinkIcon from '@mui/icons-material/Link'
import DownloadIcon from '@mui/icons-material/Download'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useDispatch } from 'react-redux'
import { removeSection, setSelectedResume, updateSection } from '../redux/slices/resume'
import { TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import Logo from '../assets/blue-logo.png'

interface ResumeCardProps {
  id: string
  title: string
  date: string
  credentials: number
  isDraft?: boolean
  lastUpdated?: string
}

const StyledCard = styled(Card)(({ theme }) => ({
  border: `1px solid #001aff`,
  boxShadow: 'none',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: theme.palette.background.paper
  }
}))

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  padding: '6px 12px',
  borderRadius: 8,
  color: '#3c4599',
  '& .MuiButton-startIcon': {
    marginRight: 4
  }
}))

const StyledMoreButton = styled(IconButton)(({ theme }) => ({
  padding: 8,
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.grey[100]
  }
}))

const ResumeCard: React.FC<ResumeCardProps> = ({
  id,
  title,
  date,
  credentials,
  isDraft = false,
  lastUpdated
}) => {
  const dispatch = useDispatch()
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false)

  const statusColor = isDraft ? '#6B7280' : '#4F46E5'

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleEditTitle = () => {
    setIsEditing(true)
  }

  const handleSaveTitle = () => {
    dispatch(updateSection({ sectionId: id, content: { title: editedTitle } }))
    setIsEditing(false)
  }

  const handleDeleteResume = () => {
    dispatch(removeSection(id))
    handleMenuClose()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://example.com/resume/${id}`)
    setShowCopiedTooltip(true)
    setTimeout(() => setShowCopiedTooltip(false), 2000)
  }

  const handleSelectResume = () => {
    dispatch(setSelectedResume({ id, title, date, credentials, isDraft }))
  }

  return (
    <StyledCard>
      <Box position={'relative'} sx={{ p: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' gap={1.5}>
            {!isDraft ? (
              <CheckCircleIcon
                sx={{
                  color: 'white',
                  backgroundColor: statusColor,
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
                  onChange={e => setEditedTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  autoFocus
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
                  {/* <ActionButton
                    size='small'
                    startIcon={<EditOutlinedIcon />}
                    onClick={handleEditTitle}
                  >
                    Edit
                  </ActionButton> */}
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

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem onClick={handleDeleteResume}>Delete</MenuItem>
          <MenuItem onClick={handleMenuClose}>Duplicate</MenuItem>
        </Menu>
      </Box>
    </StyledCard>
  )
}

export default ResumeCard
