import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  Typography,
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
import { StyledButton } from './StyledButton'
import { useDispatch, useSelector } from 'react-redux'
import { updateSection } from '../../../redux/slices/resume'
import { RootState } from '../../../redux/store'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CredentialOverlay from '../../CredentialsOverlay'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

interface CertificationsAndLicensesProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
  initialData?: any
}

export default function CertificationsAndLicenses({
  onAddFiles,
  onDelete,
  onAddCredential,
  initialData
}: CertificationsAndLicensesProps) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const reduxUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)
  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      noExpiration: false,
      id: '',
      verificationStatus: 'unverified',
      credentialLink: ''
    }
  ])

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({
    0: true
  })

  const debouncedReduxUpdate = useCallback(
    (items: Certification[]) => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
      reduxUpdateTimeoutRef.current = setTimeout(() => {
        dispatch(
          updateSection({
            sectionId: 'certifications',
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
    if (resume?.certifications?.items && resume.certifications.items.length > 0) {
      const typedItems = resume.certifications.items.map((item: any) => ({
        name: item.name || '',
        issuer: item.issuer || '',
        issueDate: item.issueDate || '',
        expiryDate: item.expiryDate || '',
        credentialId: item.credentialId || '',
        noExpiration: Boolean(item.noExpiration),
        id: item.id || '',
        verificationStatus: item.verificationStatus || 'unverified',
        credentialLink: item.credentialLink || '',
        ...item
      }))

      const shouldUpdate =
        initialLoadRef.current || typedItems.length !== certifications.length

      if (shouldUpdate) {
        initialLoadRef.current = false

        setCertifications(typedItems)
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

  const handleCertificationChange = useCallback(
    (index: number, field: string, value: any) => {
      setCertifications(prevCertifications => {
        const updatedCertifications = [...prevCertifications]
        updatedCertifications[index] = {
          ...updatedCertifications[index],
          [field]: value
        }

        if (field === 'noExpiration' && value === true) {
          updatedCertifications[index].expiryDate = ''
        }

        debouncedReduxUpdate(updatedCertifications)
        return updatedCertifications
      })
    },
    [debouncedReduxUpdate]
  )

  const handleAddAnotherItem = useCallback(() => {
    const emptyItem: Certification = {
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      noExpiration: false,
      id: '',
      verificationStatus: 'unverified',
      credentialLink: ''
    }

    setCertifications(prevCertifications => {
      const updatedCertifications = [...prevCertifications, emptyItem]

      dispatch(
        updateSection({
          sectionId: 'certifications',
          content: {
            items: updatedCertifications
          }
        })
      )

      return updatedCertifications
    })

    const newIndex = certifications.length
    setExpandedItems(prev => ({
      ...prev,
      [newIndex]: true
    }))
  }, [certifications.length, dispatch])

  const handleDeleteCertification = useCallback(
    (index: number) => {
      if (certifications.length <= 1) {
        if (onDelete) onDelete()
        return
      }

      setCertifications(prevCertifications => {
        const updatedCertifications = prevCertifications.filter((_, i) => i !== index)
        dispatch(
          updateSection({
            sectionId: 'certifications',
            content: {
              items: updatedCertifications
            }
          })
        )

        return updatedCertifications
      })

      setExpandedItems(prev => {
        const newExpandedState: Record<number, boolean> = {}
        certifications
          .filter((_, i) => i !== index)
          .forEach((_, i) => {
            if (i === 0 && certifications.length - 1 === 1) {
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
    [certifications, dispatch, onDelete]
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

        setCertifications(prevCertifications => {
          const updatedCertifications = [...prevCertifications]
          updatedCertifications[activeSectionIndex] = {
            ...updatedCertifications[activeSectionIndex],
            verificationStatus: 'verified',
            credentialLink: credentialLink,
            credentialId: credentialId
          }

          dispatch(
            updateSection({
              sectionId: 'certifications',
              content: {
                items: updatedCertifications
              }
            })
          )

          return updatedCertifications
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
        Add certifications and licenses to showcase your professional qualifications.
        These can significantly enhance your resume, especially for roles requiring
        specific credentials.
      </Typography>

      {certifications.map((certification, index) => (
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
                  <Typography variant='body1'>Certification:</Typography>
                  <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
                    {certification.name || 'Untitled Certification'}
                  </Typography>
                </>
              ) : (
                <Box display='flex' alignItems='center'>
                  <Typography variant='body1'>Certification Details</Typography>
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
                label='Certification/License Name'
                placeholder='e.g., Professional Project Manager (PMP)'
                value={certification.name}
                onChange={e => handleCertificationChange(index, 'name', e.target.value)}
                variant='outlined'
              />

              <TextField
                sx={{ bgcolor: '#FFF' }}
                size='small'
                fullWidth
                label='Issuing Organization'
                placeholder='e.g., Project Management Institute'
                value={certification.issuer}
                onChange={e => handleCertificationChange(index, 'issuer', e.target.value)}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ width: '50%' }}>
                    <Typography variant='body2' sx={{ mb: 1 }}>
                      Issue Date
                    </Typography>
                    <TextField
                      sx={{ bgcolor: '#FFF' }}
                      size='small'
                      fullWidth
                      type='date'
                      value={certification.issueDate}
                      onChange={e =>
                        handleCertificationChange(index, 'issueDate', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>

                  <Box sx={{ width: '50%' }}>
                    <Typography variant='body2' sx={{ mb: 1 }}>
                      Expiry Date
                    </Typography>
                    <TextField
                      sx={{ bgcolor: '#FFF' }}
                      size='small'
                      fullWidth
                      type='date'
                      value={certification.expiryDate}
                      onChange={e =>
                        handleCertificationChange(index, 'expiryDate', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      disabled={certification.noExpiration}
                    />
                  </Box>
                </Box>
              </LocalizationProvider>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={certification.noExpiration}
                    onChange={e =>
                      handleCertificationChange(index, 'noExpiration', e.target.checked)
                    }
                  />
                }
                label='This certification does not expire'
              />

              <TextField
                sx={{ bgcolor: '#FFF' }}
                size='small'
                fullWidth
                label='Credential ID (optional)'
                placeholder='e.g., ABC123456'
                value={certification.credentialId}
                onChange={e =>
                  handleCertificationChange(index, 'credentialId', e.target.value)
                }
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
                  onClick={() => handleDeleteCertification(index)}
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
          onClick={() => handleOpenCredentialsOverlay(certifications.length - 1)}
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
