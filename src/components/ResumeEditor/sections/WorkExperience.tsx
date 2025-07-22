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
  IconButton,
  Dialog,
  DialogContent
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
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MinimalCredentialViewer from '../../MinimalCredentialViewer'
import VerifiedCredentialsList from '../../common/VerifiedCredentialsList'
import VerifiedIcon from '@mui/icons-material/Verified'

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
  onAddFiles?: (itemIndex?: number) => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
  onFocus?: () => void
  evidence?: string[][]
  allFiles?: FileItem[]
  onRemoveFile?: (sectionId: string, itemIndex: number, fileIndex: number) => void
}

interface SelectedCredential {
  id: string
  url: string
  name: string
  vc?: any // full object
  fileId?: string
}

interface FileItem {
  id: string
  file: File
  name: string
  url: string
  uploaded: boolean
  fileExtension: string
  googleId?: string
}

interface WorkExperienceItem {
  title: string
  company: string
  position: string
  duration: string
  showDuration: boolean
  startDate: string
  endDate: string
  currentlyEmployed: boolean
  description: string
  achievements: string[]
  id: string // Unique identifier for each work experience item
  verificationStatus: string
  credentialLink: string // always a string
  selectedCredentials: SelectedCredential[]
}

export default function WorkExperience({
  onAddFiles,
  onDelete,
  onAddCredential,
  onFocus,
  evidence = [],
  allFiles = [],
  onRemoveFile
}: Readonly<WorkExperienceProps>) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const vcs = useSelector((state: any) => state.vcReducer.vcs)
  const reduxUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)

  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [openCredDialog, setOpenCredDialog] = useState(false)
  const [dialogCredObj, setDialogCredObj] = useState<any>(null)

  // Generate initial unique ID
  const initialId = `work-exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  const [workExperiences, setWorkExperiences] = useState<WorkExperienceItem[]>([
    {
      title: '',
      company: '',
      position: '',
      duration: '',
      showDuration: true,
      startDate: '',
      endDate: '',
      currentlyEmployed: false,
      description: '',
      achievements: [],
      id: initialId,
      verificationStatus: 'unverified',
      credentialLink: '',
      selectedCredentials: []
    }
  ])

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({
    0: true
  })

  // Local toggle to show/hide duration vs start/end date
  const [useDuration, setUseDuration] = useState<boolean[]>([true])

  const debouncedReduxUpdate = useCallback(
    (items: WorkExperienceItem[]) => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
      reduxUpdateTimeoutRef.current = setTimeout(() => {
        console.log('Debounced Redux update with items:', items.map(item => ({
          id: item.id,
          title: item.title,
          hasCredentials: item.selectedCredentials.length > 0
        })))
        dispatch(
          updateSection({
            sectionId: 'experience',
            content: { items }
          })
        )
      }, 500)
    },
    [dispatch]
  )

  const calculateDuration = (
    startDate: string,
    endDate: string | undefined,
    currentlyEmployed: boolean
  ): string => {
    if (!startDate) return ''
    const end = currentlyEmployed || !endDate ? new Date() : new Date(endDate)
    const start = new Date(startDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return ''
    }
    let years = end.getFullYear() - start.getFullYear()
    let months = end.getMonth() - start.getMonth()
    if (months < 0) {
      years--
      months += 12
    }
    let result = ''
    if (years > 0) {
      result += `${years} year${years !== 1 ? 's' : ''}`
    }
    if (months > 0 || (years === 0 && months >= 0)) {
      if (result) result += ' '
      result += `${months} month${months !== 1 ? 's' : ''}`
    }
    return result || 'Less than a month'
  }

  const dateChangeString = workExperiences
    .map(
      (exp, i) =>
        `${exp.startDate}-${exp.endDate}-${exp.currentlyEmployed}-${useDuration[i]}`
    )
    .join('|')

  useEffect(() => {
    workExperiences.forEach((exp, i) => {
      if (useDuration[i] && exp.startDate) {
        const calc = calculateDuration(exp.startDate, exp.endDate, exp.currentlyEmployed)
        if (calc && calc !== exp.duration) {
          setWorkExperiences(prev => {
            const updated = [...prev]
            updated[i] = { ...updated[i], duration: calc }
            return updated
          })
          if (reduxUpdateTimeoutRef.current) clearTimeout(reduxUpdateTimeoutRef.current)
          reduxUpdateTimeoutRef.current = setTimeout(() => {
            dispatch(
              updateSection({
                sectionId: 'experience',
                content: {
                  items: workExperiences.map((item, idx) =>
                    idx === i ? { ...item, duration: calc } : item
                  )
                }
              })
            )
          }, 1000)
        }
      }
    })
  }, [dateChangeString, dispatch, workExperiences, useDuration])

  useEffect(() => {
    // Skip updates while credentials overlay is open to prevent data shifting
    if (showCredentialsOverlay) {
      console.log('Skipping Redux update - credentials overlay is open')
      return
    }
    
    // Also skip if we're in the middle of a credential update
    if (activeSectionIndex !== null) {
      console.log('Skipping Redux update - credential attachment in progress')
      return
    }
    
    if (resume?.experience?.items && resume.experience.items.length > 0) {
      console.log('Loading experience items from Redux:', resume.experience.items)
      
      const typedItems = resume.experience.items.map((item: any, idx: number) => {
        // Ensure each item has a unique ID
        const itemId = item.id || `work-exp-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`
        
        // Parse credentialLink if it exists and selectedCredentials is empty
        let selectedCredentials = item.selectedCredentials || []
        if (item.credentialLink && selectedCredentials.length === 0) {
          try {
            // credentialLink is a JSON string of an array of strings
            const credLinksArray = JSON.parse(item.credentialLink)
            if (Array.isArray(credLinksArray)) {
              selectedCredentials = credLinksArray.map((credLink: string) => {
                // Each credLink is "fileId,{vc json}"
                const commaIndex = credLink.indexOf(',')
                if (commaIndex > -1) {
                  const fileId = credLink.substring(0, commaIndex)
                  const vcJson = credLink.substring(commaIndex + 1)
                  try {
                    const vc = JSON.parse(vcJson)
                    return {
                      id: vc?.originalItem?.id || vc?.id || fileId,
                      url: '',
                      name: vc?.credentialSubject?.achievement?.[0]?.name || `Credential`,
                      vc: vc,
                      fileId: fileId
                    }
                  } catch (e) {
                    console.error('Error parsing VC JSON:', e)
                    return null
                  }
                }
                return null
              }).filter(Boolean)
            }
          } catch (e) {
            console.error('Error parsing credentialLink:', e, 'for item:', item.title)
          }
        }
        
        return {
          title: item.title || '',
          company: item.company || '',
          position: item.position || '',
          duration: item.duration || '',
          showDuration: !!item.currentlyEmployed,
          startDate: item.startDate || '',
          endDate: item.endDate || '',
          currentlyEmployed: !!item.currentlyEmployed,
          description: item.description || '',
          achievements: item.achievements || [],
          id: itemId,
          verificationStatus: item.verificationStatus || 'unverified',
          credentialLink: item.credentialLink || '',
          selectedCredentials: selectedCredentials,
          ...item
        }
      }) as WorkExperienceItem[]
      
      console.log('Typed items with credentials:', typedItems.map(item => ({
        id: item.id,
        title: item.title,
        credentialLink: item.credentialLink,
        hasCredentials: item.selectedCredentials.length > 0
      })))

      const needUpdate =
        initialLoadRef.current || typedItems.length !== workExperiences.length
      if (needUpdate) {
        initialLoadRef.current = false
        setWorkExperiences(typedItems)
        const toggles = typedItems.map(t => !!(!t.startDate && !t.endDate))
        setUseDuration(toggles)
        if (typedItems.length !== Object.keys(expandedItems).length) {
          const initExp: Record<number, boolean> = {}
          typedItems.forEach((_, idx) => {
            initExp[idx] =
              idx < Object.keys(expandedItems).length ? expandedItems[idx] : true
          })
          setExpandedItems(initExp)
        }
      }
    }
    return () => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume, showCredentialsOverlay, activeSectionIndex]) // Added showCredentialsOverlay and activeSectionIndex to dependencies

  const handleWorkExperienceChange = useCallback(
    (index: number, field: string, val: any) => {
      setWorkExperiences(prev => {
        const updated = [...prev]
        const item = { ...updated[index], [field]: val }
        if (!useDuration[index]) {
          item.duration = ''
        } else if (field === 'startDate' || field === 'endDate') {
          item.duration = calculateDuration(
            item.startDate,
            item.endDate,
            item.currentlyEmployed
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
    (index: number, value: string) => {
      setWorkExperiences(prev => {
        const updated = [...prev]
        updated[index] = { ...updated[index], description: value }
        if (reduxUpdateTimeoutRef.current) clearTimeout(reduxUpdateTimeoutRef.current)
        reduxUpdateTimeoutRef.current = setTimeout(() => {
          dispatch(
            updateSection({
              sectionId: 'experience',
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
    // Ensure unique ID with timestamp and random string
    const uniqueId = `work-exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const emptyItem: WorkExperienceItem = {
      title: '',
      company: '',
      position: '',
      duration: '',
      showDuration: true,
      startDate: '',
      endDate: '',
      currentlyEmployed: false,
      description: '',
      achievements: [],
      id: uniqueId,
      verificationStatus: 'unverified',
      credentialLink: '',
      selectedCredentials: []
    }
    setWorkExperiences(prev => {
      const arr = [...prev, emptyItem]
      dispatch(
        updateSection({
          sectionId: 'experience',
          content: { items: arr }
        })
      )
      return arr
    })
    setUseDuration(prev => [...prev, true])

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
      setWorkExperiences(prev => {
        const updated = prev.filter((_, i) => i !== index)
        dispatch(
          updateSection({
            sectionId: 'experience',
            content: { items: updated }
          })
        )
        return updated
      })
      setUseDuration(prev => prev.filter((_, i) => i !== index))

      setExpandedItems(prev => {
        const newExpanded: Record<number, boolean> = {}
        workExperiences
          .filter((_, i) => i !== index)
          .forEach((_, i) => {
            newExpanded[i] = prev[i + (i >= index ? 1 : 0)] || false
          })
        return newExpanded
      })
    },
    [workExperiences, dispatch, onDelete]
  )

  const toggleExpanded = useCallback((i: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [i]: !prev[i]
    }))
  }, [])

  const handleOpenCredentialsOverlay = useCallback((i: number, itemId: string) => {
    console.log('Opening credentials overlay for index:', i, 'itemId:', itemId)
    setActiveSectionIndex(i)
    setActiveItemId(itemId)
    setShowCredentialsOverlay(true)
    // Prevent focus from changing while overlay is open
    if (onFocus) {
      onFocus()
    }
  }, [onFocus])

  const handleCredentialSelect = useCallback(
    (selectedCredentialIDs: string[]) => {
      console.log('handleCredentialSelect called with:', {
        selectedCredentialIDs,
        activeSectionIndex,
        activeItemId,
        vcsLength: vcs?.length
      })
      
      if (activeSectionIndex !== null && activeItemId !== null && selectedCredentialIDs.length > 0 && vcs) {
        // Cancel any pending debounced updates before credential attachment
        if (reduxUpdateTimeoutRef.current) {
          clearTimeout(reduxUpdateTimeoutRef.current)
          reduxUpdateTimeoutRef.current = null
        }
        const selectedCredentials = selectedCredentialIDs.map(id => {
          const credential = vcs?.find((c: any) => (c?.originalItem?.id || c.id) === id)
          console.log('Found credential for id', id, ':', credential)
          
          let fileId = ''
          if (credential && credential.id && typeof credential.id === 'string') {
            fileId = credential.id.startsWith('urn:') ? '' : credential.id
          }
          return {
            id: id,
            url: '',
            name:
              credential?.credentialSubject?.achievement?.[0]?.name ||
              `Credential ${id.substring(0, 5)}...`,
            vc: credential,
            fileId: fileId
          }
        })
        // Deduplicate by id
        const deduped: SelectedCredential[] = Array.from(
          new Map(selectedCredentials.map(c => [c.id, c])).values()
        )
        // Build credentialLink as a JSON stringified array
        const credLinks = deduped
          .map(cred => {
            const fileId = cred.fileId || cred.id
            return fileId && cred.vc ? `${fileId},${JSON.stringify(cred.vc)}` : ''
          })
          .filter(Boolean)
          
        console.log('Saving credential:', {
          activeSectionIndex,
          activeItemId,
          credLinks,
          stringified: JSON.stringify(credLinks),
          deduped
        })
        
        setWorkExperiences(prev => {
          const updated = [...prev]
          
          // Find the item by ID instead of index to handle array reordering
          const targetIndex = updated.findIndex(item => item.id === activeItemId)
          if (targetIndex === -1) {
            console.error('Target item not found with ID:', activeItemId)
            return prev
          }
          
          const targetItem = updated[targetIndex]
          console.log('Found target item at index:', targetIndex, 'with ID:', targetItem.id)
          
          // Verify the index hasn't changed
          if (targetIndex !== activeSectionIndex) {
            console.warn('Item moved from index', activeSectionIndex, 'to', targetIndex)
          }
          
          updated[targetIndex] = {
            ...targetItem,
            verificationStatus: 'verified',
            credentialLink: JSON.stringify(credLinks), // always a stringified array
            selectedCredentials: deduped
          }
          
          console.log('Updated work experience:', updated[targetIndex])
          console.log('Redux update with credentialLink:', {
            itemId: updated[targetIndex].id,
            credentialLink: updated[targetIndex].credentialLink,
            type: typeof updated[targetIndex].credentialLink
          })
          
          // Dispatch immediately for credential updates (no debouncing)
          dispatch(
            updateSection({
              sectionId: 'experience',
              content: { items: updated }
            })
          )
          return updated
        })
      } else {
        console.log('Not saving credential - missing data:', {
          activeSectionIndex,
          activeItemId,
          selectedCredentialIDsLength: selectedCredentialIDs.length
        })
      }
      setShowCredentialsOverlay(false)
      setActiveSectionIndex(null)
      setActiveItemId(null)
    },
    [activeSectionIndex, activeItemId, dispatch, vcs]
  )

  const handleRemoveCredential = useCallback(
    (expIndex: number, credIndex: number) => {
      setWorkExperiences(prev => {
        const updated = [...prev]
        const exp = { ...updated[expIndex] }
        const newCreds = exp.selectedCredentials.filter((_, i) => i !== credIndex)
        // Deduplicate by id
        exp.selectedCredentials = Array.from(
          new Map(newCreds.map(c => [c.id, c])).values()
        )
        if (!exp.selectedCredentials.length) {
          exp.verificationStatus = 'unverified'
          exp.credentialLink = ''
        } else {
          // Rebuild credentialLink in the same format as handleCredentialSelect
          const credLinks = exp.selectedCredentials
            .map(cred => {
              const fileId = cred.fileId || cred.id
              return fileId && cred.vc ? `${fileId},${JSON.stringify(cred.vc)}` : ''
            })
            .filter(Boolean)
          exp.credentialLink = JSON.stringify(credLinks)
        }
        updated[expIndex] = exp
        dispatch(
          updateSection({
            sectionId: 'experience',
            content: { items: updated }
          })
        )
        return updated
      })
    },
    [dispatch]
  )

  useEffect(() => {
    // Add event listener for opening credentials overlay
    const handleOpenCredentialsEvent = (event: CustomEvent) => {
      const { sectionId, itemIndex, selectedText } = event.detail
      if (sectionId === 'experience') {
        setActiveSectionIndex(itemIndex)
        setShowCredentialsOverlay(true)
      }
    }

    window.addEventListener(
      'openCredentialsOverlay',
      handleOpenCredentialsEvent as EventListener
    )

    return () => {
      window.removeEventListener(
        'openCredentialsOverlay',
        handleOpenCredentialsEvent as EventListener
      )
    }
  }, [])

  useEffect(() => {
    // Call onFocus when the component mounts
    if (onFocus) {
      onFocus()
    }
  }, []) // Remove onFocus from dependencies to prevent re-renders
  const handleRemoveFile = useCallback(
    (experienceIndex: number, fileIndex: number) => {
      if (onRemoveFile) {
        onRemoveFile('Work Experience', experienceIndex, fileIndex)
      }
    },
    [onRemoveFile]
  )

  function getCredentialName(claim: any): string {
    try {
      if (!claim || typeof claim !== 'object') {
        return 'Invalid Credential'
      }
      const credentialSubject = claim.credentialSubject
      if (!credentialSubject || typeof credentialSubject !== 'object') {
        return 'Unknown Credential'
      }
      if (credentialSubject.employeeName) {
        return `Performance Review: ${credentialSubject.employeeJobTitle || 'Unknown Position'}`
      }
      if (credentialSubject.volunteerWork) {
        return `Volunteer: ${credentialSubject.volunteerWork}`
      }
      if (credentialSubject.role) {
        return `Employment: ${credentialSubject.role}`
      }
      if (credentialSubject.credentialName) {
        return credentialSubject.credentialName
      }
      if (credentialSubject.achievement && credentialSubject.achievement[0]?.name) {
        return credentialSubject.achievement[0].name
      }
      return 'Credential'
    } catch {
      return 'Credential'
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {workExperiences.map((experience, index) => (
        <Box
          key={`experience-${experience.id || index}`}
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
                    checked={useDuration[index]}
                    onChange={() => {
                      setUseDuration(prev => {
                        const arr = [...prev]
                        arr[index] = !arr[index]
                        setWorkExperiences(p => {
                          const up = [...p]
                          if (!arr[index]) {
                            up[index] = { ...up[index], duration: '' }
                          } else {
                            up[index] = {
                              ...up[index],
                              startDate: '',
                              endDate: '',
                              currentlyEmployed: false
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
                key={`work-experience-editor-${experience.id}`}
                value={experience.description || ''}
                onChange={val => handleDescriptionChange(index, val)}
                onAddCredential={onAddCredential}
                onFocus={onFocus}
              />

              {Array.isArray(experience.selectedCredentials) &&
                experience.selectedCredentials.length > 0 && (
                  <VerifiedCredentialsList
                    credentials={experience.selectedCredentials}
                    onRemove={credIndex => handleRemoveCredential(index, credIndex)}
                  />
                )}

              {evidence[index] && evidence[index].length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
                    Attached Files:
                  </Typography>
                  {evidence[index].map((fileId, fileIndex) => {
                    const file = allFiles.find(f => f.id === fileId)
                    return (
                      <Box
                        key={`file-${fileId}-${fileIndex}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 0.5,
                          backgroundColor: '#e8f4f8',
                          p: 0.5,
                          borderRadius: 1
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AttachFileIcon fontSize='small' color='primary' />
                          <Typography
                            variant='body2'
                            sx={{
                              color: 'primary.main',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              if (file?.url) {
                                window.open(file.url, '_blank')
                              }
                            }}
                          >
                            {file?.name || `File ${fileIndex + 1}`}
                          </Typography>
                        </Box>
                        <IconButton
                          size='small'
                          onClick={e => {
                            e.stopPropagation()
                            handleRemoveFile(index, fileIndex)
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
                    )
                  })}
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
                  startIcon={<VerifiedIcon />}
                  onClick={() => handleOpenCredentialsOverlay(index, experience.id)}
                >
                  Add credential
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
            console.log('Closing credentials overlay')
            setShowCredentialsOverlay(false)
            setActiveSectionIndex(null)
            setActiveItemId(null)
          }}
          onSelect={(ids) => {
            console.log('CredentialOverlay onSelect called with:', ids)
            handleCredentialSelect(ids)
          }}
          initialSelectedCredentials={
            activeSectionIndex !== null
              ? workExperiences[activeSectionIndex].selectedCredentials
              : []
          }
        />
      )}
    </Box>
  )
}
