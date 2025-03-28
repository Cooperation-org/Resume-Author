/**
 * src/pages/EditResumePage.tsx
 */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CircularProgress, Box, Typography } from '@mui/material'
import { GoogleDriveStorage } from '@cooperation/vc-storage'
import { getLocalStorage } from '../tools/cookie'
import { adaptGoogleDriveDataToEditor } from '../tools/adaptResumeData'
import { useDispatch } from 'react-redux'
import { setSelectedResume } from '../redux/slices/resume' // <--- the action we use to store the loaded resume
import ResumeEditor from '../components/Editor'

const EditResumePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAndLoadResume = async () => {
      if (!id) {
        setError('No resume ID found in URL.')
        setLoading(false)
        return
      }
      try {
        const accessToken = getLocalStorage('auth')
        if (!accessToken) throw new Error('Missing auth token.')

        const storage = new GoogleDriveStorage(accessToken)
        const fileData = await storage.retrieve(id)

        // Here is the raw file data response from Google Drive
        console.log('Full file data from Google Drive:', fileData)

        // fileData.data is your actual content:
        const rawData = fileData?.data
        console.log('Raw "data" property from the file:', rawData)

        if (!rawData) {
          throw new Error('No data found in file.')
        }

        // Convert data to the format your editor needs
        const adapted = adaptGoogleDriveDataToEditor(rawData)
        console.log('Adapted resume data for Redux:', adapted)

        // Dispatch to Redux
        dispatch(setSelectedResume(adapted))
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load resume.')
      } finally {
        setLoading(false)
      }
    }

    fetchAndLoadResume()
  }, [id, dispatch])

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={24} />
        <Typography sx={{ ml: 2 }}>Loading resume data...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color='error'>{error}</Typography>
      </Box>
    )
  }

  // Render the Editor in "edit mode"
  return <ResumeEditor isEditMode />
}

export default EditResumePage
