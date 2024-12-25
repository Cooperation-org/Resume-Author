import React, { useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Trash2,
  EyeOff,
  HelpCircle,
  MoreVertical,
  Plus,
  BadgeCheck,
  Edit
} from 'lucide-react'
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
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

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

  const handleDragStart = useCallback((index: number) => {
    dragItem.current = index
  }, [])

  const handleDragEnter = useCallback((index: number) => {
    dragOverItem.current = index
  }, [])

  const handleDragEnd = useCallback(() => {
    const dragFrom = dragItem.current
    const dragTo = dragOverItem.current

    if (dragFrom === null || dragTo === null || dragFrom === dragTo) return

    const reorderedExperiences = Array.from(experiences)
    const [movedItem] = reorderedExperiences.splice(dragFrom, 1)
    reorderedExperiences.splice(dragTo, 0, movedItem)

    dispatch(reorderExperiences(reorderedExperiences))

    dragItem.current = null
    dragOverItem.current = null
  }, [dispatch, experiences])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        height: experiences.length === 0 ? 196 : 'auto',
        alignSelf: 'stretch',
        borderRadius: 4,
        pt: '30px',
        px: '20px',
        boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
        mb: '30px'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: '28px'
        }}
      >
        <Typography sx={{ color: '#000000', fontSize: 24, mr: '15px' }}>
          Experience
        </Typography>

        <HelpCircle size={20} style={{ marginRight: '13px' }} />

        <Typography sx={{ color: '#2639E9', fontSize: 14, cursor: 'pointer' }}>
          Tips
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
          <IconButton size='small'>
            <Trash2 size={24} color='#4F5C70' />
          </IconButton>
          <Typography sx={{ color: '#4F5C70', fontSize: 16, mr: '31px' }}>
            Delete
          </Typography>

          <IconButton size='small'>
            <EyeOff size={24} color='#4F5C70' />
          </IconButton>
          <Typography sx={{ color: '#4F5C70', fontSize: 16, mr: '31px' }}>
            Hide
          </Typography>

          <IconButton size='small'>
            <BadgeCheck size={24} color='#4F5C70' />
          </IconButton>
          <Typography sx={{ color: '#4F5C70', fontSize: 16, mr: '16px' }}>
            Add credentials
          </Typography>

          <IconButton size='small'>
            <MoreVertical size={20} />
          </IconButton>
        </Box>
      </Box>

      <Box>
        {experiences.map((exp: WorkExperience, index: number) => (
          <Box
            key={exp.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={e => e.preventDefault()}
            sx={{
              alignSelf: 'stretch',
              background: '#F7F9FC',
              borderRadius: 4,
              p: '13px',
              mb: '12px',
              cursor: 'grab',
              '&:active': {
                cursor: 'grabbing'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flex: 1, mr: 1 }}>
                <Typography sx={{ color: '#4F5C70', fontSize: 14, mb: '5px' }}>
                  {exp.employmentHistoryItem.organization.tradeName}
                </Typography>
                <Typography sx={{ color: '#2D2D47', fontSize: 16 }}>
                  {exp.employmentHistoryItem.title}
                </Typography>
              </Box>
              <Typography sx={{ color: '#4F5C70', fontSize: 14, mr: '50px', flex: 1 }}>
                {exp.employmentHistoryItem.duration}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size='small' onClick={() => handleEdit(exp)}>
                  <Edit size={16} />
                </IconButton>
                <IconButton size='small' onClick={() => handleDelete(exp.id)}>
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

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
            borderRadius: 6,
            border: 'none',
            height: '86px',
            cursor: 'pointer',
            '&:hover': { background: '#F0F4FA' }
          }}
        >
          <Typography sx={{ color: '#2D2D47', fontSize: 16 }}>
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
            background: '#F7F9FC',
            borderRadius: 4,
            px: 2,
            cursor: 'pointer',
            '&:hover': { background: '#F0F4FA' }
          }}
          onClick={handleAddExperience}
        >
          <Typography sx={{ color: '#2D2D47', fontSize: 14, flex: 1 }}>
            Add Experience
          </Typography>
          <Plus size={30} />
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
                    <IconButton
                      color='error'
                      onClick={() => handleRemoveJobLevel(level.id)}
                      aria-label='remove job level'
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                variant='text'
                startIcon={<Plus size={16} />}
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
    </Box>
  )
}

export default ExperienceSection
