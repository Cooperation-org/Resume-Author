import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Box, Typography, Button, IconButton } from '@mui/material'
import TextEditor from '../../TextEditor/Texteditor'
import { SVGDownIcon, SVGAddFiles, SVGDeleteSection } from '../../../assets/svgs'
import { StyledButton } from './StyledButton'
import { useDispatch, useSelector } from 'react-redux'
import { updateSection } from '../../../redux/slices/resume'
import { RootState } from '../../../redux/store'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import CredentialOverlay from '../../CredentialsOverlay'
import AttachFileIcon from '@mui/icons-material/AttachFile'

interface FileItem {
  id: string
  file: File
  name: string
  url: string
  uploaded: boolean
  fileExtension: string
  googleId?: string
}

interface SkillsAndAbilitiesProps {
  onAddFiles?: (itemIndex?: number) => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
  onFocus?: () => void
  evidence?: string[][]
  allFiles?: FileItem[]
  onRemoveFile?: (sectionId: string, itemIndex: number, fileIndex: number) => void
}

interface SkillItem {
  skills: string
  id: string
  verificationStatus: string
  credentialLink: string
  selectedCredentials: SelectedCredential[]
}

interface SelectedCredential {
  id: string
  url: string
  name: string
  vc: any
}

export default function SkillsAndAbilities({
  onAddFiles,
  onDelete,
  onAddCredential,
  onFocus,
  evidence = [],
  allFiles,
  onRemoveFile
}: Readonly<SkillsAndAbilitiesProps>) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const reduxUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)
  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)
  const vcs = useSelector((state: any) => state.vcReducer.vcs)

  const [skills, setSkills] = useState<SkillItem[]>([
    {
      skills: '',
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
    (items: SkillItem[]) => {
      if (reduxUpdateTimeoutRef.current) {
        clearTimeout(reduxUpdateTimeoutRef.current)
      }
      reduxUpdateTimeoutRef.current = setTimeout(() => {
        dispatch(
          updateSection({
            sectionId: 'skills',
            content: {
              items: items
            }
          })
        )
      }, 500)
    },
    [dispatch]
  )

  // Load existing skills from Redux
  useEffect(() => {
    if (resume?.skills?.items && resume.skills.items.length > 0) {
      const typedItems = resume.skills.items.map((item: any) => ({
        skills: Array.isArray(item) ? item.join(', ') : item.skills || '',
        id: item.id || '',
        verificationStatus: item.verificationStatus || 'unverified',
        credentialLink: item.credentialLink || '',
        selectedCredentials: item.selectedCredentials || [],
        ...item
      }))

      const shouldUpdate = initialLoadRef.current || typedItems.length !== skills.length

      if (shouldUpdate) {
        initialLoadRef.current = false

        setSkills(typedItems)
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

  const handleSkillChange = useCallback(
    (index: number, field: string, value: string) => {
      setSkills(prev => {
        const updated = [...prev]
        updated[index] = { ...updated[index], [field]: value }
        debouncedReduxUpdate(updated)
        return updated
      })
    },
    [debouncedReduxUpdate]
  )

  const handleAddAnotherItem = useCallback(() => {
    const emptyItem: SkillItem = {
      skills: '',
      id: '',
      verificationStatus: 'unverified',
      credentialLink: '',
      selectedCredentials: []
    }

    setSkills(prevSkills => {
      const updatedSkills = [...prevSkills, emptyItem]

      dispatch(
        updateSection({
          sectionId: 'skills',
          content: {
            items: updatedSkills
          }
        })
      )

      return updatedSkills
    })

    const newIndex = skills.length
    setExpandedItems(prev => ({
      ...prev,
      [newIndex]: true
    }))
  }, [skills.length, dispatch])

  const handleDeleteSkill = useCallback(
    (index: number) => {
      if (skills.length <= 1) {
        if (onDelete) onDelete()
        return
      }

      setSkills(prevSkills => {
        const updatedSkills = prevSkills.filter((_, i) => i !== index)
        dispatch(
          updateSection({
            sectionId: 'skills',
            content: {
              items: updatedSkills
            }
          })
        )

        return updatedSkills
      })

      setExpandedItems(prev => {
        const newExpandedState: Record<number, boolean> = {}
        skills
          .filter((_, i) => i !== index)
          .forEach((_, i) => {
            if (i === 0 && skills.length - 1 === 1) {
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
    [skills, dispatch, onDelete]
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
            id,
            url: '', // not used, but required by interface
            name:
              credential?.credentialSubject?.achievement[0]?.name ||
              `Credential ${id.substring(0, 5)}...`,
            vc: credential // full object
          }
        })

        setSkills(prevSkills => {
          const updatedSkills = [...prevSkills]
          updatedSkills[activeSectionIndex] = {
            ...updatedSkills[activeSectionIndex],
            verificationStatus: 'verified',
            credentialLink:
              selectedCredentials &&
              selectedCredentials.length > 0 &&
              selectedCredentials[0].id
                ? `${selectedCredentials[0].id},${JSON.stringify(selectedCredentials[0].vc)}`
                : '',
            selectedCredentials
          }

          dispatch(
            updateSection({
              sectionId: 'skills',
              content: {
                items: updatedSkills
              }
            })
          )

          return updatedSkills
        })
      }

      setShowCredentialsOverlay(false)
      setActiveSectionIndex(null)
    },
    [activeSectionIndex, dispatch, vcs]
  )

  const handleRemoveCredential = useCallback(
    (itemIndex: number, credentialIndex: number) => {
      setSkills(prevSkills => {
        const updatedSkills = [...prevSkills]
        updatedSkills[itemIndex].selectedCredentials = updatedSkills[
          itemIndex
        ].selectedCredentials.filter((_, index) => index !== credentialIndex)

        dispatch(
          updateSection({
            sectionId: 'skills',
            content: {
              items: updatedSkills
            }
          })
        )

        return updatedSkills
      })
    },
    [dispatch]
  )

  useEffect(() => {
    // Add event listener for opening credentials overlay
    const handleOpenCredentialsEvent = (event: CustomEvent) => {
      const { sectionId, itemIndex, selectedText } = event.detail
      if (sectionId === 'skills') {
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
  const handleRemoveFile = (itemIndex: number, fileIndex: number) => {
    if (onRemoveFile) {
      onRemoveFile('skills', itemIndex, fileIndex)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Typography variant='h6'>Skills and Abilities</Typography>
      {skills.map((skill, index) => (
        <Box
          key={`skill-${index}`}
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
              {!expandedItems[index] ? (
                <>
                  <Typography variant='body1'>Skills</Typography>
                </>
              ) : (
                <Box display='flex' alignItems='center'>
                  <Typography
                    sx={{
                      fontFamily: 'Nunito Sans',
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: 'normal',
                      letterSpacing: '0.16px'
                    }}
                  >
                    Add skills and link them to credentials to strengthen their value on
                    your resume.
                  </Typography>
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
              <TextEditor
                key={`editor-${index}`}
                value={skill.skills || ''}
                onChange={val => handleSkillChange(index, 'skills', val)}
                onAddCredential={onAddCredential}
                onFocus={onFocus}
              />

              {skill.selectedCredentials && skill.selectedCredentials.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
                    Verified Credentials:
                  </Typography>
                  {skill.selectedCredentials.map((credential, credIndex) => (
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

              {evidence && evidence[index] && evidence[index].length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
                    Attached Files:
                  </Typography>
                  {evidence[index].map((fileId, fileIndex) => {
                    const file = allFiles?.find(f => f.id === fileId)
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
                  onClick={() => handleDeleteSkill(index)}
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
          onClick={() => handleOpenCredentialsOverlay(skills.length - 1)}
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
            activeSectionIndex !== null && skills[activeSectionIndex]?.selectedCredentials
              ? skills[activeSectionIndex].selectedCredentials
              : []
          }
        />
      )}
    </Box>
  )
}
