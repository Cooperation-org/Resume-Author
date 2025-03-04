import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { Box, CircularProgress } from '@mui/material'
import { setCurrentDraftResume } from '../redux/slices/myresumes'
import { setSelectedResume } from '../redux/slices/resume'
import Editor from './Editor'

const DraftEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const { currentDraft, status } = useSelector((state: RootState) => state.myresumes)
  const resume = useSelector((state: RootState) => state.resume.resume)

  useEffect(() => {
    if (id) {
      dispatch(setCurrentDraftResume(id))
        .unwrap()
        .then(draft => {
          // Set the draft data in the resume slice for editing
          dispatch(setSelectedResume(draft.content))
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Failed to load draft resume:', error)
          navigate('/myresumes')
        })
    }
  }, [id, dispatch, navigate])

  if (isLoading || status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  // Pass both the current draft and the resume state to Editor
  return <Editor draftData={currentDraft} resumeData={resume} />
}

export default DraftEditor
