import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  TextField,
  Typography,
  Switch,
  styled,
  alpha,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton
} from '@mui/material'
import {
  SVGSectionIcon,
  SVGDownIcon,
  SVGAddcredential,
  SVGAddFiles,
  SVGDeleteSection
} from '../../../assets/svgs'
import TextEditor from '../../TextEditor/Texteditor'
import { StyledButton } from './StyledButton'
import { useDispatch, useSelector } from 'react-redux'
import { updateSection } from '../../../redux/slices/resume'
import { RootState } from '../../../redux/store'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CredentialOverlay from '../../CredentialsOverlay'

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#34C759',
    '&:hover': {
      backgroundColor: alpha('#34C759', theme.palette.action.hoverOpacity)
    }
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#34C759'
  }
}))

interface WorkExperienceProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export default function WorkExperience({
  onAddFiles,
  onDelete,
  onAddCredential
}: WorkExperienceProps) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const reduxUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)
  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    {
      title: '',
      company: '',
      duration: '',
      currentlyEmployed: false,
      description: '',
      showDuration: true,
      position: '',
      startDate: '',
      achievements: [],
      id: '',
      verificationStatus: 'unverified',
      credentialLink: ''
    }
  ])
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({
    0: true
  })

  const debouncedReduxUpdate = useCallback(
    (items: WorkExperience[]) => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
      reduxUpdateTimeoutRef.current = setTimeout(() => {
        dispatch(
          updateSection({
            sectionId: 'experience',
            content: {
              items: items
            }
          })
        )
      }, 500)
    },
    [dispatch]
  )

  // Load existing work experience from Redux
  useEffect(() => {
    if (resume?.experience?.items && resume.experience.items.length > 0) {
      const typedItems = resume.experience.items.map((item: any) => ({
        title: item.title || '',
        company: item.company || '',
        duration: item.duration || '',
        currentlyEmployed: Boolean(item.currentlyEmployed),
        description: item.description || '',
        showDuration: item.showDuration === undefined ? true : Boolean(item.showDuration),
        position: item.position || '',
        startDate: item.startDate || '',
        achievements: item.achievements || [],
        id: item.id || '',
        verificationStatus: item.verificationStatus || 'unverified',
        credentialLink: item.credentialLink || '',
        ...item
      }))
      const shouldUpdate =
        initialLoadRef.current || typedItems.length !== workExperiences.length

      if (shouldUpdate) {
        initialLoadRef.current = false

        setWorkExperiences(typedItems)
        if (typedItems.length !== Object.keys(expandedItems).length) {
          const initialExpanded: Record<number, boolean> = {}
          typedItems.forEach((_, index) => {
            initialExpanded[index] =
              index < Object.keys(expandedItems).length ? expandedItems[index] : true
          })
          setExpandedItems(initialExpanded)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume])
  useEffect(() => {
    return () => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
    }
  }, [])

  const handleWorkExperienceChange = useCallback(
    (index: number, field: string, value: any) => {
      setWorkExperiences(prevExperiences => {
        const updatedExperiences = [...prevExperiences]
        updatedExperiences[index] = {
          ...updatedExperiences[index],
          [field]: value
        }
        if (field !== 'description') {
          debouncedReduxUpdate(updatedExperiences)
        }

        return updatedExperiences
      })
    },
    [debouncedReduxUpdate]
  )

  const handleDescriptionChange = useCallback(
    (index: number, value: string) => {
      setWorkExperiences(prevExperiences => {
        const updatedExperiences = [...prevExperiences]
        updatedExperiences[index] = {
          ...updatedExperiences[index],
          description: value
        }
        if (reduxUpdateTimeoutRef.current) {
          clearTimeout(reduxUpdateTimeoutRef.current)
        }

        reduxUpdateTimeoutRef.current = setTimeout(() => {
          dispatch(
            updateSection({
              sectionId: 'experience',
              content: {
                items: updatedExperiences
              }
            })
          )
        }, 1000)

        return updatedExperiences
      })
    },
    [dispatch]
  )

  const handleAddAnotherItem = useCallback(() => {
    const emptyItem: WorkExperience = {
      title: '',
      company: '',
      duration: '',
      currentlyEmployed: false,
      description: '',
      showDuration: true,
      position: '',
      startDate: '',
      achievements: [],
      id: '',
      verificationStatus: 'unverified',
      credentialLink: ''
    }

    setWorkExperiences(prevExperiences => {
      const updatedExperiences = [...prevExperiences, emptyItem]

      dispatch(
        updateSection({
          sectionId: 'experience',
          content: {
            items: updatedExperiences
          }
        })
      )

      return updatedExperiences
    })

    const newIndex = workExperiences.length
    setExpandedItems(prev => ({
      ...prev,
      [newIndex]: true
    }))
  }, [workExperiences.length, dispatch])

  const handleDeleteExperience = useCallback(
    (index: number) => {
      if (workExperiences.length <= 1) {
        if (onDelete) onDelete()
        return
      }

      setWorkExperiences(prevExperiences => {
        const updatedExperiences = prevExperiences.filter((_, i) => i !== index)
        dispatch(
          updateSection({
            sectionId: 'experience',
            content: {
              items: updatedExperiences
            }
          })
        )

        return updatedExperiences
      })
      setExpandedItems(prev => {
        const newExpandedState: Record<number, boolean> = {}
        workExperiences
          .filter((_, i) => i !== index)
          .forEach((_, i) => {
            if (i === 0 && workExperiences.length - 1 === 1) {
              newExpandedState[i] = true
            } else if (i < index) {
              newExpandedState[i] = prev[i] || false
            } else {
              newExpandedState[i] = prev[i + 1] || false
            }
          })
        return newExpandedState
      })
    },
    [workExperiences, dispatch, onDelete]
  )

  const toggleExpanded = useCallback((index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }, [])

  const handleOpenCredentialsOverlay = useCallback((index: number) => {
    setActiveSectionIndex(index)
    setShowCredentialsOverlay(true)
  }, [])

  const handleCredentialSelect = useCallback(
    (selectedCredentials: string[]) => {
      if (activeSectionIndex !== null && selectedCredentials.length > 0) {
        const credentialId = selectedCredentials[0]
        const credentialLink = `https://linkedcreds.allskillscount.org/view/${credentialId}`

        setWorkExperiences(prevExperiences => {
          const updatedExperiences = [...prevExperiences]
          updatedExperiences[activeSectionIndex] = {
            ...updatedExperiences[activeSectionIndex],
            verificationStatus: 'verified',
            credentialLink: credentialLink
          }

          dispatch(
            updateSection({
              sectionId: 'experience',
              content: {
                items: updatedExperiences
              }
            })
          )

          return updatedExperiences
        })
      }

      setShowCredentialsOverlay(false)
      setActiveSectionIndex(null)
    },
    [activeSectionIndex, dispatch]
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {workExperiences.map((experience, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: '#F1F1FB',
            px: '20px',
            py: '10px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '4px',
            gap: 2
          }}
        >
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            onClick={() => toggleExpanded(index)}
            sx={{ cursor: 'pointer' }}
          >
            <Box display='flex' alignItems='center' gap={2} flexGrow={1}>
              <SVGSectionIcon />
              {!expandedItems[index] ? (
                <>
                  <Typography variant='body1'>Job Title:</Typography>
                  <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
                    {experience.title || 'Untitled Position'}
                  </Typography>
                </>
              ) : (
                <Box display='flex' alignItems='center'>
                  <Typography variant='body1'>Job Title</Typography>
                </Box>
              )}
            </Box>
            <IconButton
              onClick={e => {
                e.stopPropagation()
                toggleExpanded(index)
              }}
              sx={{
                transform: expandedItems[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            >
              <SVGDownIcon />
            </IconButton>
          </Box>

          {expandedItems[index] && (
            <>
              <TextField
                sx={{ bgcolor: '#FFF' }}
                size='small'
                fullWidth
                placeholder='Title of your position'
                value={experience.title}
                onChange={e => handleWorkExperienceChange(index, 'title', e.target.value)}
                variant='outlined'
              />

              <Typography>Company</Typography>
              <TextField
                sx={{ bgcolor: '#FFF' }}
                size='small'
                fullWidth
                placeholder='Employer name'
                value={experience.company}
                onChange={e =>
                  handleWorkExperienceChange(index, 'company', e.target.value)
                }
              />

              <Box display='flex' alignItems='start' flexDirection='column'>
                <Typography variant='body1'>Dates</Typography>
                <Box display='flex' alignItems='center'>
                  <PinkSwitch
                    checked={experience.showDuration}
                    onChange={e =>
                      handleWorkExperienceChange(index, 'showDuration', e.target.checked)
                    }
                    sx={{ color: '#34C759' }}
                  />
                  <Typography>Show duration instead of exact dates</Typography>
                </Box>
              </Box>

              <Box display='flex' alignItems='center' gap={2}>
                <TextField
                  sx={{ bgcolor: '#FFF' }}
                  size='small'
                  placeholder='Enter total duration'
                  value={experience.duration}
                  onChange={e =>
                    handleWorkExperienceChange(index, 'duration', e.target.value)
                  }
                  variant='outlined'
                />
                <Box display='flex' alignItems='center' gap={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={experience.currentlyEmployed}
                        onChange={e =>
                          handleWorkExperienceChange(
                            index,
                            'currentlyEmployed',
                            e.target.checked
                          )
                        }
                      />
                    }
                    label='Currently employed here'
                  />
                </Box>
              </Box>

              <Typography variant='body1'>Describe your role at this company:</Typography>
              <TextEditor
                key={`editor-${index}`}
                value={experience.description || ''}
                onChange={val => handleDescriptionChange(index, val)}
                onAddCredential={onAddCredential}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '20px',
                  gap: '15px'
                }}
              >
                <StyledButton
                  startIcon={<SVGAddcredential />}
                  onClick={() => onAddCredential && onAddCredential('')}
                >
                  Add credential(s)
                </StyledButton>
                <StyledButton startIcon={<SVGAddFiles />} onClick={onAddFiles}>
                  Add file(s)
                </StyledButton>
                <StyledButton
                  startIcon={<SVGDeleteSection />}
                  onClick={() => handleDeleteExperience(index)}
                >
                  Delete this item
                </StyledButton>
              </Box>
            </>
          )}
        </Box>
      ))}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px'
        }}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={() => handleOpenCredentialsOverlay(workExperiences.length - 1)}
          sx={{
            borderRadius: '4px',
            width: '100%',
            textTransform: 'none',
            padding: '8px 44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F3F5F8',
            color: '#2E2E48',
            boxShadow: 'none',
            fontFamily: 'Nunito sans',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          <AddCircleOutlineIcon
            sx={{ marginRight: 1, width: '16px', height: '16px', color: '#2E2E48' }}
          />
          Verify this section
        </Button>

        <Button
          variant='contained'
          color='primary'
          onClick={handleAddAnotherItem}
          sx={{
            borderRadius: '4px',
            width: '100%',
            textTransform: 'none',
            padding: '8px 44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F3F5F8',
            color: '#2E2E48',
            boxShadow: 'none',
            fontFamily: 'Nunito sans',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          <AddCircleOutlineIcon
            sx={{ marginRight: 1, width: '16px', height: '16px', color: '#2E2E48' }}
          />
          Add another item
        </Button>
      </Box>

      {showCredentialsOverlay && (
        <CredentialOverlay
          onClose={() => {
            setShowCredentialsOverlay(false)
            setActiveSectionIndex(null)
          }}
          onSelect={handleCredentialSelect}
        />
      )}
    </Box>
  )
}
