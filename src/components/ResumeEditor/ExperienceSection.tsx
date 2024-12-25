import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem
} from '@mui/material'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import EditIcon from '@mui/icons-material/Edit'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import type { RootState } from '../../redux/store'
import {
  addExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences
} from '../../redux/slices/resume'

interface JobLevel {
  id: string
  name: string
}

interface ExperienceFormData {
  id: string
  company: string
  domainName: string
  title: string
  city: string
  postalCode: string
  countryCode: string
  unitName: string
  duration: string
  jobLevels: JobLevel[]
}

const defaultFormData: ExperienceFormData = {
  id: '',
  company: '',
  domainName: '',
  title: '',
  city: '',
  postalCode: '',
  countryCode: 'US',
  unitName: '',
  duration: '',
  jobLevels: [{ id: `joblevel-${Date.now()}`, name: '' }]
}

const formatToWorkExperience = (formData: ExperienceFormData): WorkExperience => ({
  id: formData.id,
  employmentHistoryItem: {
    organization: {
      tradeName: formData.company,
      domainName: formData.domainName
    },
    title: formData.title,
    location: {
      city: formData.city,
      postalCode: formData.postalCode,
      countryCode: formData.countryCode
    },
    organizationUnit: {
      responsibilityCode: 'Unit',
      name: formData.unitName
    },
    jobLevels: formData.jobLevels.map(level => ({ name: level.name })),
    duration: formData.duration
  },
  verificationStatus: 'unverified' as const,
  isVisible: true,
  proof: {},
  company: '',
  position: '',
  startDate: '',
  description: '',
  achievements: []
})

const formatFromWorkExperience = (experience: WorkExperience): ExperienceFormData => ({
  id: experience.id,
  company: experience.employmentHistoryItem.organization.tradeName,
  domainName: experience.employmentHistoryItem.organization.domainName ?? '',
  title: experience.employmentHistoryItem.title,
  city: experience.employmentHistoryItem.location.city || '',
  postalCode: experience.employmentHistoryItem.location.postalCode ?? '',
  countryCode: experience.employmentHistoryItem.location.countryCode ?? 'US',
  unitName: experience.employmentHistoryItem.organizationUnit.name ?? '',
  duration: experience.employmentHistoryItem.duration,
  jobLevels:
    experience.employmentHistoryItem.jobLevels.length > 0
      ? experience.employmentHistoryItem.jobLevels.map((level, index) => ({
          id: `joblevel-${experience.id}-${index}`,
          name: level.name
        }))
      : [{ id: `joblevel-${experience.id}-0`, name: '' }]
})

