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
import CloseIcon from '@mui/icons-material/Close'
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
  onAddFiles?: (itemIndex?: number) => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
  evidence?: string[][]
}

interface SelectedCredential {
  id: string
  url: string
  name: string
}

interface VolunteerWorkItem {
  role: string
  organization: string
  location: string
  startDate: string
  endDate: string
  currentlyVolunteering: boolean
  description: string
  duration: string
  id: string
  verificationStatus: string
  credentialLink: string
  selectedCredentials: SelectedCredential[]
}

export default function VolunteerWork({
  onAddFiles,
  onDelete,
  onAddCredential,
  evidence = []
}: Readonly<VolunteerWorkProps>) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const reduxUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)
  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)
  const vcs = useSelector((state: any) => state.vcReducer.vcs)

  const [volunteerWorks, setVolunteerWorks] = useState<VolunteerWorkItem[]>([
    {
      role: '',
      organization: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyVolunteering: false,
      description: '',
      duration: '',
      id: '',
      verificationStatus: 'unverified',
      credentialLink: '',
      selectedCredentials: []
    }
  ])

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({
    0: true
  })

  const [useDuration, setUseDuration] = useState<boolean[]>([false])

  const calculateDuration = (
    startDate: string,
    endDate: string | undefined,
    currentlyVolunteering: boolean
  ): string => {
    if (!startDate) return ''
    const endDateObj = currentlyVolunteering || !endDate ? new Date() : new Date(endDate)
    const startDateObj = new Date(startDate)
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return ''
    }
    let years = endDateObj.getFullYear() - startDateObj.getFullYear()
    let months = endDateObj.getMonth() - startDateObj.getMonth()
    if (months < 0) {
      years--
      months += 12
    }
    let durationString = ''
    if (years > 0) {
      durationString += `${years} year${years !== 1 ? 's' : ''}`
    }
    if (months > 0 || years === 0) {
      if (durationString) durationString += ' '
      durationString += `${months} month${months !== 1 ? 's' : ''}`
    }
    return durationString || 'Less than a month'
  }

  const debouncedReduxUpdate = useCallback(
    (items: VolunteerWorkItem[]) => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
      reduxUpdateTimeoutRef.current = setTimeout(() => {
        dispatch(
          updateSection({
            sectionId: 'volunteerWork',
            content: { items }
          })
        )
      }, 500)
    },
    [dispatch]
  )

  const dateChangeString = volunteerWorks
    .map(vol => `${vol.startDate}-${vol.endDate}-${vol.currentlyVolunteering}`)
    .join('|')

  useEffect(() => {
    volunteerWorks.forEach((volunteer, index) => {
      if (useDuration[index]) {
        if (volunteer.startDate) {
          const calc = calculateDuration(
            volunteer.startDate,
            volunteer.endDate,
            volunteer.currentlyVolunteering
          )
          if (calc && calc !== volunteer.duration) {
            setVolunteerWorks(prev => {
              const updated = [...prev]
              updated[index] = { ...updated[index], duration: calc }
              return updated
            })
            if (reduxUpdateTimeoutRef.current) {
              clearTimeout(reduxUpdateTimeoutRef.current)
            }
            reduxUpdateTimeoutRef.current = setTimeout(() => {
              dispatch(
                updateSection({
                  sectionId: 'volunteerWork',
                  content: {
                    items: volunteerWorks.map((v, i) =>
                      i === index ? { ...v, duration: calc } : v
                    )
                  }
                })
              )
            }, 1000)
          }
        }
      }
    })
  }, [dateChangeString, dispatch, volunteerWorks, useDuration])

  useEffect(() => {
    if (resume?.volunteerWork?.items && resume.volunteerWork.items.length > 0) {
      const typed = resume.volunteerWork.items.map((item: any) => ({
        role: item.role || '',
        organization: item.organization || '',
        location: item.location || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        currentlyVolunteering: !!item.currentlyVolunteering,
        description: item.description || '',
        duration: item.duration || '',
        id: item.id || '',
        verificationStatus: item.verificationStatus || 'unverified',
        credentialLink: item.credentialLink || '',
        selectedCredentials: item.selectedCredentials || []
      })) as VolunteerWorkItem[]

      const needUpdate = initialLoadRef.current || typed.length !== volunteerWorks.length
      if (needUpdate) {
        initialLoadRef.current = false
        setVolunteerWorks(typed)
        const arr = typed.map(t => !!(!t.startDate && !t.endDate))
        setUseDuration(arr)
        if (typed.length !== Object.keys(expandedItems).length) {
          const initExp: Record<number, boolean> = {}
          typed.forEach((_, i) => {
            initExp[i] = i < Object.keys(expandedItems).length ? expandedItems[i] : true
          })
          setExpandedItems(initExp)
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
      setVolunteerWorks(prev => {
        const updated = [...prev]
        const item = { ...updated[index], [field]: value }
        if (!useDuration[index]) {
          item.duration = ''
        } else if (field === 'startDate' || field === 'endDate') {
          item.duration = calculateDuration(
            item.startDate,
            item.endDate,
            item.currentlyVolunteering
          )
        }
        updated[index] = item
        if (field !== 'description') {
          debouncedReduxUpdate(updated)
        }
        return updated
      })
    },
    [debouncedReduxUpdate, useDuration]
  )

  const handleDescriptionChange = useCallback(
    (index: number, val: string) => {
      setVolunteerWorks(prev => {
        const updated = [...prev]
        updated[index] = { ...updated[index], description: val }
        if (reduxUpdateTimeoutRef.current) {
          clearTimeout(reduxUpdateTimeoutRef.current)
        }
        reduxUpdateTimeoutRef.current = setTimeout(() => {
          dispatch(
            updateSection({
              sectionId: 'volunteerWork',
              content: { items: updated }
            })
          )
        }, 1000)
        return updated
      })
    },
    [dispatch]
  )

  const handleAddAnotherItem = useCallback(() => {
    const newItem: VolunteerWorkItem = {
      role: '',
      organization: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyVolunteering: false,
      description: '',
      duration: '',
      id: '',
      verificationStatus: 'unverified',
      credentialLink: '',
      selectedCredentials: []
    }
    setVolunteerWorks(prev => {
      const arr = [...prev, newItem]
      dispatch(
        updateSection({
          sectionId: 'volunteerWork',
          content: { items: arr }
        })
      )
      return arr
    })
    setUseDuration(prev => [...prev, false])

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
      setVolunteerWorks(prev => {
        const arr = prev.filter((_, i) => i !== index)
        dispatch(
          updateSection({
            sectionId: 'volunteerWork',
            content: { items: arr }
          })
        )
        return arr
      })
      setUseDuration(prev => prev.filter((_, i) => i !== index))

      setExpandedItems(prev => {
        const newExp: Record<number, boolean> = {}
        volunteerWorks
          .filter((_, i) => i !== index)
          .forEach((_, i) => {
            newExp[i] = prev[i + (i >= index ? 1 : 0)] || false
          })
        return newExp
      })
    },
    [volunteerWorks, dispatch, onDelete]
  )

  const toggleExpanded = useCallback((i: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [i]: !prev[i]
    }))
  }, [])

  const handleOpenCredentialsOverlay = useCallback((i: number) => {
    setActiveSectionIndex(i)
    setShowCredentialsOverlay(true)
  }, [])

  const handleCredentialSelect = useCallback(
    (ids: string[]) => {
      if (activeSectionIndex !== null && ids.length > 0) {
        const selected = ids.map(id => {
          const c = vcs.find((r: any) => (r?.originalItem?.id || r.id) === id)
          return {
            id,
            url: `https://linkedcreds.allskillscount.org/view/${id}`,
            name:
              c?.credentialSubject?.achievement?.[0]?.name ||
              `Credential ${id.substring(0, 5)}...`
          }
        })
        setVolunteerWorks(prev => {
          const updated = [...prev]
          updated[activeSectionIndex] = {
            ...updated[activeSectionIndex],
            verificationStatus: 'verified',
            credentialLink: selected[0].url,
            selectedCredentials: selected
          }
          dispatch(
            updateSection({
              sectionId: 'volunteerWork',
              content: { items: updated }
            })
          )
          return updated
        })
      }
      setShowCredentialsOverlay(false)
      setActiveSectionIndex(null)
    },
    [activeSectionIndex, dispatch, vcs]
  )

  const handleRemoveCredential = useCallback(
    (volIndex: number, credIndex: number) => {
      setVolunteerWorks(prev => {
        const updated = [...prev]
        const vol = { ...updated[volIndex] }
        const newCreds = vol.selectedCredentials.filter((_, i) => i !== credIndex)
        vol.selectedCredentials = newCreds
        if (!newCreds.length) {
          vol.verificationStatus = 'unverified'
          vol.credentialLink = ''
        } else {
          vol.credentialLink = newCreds[0].url
        }
        updated[volIndex] = vol
        dispatch(
          updateSection({
            sectionId: 'volunteerWork',
            content: { items: updated }
          })
        )
        return updated
      })
    },
    [dispatch]
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
          key={`volunteer-${index}`}
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
                    checked={useDuration[index]}
                    onChange={() => {
                      setUseDuration(prev => {
                        const arr = [...prev]
                        arr[index] = !arr[index]
                        setVolunteerWorks(pV => {
                          const up = [...pV]
                          if (!arr[index]) {
                            up[index] = {
                              ...up[index],
                              duration: ''
                            }
                          } else {
                            up[index] = {
                              ...up[index],
                              startDate: '',
                              endDate: '',
                              currentlyVolunteering: false
                            }
                          }
                          debouncedReduxUpdate(up)
                          return up
                        })
                        return arr
                      })
                    }}
                    sx={{ color: '#34C759' }}
                  />
                  <Typography>Show duration instead of exact dates</Typography>
                </Box>
              </Box>

              {useDuration[index] ? (
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
                    sx={{
                      bgcolor: '#FFF',
                      width: '50%',
                      '& .MuiInputLabel-root': {
                        transform: 'translate(14px, -9px) scale(0.75)'
                      }
                    }}
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
                    sx={{
                      bgcolor: '#FFF',
                      width: '50%',
                      '& .MuiInputLabel-root': {
                        transform: 'translate(14px, -9px) scale(0.75)'
                      }
                    }}
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

              {volunteer.selectedCredentials.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
                    Verified Credentials:
                  </Typography>
                  {volunteer.selectedCredentials.map((credential, credIndex) => (
                    <Box
                      key={`credential-${credential.id}-${credIndex}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 0.5,
                        backgroundColor: '#f5f5f5',
                        p: 0.5,
                        borderRadius: 1
                      }}
                    >
                      <Typography
                        variant='body2'
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(credential.url, '_blank')}
                      >
                        {credential.name || `Credential ${credIndex + 1}`}
                      </Typography>
                      <IconButton
                        size='small'
                        onClick={e => {
                          e.stopPropagation()
                          handleRemoveCredential(index, credIndex)
                        }}
                        sx={{
                          p: 0.5,
                          color: 'grey.500',
                          '&:hover': {
                            color: 'error.main'
                          }
                        }}
                      >
                        <CloseIcon fontSize='small' />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

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
                  startIcon={<SVGAddFiles />}
                  onClick={() => onAddFiles && onAddFiles(index)}
                >
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
          initialSelectedCredentials={
            activeSectionIndex !== null
              ? volunteerWorks[activeSectionIndex].selectedCredentials
              : []
          }
        />
      )}
    </Box>
  )
}
