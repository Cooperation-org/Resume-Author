import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  Tooltip
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
import VerifiedIcon from '@mui/icons-material/Verified'
import CloseIcon from '@mui/icons-material/Close'
import CredentialOverlay from '../../CredentialsOverlay'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

interface FileItem {
  id: string
  file: File
  name: string
  url: string
  uploaded: boolean
  fileExtension: string
  googleId?: string
}

interface CertificationsAndLicensesProps {
  onAddFiles?: (itemIndex?: number) => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
  evidence?: string[][]
  allFiles?: FileItem[]
  onRemoveFile?: (sectionId: string, itemIndex: number, fileIndex: number) => void
}

interface CertificationItem {
  name: string
  issuer: string
  issueDate: string
  expiryDate: string
  credentialId: string
  noExpiration: boolean
  id: string
  verificationStatus: string
  credentialLink: string
  selectedCredentials: SelectedCredential[]
}

interface SelectedCredential {
  id: string
  url: string
  name: string
  isAttestation?: boolean
}

export default function CertificationsAndLicenses({
  onAddFiles,
  onDelete,
  onAddCredential,
  evidence = [],
  allFiles = [],
  onRemoveFile
}: Readonly<CertificationsAndLicensesProps>) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const reduxUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)
  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)
  const vcs = useSelector((state: any) => state.vcReducer.vcs)

  const [certifications, setCertifications] = useState<CertificationItem[]>([
    {
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      noExpiration: false,
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
    (items: CertificationItem[]) => {
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
        selectedCredentials: item.selectedCredentials || [],
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
    const emptyItem: CertificationItem = {
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      noExpiration: false,
      id: '',
      verificationStatus: 'unverified',
      credentialLink: '',
      selectedCredentials: []
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
    (selectedCredentialIDs: string[]) => {
      if (activeSectionIndex !== null && selectedCredentialIDs.length > 0) {
        const selectedCredentials = selectedCredentialIDs.map(id => {
          const credential = vcs.find((c: any) => (c?.originalItem?.id || c.id) === id)

          return {
            id: id,
            url: `https://linkedcreds.allskillscount.org/view/${id}`,
            name:
              credential?.credentialSubject?.achievement[0]?.name ||
              `Credential ${id.substring(0, 5)}...`,
            isAttestation: false
          }
        })

        setCertifications(prevCertifications => {
          const updatedCertifications = [...prevCertifications]
          const currentCert = updatedCertifications[activeSectionIndex]
          const isAttestation = currentCert.name && currentCert.issuer
          if (isAttestation) {
            selectedCredentials.forEach(cred => {
              cred.isAttestation = true
            })
          }

          updatedCertifications[activeSectionIndex] = {
            ...currentCert,
            verificationStatus: 'verified',
            credentialLink: selectedCredentials[0].url,
            // If not an attestation, we can use the first credential to populate cert details
            ...(!isAttestation && selectedCredentials[0]
              ? {
                  credentialId: selectedCredentials[0].id
                }
              : {}),
            selectedCredentials: [
              ...(currentCert.selectedCredentials || []),
              ...selectedCredentials
            ]
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
    [activeSectionIndex, dispatch, vcs]
  )

  const handleRemoveCredential = useCallback(
    (certificationIndex: number, credentialIndex: number) => {
      setCertifications(prevCertifications => {
        const updatedCertifications = [...prevCertifications]
        const certification = { ...updatedCertifications[certificationIndex] }

        const updatedCredentials = (certification.selectedCredentials || []).filter(
          (_, i) => i !== credentialIndex
        )

        certification.selectedCredentials = updatedCredentials
        if (updatedCredentials.length === 0) {
          certification.verificationStatus = 'unverified'
          certification.credentialLink = ''
        } else {
          certification.credentialLink = updatedCredentials[0]?.url || ''
        }

        updatedCertifications[certificationIndex] = certification
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
    },
    [dispatch]
  )

  const handleRemoveFile = (itemIndex: number, fileIndex: number) => {
    if (onRemoveFile) {
      onRemoveFile('certifications', itemIndex, fileIndex)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
        Add certifications and licenses to showcase your professional qualifications.
        These can significantly enhance your resume, especially for roles requiring
        specific credentials.
      </Typography>

      {certifications.map((certification, index) => (
        <Box
          key={`certification-${index}`}
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
                  {certification.verificationStatus === 'verified' && (
                    <Tooltip title='Verified credential'>
                      <VerifiedIcon sx={{ color: '#34C759', fontSize: 18 }} />
                    </Tooltip>
                  )}
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
                      sx={{
                        bgcolor: '#FFF',
                        '& .MuiInputLabel-root': {
                          transform: 'translate(14px, -9px) scale(0.75)'
                        }
                      }}
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
                      sx={{
                        bgcolor: '#FFF',
                        '& .MuiInputLabel-root': {
                          transform: 'translate(14px, -9px) scale(0.75)'
                        }
                      }}
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

              {certification.selectedCredentials &&
                certification.selectedCredentials.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
                      {certification.selectedCredentials.some(c => c.isAttestation)
                        ? 'Credential Attestations:'
                        : 'Digital Credentials:'}
                    </Typography>
                    {certification.selectedCredentials.map((credential, credIndex) => (
                      <Box
                        key={`credential-${credential.id}-${credIndex}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 0.5,
                          backgroundColor: credential.isAttestation
                            ? '#f0f7ff'
                            : '#f5f5f5',
                          p: 0.5,
                          borderRadius: 1,
                          border: credential.isAttestation ? '1px solid #d0e8ff' : 'none'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {credential.isAttestation && (
                            <Tooltip title='Attestation verifying this certification'>
                              <VerifiedIcon
                                sx={{ color: '#1976d2', fontSize: 16, mr: 0.5 }}
                              />
                            </Tooltip>
                          )}
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
                        </Box>
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
          initialSelectedCredentials={
            activeSectionIndex !== null &&
            certifications[activeSectionIndex]?.selectedCredentials
              ? certifications[activeSectionIndex].selectedCredentials
              : []
          }
        />
      )}
    </Box>
  )
}