const ExperienceSection: React.FC = () => {
  const dispatch = useDispatch()
  const experiences = useSelector(
    (state: RootState) => state.resume.resume?.experience?.items || []
  )

  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<ExperienceFormData>(defaultFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isViewing, setIsViewing] = useState(false)
  const [viewingExp, setViewingExp] = useState<WorkExperience | null>(null)
  const [isSectionVisible, setIsSectionVisible] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuIndex, setMenuIndex] = useState<number | null>(null)
  const menuOpen = Boolean(anchorEl)

  const handleDeleteAllExperience = useCallback(() => {
    experiences.forEach(exp => {
      dispatch(deleteExperience({ id: exp.id }))
    })
  }, [dispatch, experiences])

  const handleToggleSectionVisibility = useCallback(() => {
    setIsSectionVisible(prev => !prev)
  }, [])

  const handleAddCredentials = useCallback(() => {
    console.log('Add credentials clicked')
  }, [])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget)
    setMenuIndex(index)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuIndex(null)
  }

  const handleAddExperience = useCallback(() => {
    setFormData({
      ...defaultFormData,
      id: Date.now().toString()
    })
    setIsAdding(true)
  }, [])

  const handleSave = useCallback(() => {
    const experienceData = formatToWorkExperience(formData)
    if (editingId) {
      dispatch(updateExperience({ experience: experienceData, id: editingId }))
    } else {
      dispatch(addExperience(experienceData))
    }
    setIsAdding(false)
    setEditingId(null)
    setFormData(defaultFormData)
  }, [dispatch, editingId, formData])

  const handleEdit = useCallback((experience: WorkExperience) => {
    setFormData(formatFromWorkExperience(experience))
    setEditingId(experience.id)
    setIsAdding(true)
  }, [])

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteExperience({ id }))
    },
    [dispatch]
  )

  const handleCancel = useCallback(() => {
    setIsAdding(false)
    setEditingId(null)
    setFormData(defaultFormData)
  }, [])

  const handleInputChange = useCallback(
    (field: keyof ExperienceFormData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleAddJobLevel = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      jobLevels: [...prev.jobLevels, { id: `joblevel-${Date.now()}`, name: '' }]
    }))
  }, [])

  const handleRemoveJobLevel = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      jobLevels: prev.jobLevels.filter(level => level.id !== id)
    }))
  }, [])

  const handleJobLevelChange = useCallback((id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      jobLevels: prev.jobLevels.map(level =>
        level.id === id ? { ...level, name: value } : level
      )
    }))
  }, [])

  const handleView = (experience: WorkExperience) => {
    setViewingExp(experience)
    setIsViewing(true)
  }
  const handleCloseView = () => {
    setViewingExp(null)
    setIsViewing(false)
  }

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index <= 0) return
      const reordered = [...experiences]
      const temp = reordered[index]
      reordered[index] = reordered[index - 1]
      reordered[index - 1] = temp
      dispatch(reorderExperiences(reordered))
    },
    [dispatch, experiences]
  )

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index >= experiences.length - 1) return
      const reordered = [...experiences]
      const temp = reordered[index]
      reordered[index] = reordered[index + 1]
      reordered[index + 1] = temp
      dispatch(reorderExperiences(reordered))
    },
    [dispatch, experiences]
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        height: !isSectionVisible ? 110 : experiences.length === 0 ? 166 : 'auto',
        alignSelf: 'stretch',
        borderRadius: '4px',
        pt: '20px',
        pb: '0px',
        px: '20px',
        boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
        mb: '30px'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          sx={{
            fontWeight: 500,
            color: '#000000',
            fontSize: 24,
            mr: '15px'
          }}
        >
          Experience
        </Typography>
        <Box sx={{ flex: 1 }} />

        <Button
          onClick={handleDeleteAllExperience}
          startIcon={<DeleteIcon sx={{ width: 24, height: 24, color: '#4F5C70' }} />}
          variant='text'
          sx={{
            color: '#4F5C70',
            textTransform: 'none',
            fontSize: 16,
            mr: '30px'
          }}
        >
          Delete
        </Button>

        <Button
          onClick={handleToggleSectionVisibility}
          startIcon={
            isSectionVisible ? (
              <VisibilityIcon sx={{ width: 24, height: 24, color: '#4F5C70' }} />
            ) : (
              <VisibilityOffIcon sx={{ width: 24, height: 24, color: '#4F5C70' }} />
            )
          }
          variant='text'
          sx={{
            color: '#4F5C70',
            textTransform: 'none',
            fontSize: 16,
            mr: '30px'
          }}
        >
          {isSectionVisible ? 'Hide' : 'Show'}
        </Button>

        <Button
          onClick={handleAddCredentials}
          startIcon={<AddToPhotosIcon sx={{ width: 24, height: 24, color: '#4F5C70' }} />}
          variant='text'
          sx={{
            color: '#4F5C70',
            textTransform: 'none',
            fontSize: 16,
            mr: '16px'
          }}
        >
          Add credentials
        </Button>

        {/* Add More menu if needed */}
        {/* <Button variant='text' sx={{ minWidth: 'auto' }}>
          <MoreVertIcon />
        </Button> */}
      </Box>

      {isSectionVisible && (
        <Box sx={{ mb: '12px' }}>
          {experiences.map((exp: WorkExperience, index: number) => (
            <Box
              key={exp.id}
              sx={{
                alignSelf: 'stretch',
                background: '#F7F9FC',
                borderRadius: 4,
                p: '13px',
                mb: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', flex: 1 }}
                onClick={() => handleView(exp)}
              >
                <Box sx={{ flex: 1, mr: 1 }}>
                  <Typography sx={{ color: '#78809A', fontSize: 14, mb: '5px' }}>
                    {exp.employmentHistoryItem.organization.tradeName}
                  </Typography>
                  <Typography sx={{ color: '#2D2D47', fontSize: 16 }}>
                    {exp.employmentHistoryItem.title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: '#78809A',
                    fontSize: 14,
                    mr: '20px'
                  }}
                >
                  {exp.employmentHistoryItem.duration}
                </Typography>
              </Box>

              <Button
                onClick={event => handleMenuClick(event, index)}
                variant='text'
                sx={{ minWidth: 'auto' }}
              >
                <MoreVertIcon />
              </Button>
            </Box>
          ))}

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            {menuIndex != null && (
              <>
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    handleView(experiences[menuIndex])
                  }}
                >
                  View
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    handleEdit(experiences[menuIndex])
                  }}
                >
                  <EditIcon sx={{ width: 24, height: 24, mr: 1 }} />
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    handleDelete(experiences[menuIndex].id)
                  }}
                >
                  <DeleteIcon sx={{ width: 24, height: 24, mr: 1 }} />
                  Delete
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    handleMoveUp(menuIndex)
                  }}
                >
                  <KeyboardArrowUpIcon sx={{ width: 24, height: 24, mr: 1 }} />
                  Move Up
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    handleMoveDown(menuIndex)
                  }}
                >
                  <KeyboardArrowDownIcon sx={{ width: 24, height: 24, mr: 1 }} />
                  Move Down
                </MenuItem>
              </>
            )}
          </Menu>

          {experiences.length === 0 && !isAdding && (
            <Box
              onClick={handleAddExperience}
              sx={{
                alignSelf: 'stretch',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F7F9FC',
                borderRadius: '6px',
                border: 'none',
                height: '86px',
                cursor: 'pointer',
                '&:hover': { background: '#F0F4FA' }
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  color: '#2E2E48',
                  fontSize: 16
                }}
              >
                + Add Experience
              </Typography>
            </Box>
          )}

          {experiences.length > 0 && !isAdding && (
            <Box
              sx={{
                width: 176,
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F7F9FC',
                borderRadius: 4,
                px: 2,
                cursor: 'pointer',
                '&:hover': { background: '#F0F4FA' }
              }}
              onClick={handleAddExperience}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  color: '#2E2E48',
                  fontSize: 14,
                  flex: 1
                }}
              >
                Add Experience
              </Typography>
              <AddCircleOutlineIcon
                sx={{ mr: '14px', width: 30, height: 30, color: '#78809A' }}
              />
            </Box>
          )}
        </Box>
      )}

      <Dialog open={isAdding} onClose={handleCancel} maxWidth='md' fullWidth>
        <DialogTitle>{editingId ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label='Company Name'
              value={formData.company}
              onChange={e => handleInputChange('company', e.target.value)}
              fullWidth
            />
            <TextField
              label='Company Website'
              value={formData.domainName}
              onChange={e => handleInputChange('domainName', e.target.value)}
              fullWidth
              placeholder='e.g., https://company.com'
            />
            <TextField
              label='Job Title'
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label='City'
                value={formData.city}
                onChange={e => handleInputChange('city', e.target.value)}
                fullWidth
              />
              <TextField
                label='Postal Code'
                value={formData.postalCode}
                onChange={e => handleInputChange('postalCode', e.target.value)}
                fullWidth
              />
              <TextField
                label='Country Code'
                value={formData.countryCode}
                onChange={e => handleInputChange('countryCode', e.target.value)}
                fullWidth
                placeholder='e.g., US'
              />
            </Box>
            <TextField
              label='Department/Unit'
              value={formData.unitName}
              onChange={e => handleInputChange('unitName', e.target.value)}
              fullWidth
            />
            <TextField
              label='Duration'
              value={formData.duration}
              onChange={e => handleInputChange('duration', e.target.value)}
              fullWidth
              placeholder='e.g., Jan 2022 - Present'
            />

            <Box>
              <Typography variant='subtitle1' gutterBottom>
                Job Levels
              </Typography>
              {formData.jobLevels.map((level, index) => (
                <Box
                  key={level.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <TextField
                    label={`Job Level ${index + 1}`}
                    value={level.name}
                    onChange={e => handleJobLevelChange(level.id, e.target.value)}
                    fullWidth
                  />
                  {formData.jobLevels.length > 1 && (
                    <Button
                      color='error'
                      onClick={() => handleRemoveJobLevel(level.id)}
                      aria-label='remove job level'
                      variant='text'
                      sx={{ minWidth: 'auto' }}
                    >
                      <DeleteIcon fontSize='small' />
                    </Button>
                  )}
                </Box>
              ))}
              <Button
                variant='text'
                startIcon={<AddCircleIcon width={24} height={24} />}
                onClick={handleAddJobLevel}
              >
                Add Job Level
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant='contained'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isViewing} onClose={handleCloseView} maxWidth='md' fullWidth>
        <DialogTitle>Experience Details</DialogTitle>
        <DialogContent>
          {viewingExp && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant='h6'>
                {viewingExp.employmentHistoryItem.organization.tradeName}
              </Typography>
              <Typography>{viewingExp.employmentHistoryItem.title}</Typography>
              <Typography sx={{ color: '#78809A', fontSize: 14 }}>
                {viewingExp.employmentHistoryItem.duration}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant='body2'>
                  <strong>Location:</strong>{' '}
                  {viewingExp.employmentHistoryItem.location.city}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ExperienceSection
