import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Box, Typography, Button, IconButton } from '@mui/material'
import TextEditor from '../../TextEditor/Texteditor'
import { SVGDownIcon, SVGAddFiles, SVGDeleteSection } from '../../../assets/svgs'
import { StyledButton } from './StyledButton'
import { useDispatch, useSelector } from 'react-redux'
import { updateSection } from '../../../redux/slices/resume'
import { RootState } from '../../../redux/store'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CredentialOverlay from '../../CredentialsOverlay'

interface SkillsAndAbilitiesProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

export default function SkillsAndAbilities({
  onAddFiles,
  onDelete,
  onAddCredential
}: SkillsAndAbilitiesProps) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const reduxUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)
  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)

  const [Skills, setSkills] = useState<Skill[]>([
    {
      skills: '',
      id: '',
      verificationStatus: 'unverified',
      credentialLink: ''
    }
  ])

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({
    0: true
  })

  const debouncedReduxUpdate = useCallback(
    (items: Skill[]) => {
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
        ...item
      }))

      const shouldUpdate = initialLoadRef.current || typedItems.length !== Skills.length

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
    const emptyItem: Skill = {
      skills: '',
      id: '',
      verificationStatus: 'unverified',
      credentialLink: ''
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

    const newIndex = Skills.length
    setExpandedItems(prev => ({
      ...prev,
      [newIndex]: true
    }))
  }, [Skills.length, dispatch])

  const handleDeleteSkill = useCallback(
    (index: number) => {
      if (Skills.length <= 1) {
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
        Skills.filter((_, i) => i !== index).forEach((_, i) => {
          if (i === 0 && Skills.length - 1 === 1) {
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
    [Skills, dispatch, onDelete]
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

        setSkills(prevSkills => {
          const updatedSkills = [...prevSkills]
          updatedSkills[activeSectionIndex] = {
            ...updatedSkills[activeSectionIndex],
            verificationStatus: 'verified',
            credentialLink: credentialLink
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
    [activeSectionIndex, dispatch]
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Typography variant='h6'>Skills and Abilities</Typography>
      {Skills.map((Skill, index) => (
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
                value={Skill.skills || ''}
                onChange={val => handleSkillChange(index, 'skills', val)}
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
          onClick={() => handleOpenCredentialsOverlay(Skills.length - 1)}
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
