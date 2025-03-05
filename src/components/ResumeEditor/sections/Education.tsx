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
  FormGroup,
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

interface EducationProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
  selectedCredentials?: string[]
}

export default function Education({
  onAddFiles,
  onDelete,
  onAddCredential
}: EducationProps) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const reduxUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)
  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)

  const [educations, setEducations] = useState<Education[]>([
    {
      type: 'Bachelors',
      programName: '',
      institution: '',
      duration: '1 year',
      showDuration: false,
      currentlyEnrolled: false,
      inProgress: false,
      awardEarned: false,
      description: '',
      id: '',
      verificationStatus: 'unverified',
      credentialLink: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    }
  ])

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({
    0: true
  })

  const debouncedReduxUpdate = useCallback(
    (items: Education[]) => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
      reduxUpdateTimeoutRef.current = setTimeout(() => {
        dispatch(
          updateSection({
            sectionId: 'education',
            content: {
              items: items
            }
          })
        )
      }, 500)
    },
    [dispatch]
  )

  const calculateDuration = (
    startDate: string,
    endDate: string | undefined,
    currentlyEnrolled: boolean
  ): string => {
    if (!startDate) return '1 year'

    const endDateObj = currentlyEnrolled || !endDate ? new Date() : new Date(endDate)
    const startDateObj = new Date(startDate)

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return '1 year'
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

  // Load existing education from Redux
  useEffect(() => {
    if (resume?.education?.items && resume.education.items.length > 0) {
      const typedItems = resume.education.items.map((item: any) => ({
        type: item.type || 'Bachelors',
        programName: item.programName || '',
        institution: item.institution || '',
        duration: item.duration || '1 year',
        showDuration:
          item.showDuration === undefined ? false : Boolean(item.showDuration),
        currentlyEnrolled: Boolean(item.currentlyEnrolled),
        inProgress: Boolean(item.inProgress),
        awardEarned: Boolean(item.awardEarned),
        description: item.description || '',
        id: item.id || '',
        verificationStatus: item.verificationStatus || 'unverified',
        credentialLink: item.credentialLink || '',
        selectedCredentials: item.selectedCredentials || [],
        endDate: item.endDate || '',
        ...item
      }))

      const shouldUpdate =
        initialLoadRef.current || typedItems.length !== educations.length

      if (shouldUpdate) {
        initialLoadRef.current = false

        setEducations(typedItems)
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
    educations.forEach((education, index) => {
      if (education.showDuration && education.startDate) {
        const calculatedDuration = calculateDuration(
          education.startDate,
          education.endDate,
          education.currentlyEnrolled
        )

        if (calculatedDuration && calculatedDuration !== education.duration) {
          setEducations(prev => {
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
                sectionId: 'education',
                content: {
                  items: educations.map((edu, i) =>
                    i === index ? { ...edu, duration: calculatedDuration } : edu
                  )
                }
              })
            )
          }, 1000)
        }
      }
    })
  }, [
    educations
      .map(
        edu =>
          `${edu.startDate}-${edu.endDate}-${edu.currentlyEnrolled}-${edu.showDuration}`
      )
      .join('|')
  ])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
    }
  }, [])

  const handleEducationChange = useCallback(
    (index: number, field: string, value: any) => {
      setEducations(prevEducations => {
        const updatedEducations = [...prevEducations]
        updatedEducations[index] = {
          ...updatedEducations[index],
          [field]: value
        }

        if (field === 'showDuration' && value === true) {
          const edu = updatedEducations[index]
          if (edu.startDate) {
            updatedEducations[index].duration = calculateDuration(
              edu.startDate,
              edu.endDate,
              edu.currentlyEnrolled
            )
          }
        }

        if (field !== 'description') {
          debouncedReduxUpdate(updatedEducations)
        }

        return updatedEducations
      })
    },
    [debouncedReduxUpdate]
  )

  const handleDescriptionChange = useCallback(
    (index: number, value: string) => {
      setEducations(prevEducations => {
        const updatedEducations = [...prevEducations]
        updatedEducations[index] = {
          ...updatedEducations[index],
          description: value
        }
        if (reduxUpdateTimeoutRef.current) {
          clearTimeout(reduxUpdateTimeoutRef.current)
        }

        reduxUpdateTimeoutRef.current = setTimeout(() => {
          dispatch(
            updateSection({
              sectionId: 'education',
              content: {
                items: updatedEducations
              }
            })
          )
        }, 1000)

        return updatedEducations
      })
    },
    [dispatch]
  )

  const handleAddAnotherItem = useCallback(() => {
    const emptyItem: Education = {
      type: 'Masters',
      programName: '',
      institution: '',
      duration: '1 year',
      showDuration: false,
      currentlyEnrolled: false,
      inProgress: false,
      awardEarned: false,
      description: '',
      id: '',
      verificationStatus: 'unverified',
      credentialLink: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    }

    setEducations(prevEducations => {
      const updatedEducations = [...prevEducations, emptyItem]

      dispatch(
        updateSection({
          sectionId: 'education',
          content: {
            items: updatedEducations
          }
        })
      )

      return updatedEducations
    })

    const newIndex = educations.length
    setExpandedItems(prev => ({
      ...prev,
      [newIndex]: true
    }))
  }, [educations.length, dispatch])

  const handleDeleteEducation = useCallback(
    (index: number) => {
      if (educations.length <= 1) {
        if (onDelete) onDelete()
        return
      }

      setEducations(prevEducations => {
        const updatedEducations = prevEducations.filter((_, i) => i !== index)
        dispatch(
          updateSection({
            sectionId: 'education',
            content: {
              items: updatedEducations
            }
          })
        )

        return updatedEducations
      })

      setExpandedItems(prev => {
        const newExpandedState: Record<number, boolean> = {}
        educations
          .filter((_, i) => i !== index)
          .forEach((_, i) => {
            if (i === 0 && educations.length - 1 === 1) {
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
    [educations, dispatch, onDelete]
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
        const credentialLinks = selectedCredentials.map(
          credentialId => `https://linkedcreds.allskillscount.org/view/${credentialId}`
        )

        setEducations(prevEducations => {
          const updatedEducations = [...prevEducations]
          updatedEducations[activeSectionIndex] = {
            ...updatedEducations[activeSectionIndex],
            verificationStatus: 'verified',
            credentialLink: credentialLinks[0],
            selectedCredentials: credentialLinks
          }

          dispatch(
            updateSection({
              sectionId: 'education',
              content: {
                items: updatedEducations
              }
            })
          )

          return updatedEducations
        })
      }

      setShowCredentialsOverlay(false)
      setActiveSectionIndex(null)
    },
    [activeSectionIndex, dispatch]
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {educations.map((education, index) => (
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
                  <Typography variant='body1'>Program:</Typography>
                  <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
                    {education.programName || 'Untitled Program'}
                  </Typography>
                </>
              ) : (
                <Box display='flex' alignItems='center'>
                  <Typography variant='body1'>Program Details</Typography>
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
                placeholder='Type of Education (Masters, Bachelors, etc.)'
                value={education.type}
                onChange={e => handleEducationChange(index, 'type', e.target.value)}
                variant='outlined'
              />

              <Typography>Program or Course Name</Typography>
              <TextField
                sx={{ bgcolor: '#FFF' }}
                size='small'
                fullWidth
                placeholder='Enter program name'
                value={education.programName}
                onChange={e =>
                  handleEducationChange(index, 'programName', e.target.value)
                }
              />

              <Typography>Institution or Organization Name</Typography>
              <TextField
                sx={{ bgcolor: '#FFF' }}
                size='small'
                fullWidth
                placeholder='Enter institution name'
                value={education.institution}
                onChange={e =>
                  handleEducationChange(index, 'institution', e.target.value)
                }
              />

              <Box display='flex' alignItems='start' flexDirection='column'>
                <Typography variant='body1'>Dates</Typography>
                <Box display='flex' alignItems='center'>
                  <PinkSwitch
                    checked={education.showDuration}
                    onChange={e =>
                      handleEducationChange(index, 'showDuration', e.target.checked)
                    }
                    sx={{ color: '#34C759' }}
                  />
                  <Typography>Show duration instead of exact dates</Typography>
                </Box>
              </Box>

              {education.showDuration ? (
                <TextField
                  sx={{ bgcolor: '#FFF' }}
                  size='small'
                  placeholder='Enter total duration (e.g., 4 years)'
                  value={education.duration}
                  onChange={e => handleEducationChange(index, 'duration', e.target.value)}
                  variant='outlined'
                  fullWidth
                />
              ) : (
                <Box display='flex' alignItems='center' gap={2}>
                  <TextField
                    sx={{ bgcolor: '#FFF', width: '50%' }}
                    size='small'
                    label='Start Date'
                    type='date'
                    value={education.startDate}
                    onChange={e =>
                      handleEducationChange(index, 'startDate', e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  {!education.currentlyEnrolled && (
                    <TextField
                      sx={{ bgcolor: '#FFF', width: '50%' }}
                      size='small'
                      label='End Date'
                      type='date'
                      value={education.endDate}
                      onChange={e =>
                        handleEducationChange(index, 'endDate', e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  )}
                </Box>
              )}

              <FormGroup row sx={{ gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={education.currentlyEnrolled}
                      onChange={e =>
                        handleEducationChange(
                          index,
                          'currentlyEnrolled',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label='Currently enrolled here'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={education.inProgress}
                      onChange={e =>
                        handleEducationChange(index, 'inProgress', e.target.checked)
                      }
                    />
                  }
                  label='In progress'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={education.awardEarned}
                      onChange={e =>
                        handleEducationChange(index, 'awardEarned', e.target.checked)
                      }
                    />
                  }
                  label='Award earned'
                />
              </FormGroup>

              <Typography variant='body1'>
                Describe how this item relates to the job you want to get:
              </Typography>
              <TextEditor
                key={`editor-${index}`}
                value={education.description || ''}
                onChange={val => handleDescriptionChange(index, val)}
                onAddCredential={onAddCredential}
              />
              {education.selectedCredentials &&
                education.selectedCredentials.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
                      Verified Credentials:
                    </Typography>
                    {education.selectedCredentials.map((link: any, linkIndex: any) => (
                      <Typography
                        key={linkIndex}
                        variant='body2'
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          mb: 0.5
                        }}
                        onClick={() => window.open(link, '_blank')}
                      >
                        Credential {linkIndex + 1}
                      </Typography>
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
                  onClick={() => handleDeleteEducation(index)}
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
          onClick={() => handleOpenCredentialsOverlay(educations.length - 1)}
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
        />
      )}
    </Box>
  )
}
