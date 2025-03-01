import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Switch,
  styled,
  alpha,
  Button,
  IconButton
} from '@mui/material'
import {
  SVGSectionIcon,
  SVGDownIcon,
  SVGAddFiles,
  SVGDeleteSection
} from '../../../assets/svgs'
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

// interface ProfessionalAffiliation {
//   name: string
//   organization: string
//   startDate: string
//   endDate: string
//   showDuration: boolean
//   activeAffiliation: boolean
//   id: string
//   verificationStatus: string
//   credentialLink: string
//   [key: string]: any
// }

interface ProfessionalAffiliationsProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
  selectedCredentials?: string[]
}

export default function ProfessionalAffiliations({
  onAddFiles,
  onDelete,
  onAddCredential
}: ProfessionalAffiliationsProps) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const reduxUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)
  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)

  const [affiliations, setAffiliations] = useState<ProfessionalAffiliation[]>([
    {
      name: '',
      organization: '',
      startDate: '',
      endDate: '',
      showDuration: false,
      activeAffiliation: false,
      id: '',
      verificationStatus: 'unverified',
      credentialLink: ''
    }
  ])

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({
    0: true
  })

  const debouncedReduxUpdate = useCallback(
    (items: ProfessionalAffiliation[]) => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
      reduxUpdateTimeoutRef.current = setTimeout(() => {
        dispatch(
          updateSection({
            sectionId: 'professionalAffiliations',
            content: {
              items: items
            }
          })
        )
      }, 500)
    },
    [dispatch]
  )

  // Load existing affiliations from Redux
  useEffect(() => {
    if (
      resume?.professionalAffiliations?.items &&
      resume.professionalAffiliations.items.length > 0
    ) {
      const typedItems = resume.professionalAffiliations.items.map((item: any) => ({
        name: item.name || '',
        organization: item.organization || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        showDuration:
          item.showDuration === undefined ? false : Boolean(item.showDuration),
        activeAffiliation: Boolean(item.activeAffiliation),
        id: item.id || '',
        verificationStatus: item.verificationStatus || 'unverified',
        credentialLink: item.credentialLink || '',
        ...item
      }))

      const shouldUpdate =
        initialLoadRef.current || typedItems.length !== affiliations.length

      if (shouldUpdate) {
        initialLoadRef.current = false

        setAffiliations(typedItems)
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
    }
  }, [])

  const handleAffiliationChange = useCallback(
    (index: number, field: string, value: any) => {
      setAffiliations(prevAffiliations => {
        const updatedAffiliations = [...prevAffiliations]
        updatedAffiliations[index] = {
          ...updatedAffiliations[index],
          [field]: value
        }
        if (field !== 'description') {
          debouncedReduxUpdate(updatedAffiliations)
        }

        return updatedAffiliations
      })
    },
    [debouncedReduxUpdate]
  )

  const handleAddAnotherItem = useCallback(() => {
    const emptyItem: ProfessionalAffiliation = {
      name: '',
      organization: '',
      startDate: '',
      endDate: '',
      showDuration: false,
      activeAffiliation: false,
      id: '',
      verificationStatus: 'unverified',
      credentialLink: ''
    }

    setAffiliations(prevAffiliations => {
      const updatedAffiliations = [...prevAffiliations, emptyItem]

      dispatch(
        updateSection({
          sectionId: 'professionalAffiliations',
          content: {
            items: updatedAffiliations
          }
        })
      )

      return updatedAffiliations
    })

    const newIndex = affiliations.length
    setExpandedItems(prev => ({
      ...prev,
      [newIndex]: true
    }))
  }, [affiliations.length, dispatch])

  const handleDeleteAffiliation = useCallback(
    (index: number) => {
      if (affiliations.length <= 1) {
        if (onDelete) onDelete()
        return
      }

      setAffiliations(prevAffiliations => {
        const updatedAffiliations = prevAffiliations.filter((_, i) => i !== index)
        dispatch(
          updateSection({
            sectionId: 'professionalAffiliations',
            content: {
              items: updatedAffiliations
            }
          })
        )

        return updatedAffiliations
      })

      setExpandedItems(prev => {
        const newExpandedState: Record<number, boolean> = {}
        affiliations
          .filter((_, i) => i !== index)
          .forEach((_, i) => {
            if (i === 0 && affiliations.length - 1 === 1) {
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
    [affiliations, dispatch, onDelete]
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
        setAffiliations(prevAffiliations => {
          const updatedAffiliations = [...prevAffiliations]
          updatedAffiliations[activeSectionIndex] = {
            ...updatedAffiliations[activeSectionIndex],
            verificationStatus: 'verified',
            credentialLink: credentialLinks[0],
            selectedCredentials: credentialLinks
          }

          dispatch(
            updateSection({
              sectionId: 'professionalAffiliations',
              content: {
                items: updatedAffiliations
              }
            })
          )

          return updatedAffiliations
        })
      }

      setShowCredentialsOverlay(false)
      setActiveSectionIndex(null)
    },
    [activeSectionIndex, dispatch]
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {affiliations.map((affiliation, index) => (
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
                  <Typography variant='body1'>Affiliation:</Typography>
                  <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
                    {affiliation.name || 'Untitled Affiliation'}
                  </Typography>
                </>
              ) : (
                <Box display='flex' alignItems='center'>
                  <Typography variant='body1'>Affiliation Details</Typography>
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
                placeholder='Member'
                label='Name'
                value={affiliation.name}
                onChange={e => handleAffiliationChange(index, 'name', e.target.value)}
              />

              <TextField
                sx={{ bgcolor: '#FFF' }}
                size='small'
                fullWidth
                placeholder='UXPA'
                label='Organization'
                value={affiliation.organization}
                onChange={e =>
                  handleAffiliationChange(index, 'organization', e.target.value)
                }
              />

              <Box display='flex' alignItems='center' justifyContent='space-between'>
                <Typography>Dates</Typography>
                <FormControlLabel
                  control={
                    <PinkSwitch
                      checked={affiliation.showDuration}
                      onChange={e =>
                        handleAffiliationChange(index, 'showDuration', e.target.checked)
                      }
                      sx={{ color: '#34C759' }}
                    />
                  }
                  label='Show duration instead of exact dates'
                />
              </Box>

              {!affiliation.showDuration ? (
                <Box display='flex' gap={2}>
                  <TextField
                    sx={{ bgcolor: '#FFF' }}
                    size='small'
                    type='date'
                    value={affiliation.startDate}
                    onChange={e =>
                      handleAffiliationChange(index, 'startDate', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    sx={{ bgcolor: '#FFF' }}
                    size='small'
                    type='date'
                    value={affiliation.endDate}
                    onChange={e =>
                      handleAffiliationChange(index, 'endDate', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              ) : (
                <TextField
                  sx={{ bgcolor: '#FFF' }}
                  size='small'
                  placeholder='Enter total duration'
                  value={`${affiliation.startDate} - ${affiliation.endDate}`}
                  disabled
                />
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={affiliation.activeAffiliation}
                    onChange={e =>
                      handleAffiliationChange(
                        index,
                        'activeAffiliation',
                        e.target.checked
                      )
                    }
                  />
                }
                label='Active affiliation'
              />

              {affiliation.selectedCredentials &&
                affiliation.selectedCredentials.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
                      Verified Credentials:
                    </Typography>
                    {affiliation.selectedCredentials.map((link: any, linkIndex: any) => (
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
                  onClick={() => handleDeleteAffiliation(index)}
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
          onClick={() => handleOpenCredentialsOverlay(affiliations.length - 1)}
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
