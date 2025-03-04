import React, { useState, useCallback, useEffect, useRef } from 'react'
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

interface VolunteerWorkProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
  initialData?: any
}

export default function VolunteerWork({
  onAddFiles,
  onDelete,
  onAddCredential,
  initialData
}: VolunteerWorkProps) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const reduxUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)
  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)

  const [volunteerWorks, setVolunteerWorks] = useState<VolunteerWork[]>([
    {
      role: '',
      organization: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyVolunteering: false,
      description: '',
      showDuration: false,
      duration: '',
      id: '',
      verificationStatus: 'unverified',
      credentialLink: ''
    }
  ])

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({
    0: true
  })

  const debouncedReduxUpdate = useCallback(
    (items: VolunteerWork[]) => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
      reduxUpdateTimeoutRef.current = setTimeout(() => {
        dispatch(
          updateSection({
            sectionId: 'volunteerWork',
            content: {
              items: items
            }
          })
        )
      }, 500)
    },
    [dispatch]
  )

  useEffect(() => {
    if (resume?.volunteerWork?.items && resume.volunteerWork.items.length > 0) {
      const typedItems = resume.volunteerWork.items.map((item: any) => ({
        role: item.role || '',
        organization: item.organization || '',
        location: item.location || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        currentlyVolunteering: Boolean(item.currentlyVolunteering),
        description: item.description || '',
        showDuration:
          item.showDuration === undefined ? false : Boolean(item.showDuration),
        duration: item.duration || '',
        id: item.id || '',
        verificationStatus: item.verificationStatus || 'unverified',
        credentialLink: item.credentialLink || '',
        ...item
      }))

      const shouldUpdate =
        initialLoadRef.current || typedItems.length !== volunteerWorks.length

      if (shouldUpdate) {
        initialLoadRef.current = false

        setVolunteerWorks(typedItems)
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

  const handleVolunteerWorkChange = useCallback(
    (index: number, field: string, value: any) => {
      setVolunteerWorks(prevVolunteerWorks => {
        const updatedVolunteerWorks = [...prevVolunteerWorks]
        updatedVolunteerWorks[index] = {
          ...updatedVolunteerWorks[index],
          [field]: value
        }
        if (field !== 'description') {
          debouncedReduxUpdate(updatedVolunteerWorks)
        }

        return updatedVolunteerWorks
      })
    },
    [debouncedReduxUpdate]
  )

  const handleDescriptionChange = useCallback(
    (index: number, value: string) => {
      setVolunteerWorks(prevVolunteerWorks => {
        const updatedVolunteerWorks = [...prevVolunteerWorks]
        updatedVolunteerWorks[index] = {
          ...updatedVolunteerWorks[index],
          description: value
        }
        if (reduxUpdateTimeoutRef.current) {
          clearTimeout(reduxUpdateTimeoutRef.current)
        }

        reduxUpdateTimeoutRef.current = setTimeout(() => {
          dispatch(
            updateSection({
              sectionId: 'volunteerWork',
              content: {
                items: updatedVolunteerWorks
              }
            })
          )
        }, 1000)

        return updatedVolunteerWorks
      })
    },
    [dispatch]
  )

  const handleAddAnotherItem = useCallback(() => {
    const emptyItem: VolunteerWork = {
      role: '',
      organization: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyVolunteering: false,
      description: '',
      showDuration: false,
      duration: '',
      id: '',
      verificationStatus: 'unverified',
      credentialLink: ''
    }

    setVolunteerWorks(prevVolunteerWorks => {
      const updatedVolunteerWorks = [...prevVolunteerWorks, emptyItem]

      dispatch(
        updateSection({
          sectionId: 'volunteerWork',
          content: {
            items: updatedVolunteerWorks
          }
        })
      )

      return updatedVolunteerWorks
    })

    const newIndex = volunteerWorks.length
    setExpandedItems(prev => ({
      ...prev,
      [newIndex]: true
    }))
  }, [volunteerWorks.length, dispatch])

  const handleDeleteVolunteerWork = useCallback(
    (index: number) => {
      if (volunteerWorks.length <= 1) {
        if (onDelete) onDelete()
        return
      }

      setVolunteerWorks(prevVolunteerWorks => {
        const updatedVolunteerWorks = prevVolunteerWorks.filter((_, i) => i !== index)
        dispatch(
          updateSection({
            sectionId: 'volunteerWork',
            content: {
              items: updatedVolunteerWorks
            }
          })
        )

        return updatedVolunteerWorks
      })

      setExpandedItems(prev => {
        const newExpandedState: Record<number, boolean> = {}
        volunteerWorks
          .filter((_, i) => i !== index)
          .forEach((_, i) => {
            if (i === 0 && volunteerWorks.length - 1 === 1) {
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
    [volunteerWorks, dispatch, onDelete]
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

        setVolunteerWorks(prevVolunteerWorks => {
          const updatedVolunteerWorks = [...prevVolunteerWorks]
          updatedVolunteerWorks[activeSectionIndex] = {
            ...updatedVolunteerWorks[activeSectionIndex],
            verificationStatus: 'verified',
            credentialLink: credentialLink
          }

          dispatch(
            updateSection({
              sectionId: 'volunteerWork',
              content: {
                items: updatedVolunteerWorks
              }
            })
          )

          return updatedVolunteerWorks
        })
      }

      setShowCredentialsOverlay(false)
      setActiveSectionIndex(null)
    },
    [activeSectionIndex, dispatch]
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
        Add volunteer experience to showcase your community involvement and transferable
        skills. This can be especially valuable if you're a student, career changer, or
        have employment gaps.
      </Typography>

      {volunteerWorks.map((volunteer, index) => (
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
                  <Typography variant='body1'>Role:</Typography>
                  <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
                    {volunteer.role || 'Untitled Role'}
                  </Typography>
                </>
              ) : (
                <Box display='flex' alignItems='center'>
                  <Typography variant='body1'>Volunteer Details</Typography>
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
                label='Role Title'
                placeholder='e.g., Volunteer Coordinator'
                value={volunteer.role}
                onChange={e => handleVolunteerWorkChange(index, 'role', e.target.value)}
                variant='outlined'
              />

              <TextField
                sx={{ bgcolor: '#FFF' }}
                size='small'
                fullWidth
                label='Organization'
                placeholder='e.g., Red Cross'
                value={volunteer.organization}
                onChange={e =>
                  handleVolunteerWorkChange(index, 'organization', e.target.value)
                }
              />

              <TextField
                sx={{ bgcolor: '#FFF' }}
                size='small'
                fullWidth
                label='Location (optional)'
                placeholder='e.g., New York, NY'
                value={volunteer.location}
                onChange={e =>
                  handleVolunteerWorkChange(index, 'location', e.target.value)
                }
              />

              <Box display='flex' alignItems='start' flexDirection='column'>
                <Typography variant='body1'>Dates</Typography>
                <Box display='flex' alignItems='center'>
                  <PinkSwitch
                    checked={volunteer.showDuration}
                    onChange={e =>
                      handleVolunteerWorkChange(index, 'showDuration', e.target.checked)
                    }
                    sx={{ color: '#34C759' }}
                  />
                  <Typography>Show duration instead of exact dates</Typography>
                </Box>
              </Box>

              {volunteer.showDuration ? (
                <TextField
                  sx={{ bgcolor: '#FFF' }}
                  size='small'
                  fullWidth
                  label='Duration'
                  placeholder='e.g., 6 months'
                  value={volunteer.duration}
                  onChange={e =>
                    handleVolunteerWorkChange(index, 'duration', e.target.value)
                  }
                  variant='outlined'
                />
              ) : (
                <Box display='flex' gap={2}>
                  <TextField
                    sx={{ bgcolor: '#FFF', width: '50%' }}
                    size='small'
                    type='date'
                    label='Start Date'
                    value={volunteer.startDate}
                    onChange={e =>
                      handleVolunteerWorkChange(index, 'startDate', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    sx={{ bgcolor: '#FFF', width: '50%' }}
                    size='small'
                    type='date'
                    label='End Date'
                    value={volunteer.endDate}
                    onChange={e =>
                      handleVolunteerWorkChange(index, 'endDate', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    disabled={volunteer.currentlyVolunteering}
                  />
                </Box>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={volunteer.currentlyVolunteering}
                    onChange={e =>
                      handleVolunteerWorkChange(
                        index,
                        'currentlyVolunteering',
                        e.target.checked
                      )
                    }
                  />
                }
                label='I currently volunteer here'
              />

              <Typography variant='body1'>
                Describe your volunteer activities and achievements:
              </Typography>
              <TextEditor
                key={`editor-${index}`}
                value={volunteer.description || ''}
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
                <StyledButton startIcon={<SVGAddFiles />} onClick={onAddFiles}>
                  Add file(s)
                </StyledButton>
                <StyledButton
                  startIcon={<SVGDeleteSection />}
                  onClick={() => handleDeleteVolunteerWork(index)}
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
          onClick={() => handleOpenCredentialsOverlay(volunteerWorks.length - 1)}
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
          Add credential
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
          Add another position
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
