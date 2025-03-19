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

interface WorkExperienceProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

interface WorkExperienceItem {
  title: string
  company: string
  duration: string
  currentlyEmployed: boolean
  description: string
  showDuration: boolean
  position: string
  startDate: string
  endDate: string
  achievements: string[]
  id: string
  verificationStatus: string
  credentialLink: string
  selectedCredentials: SelectedCredential[]
}

interface SelectedCredential {
  id: string
  url: string
  name: string
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export default function WorkExperience({
  onAddFiles,
  onDelete,
  onAddCredential
}: Readonly<WorkExperienceProps>) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const reduxUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)
  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)
  const vcs = useSelector((state: any) => state.vcReducer.vcs)

  const [workExperiences, setWorkExperiences] = useState<WorkExperienceItem[]>([
    {
      title: '',
      company: '',
      duration: '',
      currentlyEmployed: false,
      description: '',
      showDuration: true,
      position: '',
      startDate: '',
      endDate: '',
      achievements: [],
      id: '',
      verificationStatus: 'unverified',
      credentialLink: '',
      selectedCredentials: []
    }
  ])
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({
    0: true
  })

  const debouncedReduxUpdate = useCallback(
    (items: WorkExperienceItem[]) => {
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
        endDate: item.endDate || '',
        achievements: item.achievements || [],
        id: item?.originalItem?.id || '',
        verificationStatus: item.verificationStatus || 'unverified',
        credentialLink: item.credentialLink || '',
        selectedCredentials: item.selectedCredentials || [],
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

  const calculateDuration = (
    startDate: string,
    endDate: string | undefined,
    currentlyEmployed: boolean
  ): string => {
    if (!startDate) return ''
    const endDateObj = currentlyEmployed || !endDate ? new Date() : new Date(endDate)
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

  const dateChangeString = workExperiences
    .map(
      exp =>
        `${exp.startDate}-${exp.endDate}-${exp.currentlyEmployed}-${exp.showDuration}`
    )
    .join('|')

  useEffect(() => {
    workExperiences.forEach((experience, index) => {
      if (experience.showDuration && experience.startDate) {
        const calculatedDuration = calculateDuration(
          experience.startDate,
          experience.endDate,
          experience.currentlyEmployed
        )

        if (calculatedDuration && calculatedDuration !== experience.duration) {
          setWorkExperiences(prev => {
            const updated = [...prev]
            updated[index] = {
              ...updated[index],
              duration: calculatedDuration
            }
            return updated
          })
          if (reduxUpdateTimeoutRef.current) {
            clearTimeout(reduxUpdateTimeoutRef.current)
          }

          reduxUpdateTimeoutRef.current = setTimeout(() => {
            dispatch(
              updateSection({
                sectionId: 'experience',
                content: {
                  items: workExperiences.map((exp, i) =>
                    i === index ? { ...exp, duration: calculatedDuration } : exp
                  )
                }
              })
            )
          }, 1000)
        }
      }
    })
  }, [dateChangeString, dispatch, workExperiences])

  const handleWorkExperienceChange = useCallback(
    (index: number, field: string, value: any) => {
      setWorkExperiences(prevExperiences => {
        const updatedExperiences = [...prevExperiences]
        updatedExperiences[index] = {
          ...updatedExperiences[index],
          [field]: value
        }
        if (field === 'showDuration' && value === true) {
          const exp = updatedExperiences[index]
          if (exp.startDate) {
            updatedExperiences[index].duration = calculateDuration(
              exp.startDate,
              exp.endDate,
              exp.currentlyEmployed
            )
          }
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
    const emptyItem: WorkExperienceItem = {
      title: '',
      company: '',
      duration: '',
      currentlyEmployed: false,
      description: '',
      showDuration: true,
      position: '',
      startDate: '',
      endDate: '',
      achievements: [],
      id: '',
      verificationStatus: 'unverified',
      credentialLink: '',
      selectedCredentials: []
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
          .filter((_, i: number) => i !== index)
          .forEach((_, i: number) => {
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
    (selectedCredentialIDs: string[]) => {
      if (activeSectionIndex !== null && selectedCredentialIDs.length > 0) {
        const selectedCredentials = selectedCredentialIDs.map(id => {
          const credential = vcs.find((c: any) => (c?.originalItem?.id || c.id) === id)

          return {
            id: id,
            url: `https://linkedcreds.allskillscount.org/view/${id}`,
            name:
              credential?.credentialSubject?.achievement[0]?.name ||
              `Credential ${id.substring(0, 5)}...`
          }
        })

        setWorkExperiences(prevExperiences => {
          const updatedExperiences = [...prevExperiences]
          updatedExperiences[activeSectionIndex] = {
            ...updatedExperiences[activeSectionIndex],
            verificationStatus: 'verified',
            credentialLink: selectedCredentials[0].url,
            selectedCredentials: selectedCredentials
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
    [activeSectionIndex, dispatch, vcs]
  )

  const handleRemoveCredential = useCallback(
    (experienceIndex: number, credentialIndex: number) => {
      setWorkExperiences(prevExperiences => {
        const updatedExperiences = [...prevExperiences]
        const experience = { ...updatedExperiences[experienceIndex] }
        const updatedCredentials = (experience.selectedCredentials || []).filter(
          (_, i) => i !== credentialIndex
        )

        experience.selectedCredentials = updatedCredentials
        if (updatedCredentials.length === 0) {
          experience.verificationStatus = 'unverified'
          experience.credentialLink = ''
        } else {
          experience.credentialLink = updatedCredentials[0]?.url || ''
        }

        updatedExperiences[experienceIndex] = experience

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
    },
    [dispatch]
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {workExperiences.map((experience, index) => (
        <Box
          key={`experience-${index}`}
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

              {experience.showDuration ? (
                <TextField
                  sx={{ bgcolor: '#FFF' }}
                  size='small'
                  placeholder='Enter total duration (e.g., 2 years)'
                  value={experience.duration}
                  onChange={e =>
                    handleWorkExperienceChange(index, 'duration', e.target.value)
                  }
                  variant='outlined'
                  fullWidth
                />
              ) : (
                <Box display='flex' alignItems='center' gap={2}>
                  <TextField
                    sx={{
                      bgcolor: '#FFF',
                      width: '50%',
                      '& .MuiInputLabel-root': {
                        transform: 'translate(14px, -9px) scale(0.75)'
                      }
                    }}
                    size='small'
                    label='Start Date'
                    type='date'
                    value={experience.startDate}
                    onChange={e =>
                      handleWorkExperienceChange(index, 'startDate', e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  {!experience.currentlyEmployed && (
                    <TextField
                      sx={{
                        bgcolor: '#FFF',
                        width: '50%',
                        '& .MuiInputLabel-root': {
                          transform: 'translate(14px, -9px) scale(0.75)'
                        }
                      }}
                      size='small'
                      label='End Date'
                      type='date'
                      value={experience.endDate}
                      onChange={e =>
                        handleWorkExperienceChange(index, 'endDate', e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  )}
                </Box>
              )}

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

              <Typography
                variant='body1'
                sx={{
                  fontFamily: 'Nunito Sans',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: 'normal',
                  letterSpacing: '0.16px'
                }}
              >
                Describe your role at this company:
              </Typography>
              <TextEditor
                key={`editor-${index}`}
                value={experience.description || ''}
                onChange={val => handleDescriptionChange(index, val)}
                onAddCredential={onAddCredential}
              />
              {experience.selectedCredentials &&
                experience.selectedCredentials.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
                      Verified Credentials:
                    </Typography>
                    {experience.selectedCredentials.map((credential, credIndex) => (
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
          initialSelectedCredentials={
            activeSectionIndex !== null &&
            workExperiences[activeSectionIndex]?.selectedCredentials
              ? workExperiences[activeSectionIndex].selectedCredentials
              : []
          }
        />
      )}
    </Box>
  )
}
