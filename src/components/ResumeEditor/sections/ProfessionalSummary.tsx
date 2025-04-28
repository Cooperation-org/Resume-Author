import React, { useState, useEffect, useCallback } from 'react'
import { Box, Typography, Button, IconButton } from '@mui/material'
import TextEditor from '../../TextEditor/Texteditor'
import { useDispatch, useSelector } from 'react-redux'
import { updateSection } from '../../../redux/slices/resume'
import { RootState } from '../../../redux/store'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import CredentialOverlay from '../../CredentialsOverlay'
import { StyledButton } from './StyledButton'
import { SVGAddFiles, SVGDeleteSection } from '../../../assets/svgs'

interface ProfessionalSummaryProps {
  onAddFiles?: () => void
  onDelete?: () => void
  onAddCredential?: (text: string) => void
}

interface SelectedCredential {
  id: string
  url: string
  name: string
}

export default function ProfessionalSummary({
  onAddFiles,
  onDelete,
  onAddCredential
}: ProfessionalSummaryProps) {
  const dispatch = useDispatch()
  const resume = useSelector((state: RootState) => state.resume.resume)
  const vcs = useSelector((state: any) => state.vcReducer.vcs)

  const [description, setDescription] = useState('')
  const [showCredentialsOverlay, setShowCredentialsOverlay] = useState(false)
  const [selectedCredentials, setSelectedCredentials] = useState<SelectedCredential[]>([])
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'verified'>(
    'unverified'
  )
  const [credentialLink, setCredentialLink] = useState('')

  useEffect(() => {
    if (resume?.summary) {
      if (resume.summary !== description) {
        setDescription(resume.summary)
      }
    }
    if (resume?.summaryCredentials) {
      setSelectedCredentials(resume.summaryCredentials)
      setVerificationStatus(resume.summaryVerificationStatus || 'unverified')
      setCredentialLink(resume.summaryCredentialLink || '')
    }
  }, [description, resume])

  const handleDescriptionChange = (val: string) => {
    if (val !== description) {
      setDescription(val)
      dispatch(
        updateSection({
          sectionId: 'summary',
          content: val
        })
      )
    }
  }

  const handleOpenCredentialsOverlay = useCallback(() => {
    setShowCredentialsOverlay(true)
  }, [])

  const handleCredentialSelect = useCallback(
    (selectedCredentialIDs: string[]) => {
      if (selectedCredentialIDs.length > 0) {
        const selected = selectedCredentialIDs.map(id => {
          const c = vcs.find((r: any) => (r?.originalItem?.id || r.id) === id)
          return {
            id,
            url: `https://linkedcreds.allskillscount.org/view/${id}`,
            name:
              c?.credentialSubject?.achievement?.[0]?.name ||
              `Credential ${id.substring(0, 5)}...`
          }
        })
        setSelectedCredentials(selected)
        setVerificationStatus('verified')
        setCredentialLink(selected[0].url)
        dispatch(
          updateSection({
            sectionId: 'summary',
            content: {
              text: description,
              credentials: selected,
              verificationStatus: 'verified',
              credentialLink: selected[0].url
            }
          })
        )
      }
      setShowCredentialsOverlay(false)
    },
    [description, dispatch, vcs]
  )

  const handleRemoveCredential = useCallback(
    (credIndex: number) => {
      const newCreds = selectedCredentials.filter((_, i) => i !== credIndex)
      setSelectedCredentials(newCreds)
      if (!newCreds.length) {
        setVerificationStatus('unverified')
        setCredentialLink('')
      } else {
        setCredentialLink(newCreds[0].url)
      }
      dispatch(
        updateSection({
          sectionId: 'summary',
          content: {
            text: description,
            credentials: newCreds,
            verificationStatus: newCreds.length ? 'verified' : 'unverified',
            credentialLink: newCreds.length ? newCreds[0].url : ''
          }
        })
      )
    },
    [description, dispatch, selectedCredentials]
  )

  const handleAddAnotherItem = useCallback(() => {
    const emptyItem = {
      text: '',
      credentials: [],
      verificationStatus: 'unverified' as const,
      credentialLink: ''
    }
    dispatch(
      updateSection({
        sectionId: 'summary',
        content: {
          ...emptyItem,
          text: description
        }
      })
    )
  }, [description, dispatch])

  return (
    <Box>
      <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
        Write a brief summary highlighting your skills, experience, and achievements.
        Focus on what makes you stand out, including specific expertise or career goals.
        Keep it quantitative, clear, professional, and tailored to your target role.
      </Typography>

      <TextEditor
        value={description}
        onChange={handleDescriptionChange}
        onAddCredential={onAddCredential}
      />

      {selectedCredentials.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
            Verified Credentials:
          </Typography>
          {selectedCredentials.map((credential, credIndex) => (
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
                  handleRemoveCredential(credIndex)
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
        <StyledButton startIcon={<SVGDeleteSection />} onClick={onDelete}>
          Delete this item
        </StyledButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '20px'
        }}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={handleOpenCredentialsOverlay}
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
          onClose={() => setShowCredentialsOverlay(false)}
          onSelect={handleCredentialSelect}
          initialSelectedCredentials={selectedCredentials}
        />
      )}
    </Box>
  )
}
