import {
  Box,
  Button,
  Typography,
  Autocomplete,
  TextField,
  LinearProgress,
  linearProgressClasses,
  styled,
  IconButton
} from '@mui/material'
import LeftSidebar, { leftSections } from './ResumeEditor/LeftSidebar'
import RightSidebar from './ResumeEditor/RightSidebar'
import Section from './ResumeEditor/Section'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/store'
import { useState } from 'react'
import { SVGEditName } from '../assets/svgs'
import useGoogleDrive from '../hooks/useGoogleDrive'
import { useNavigate } from 'react-router-dom'
import { updateSection } from '../redux/slices/resume'

const nonVisibleSections = [
  ...leftSections,
  'id',
  'lastUpdated',
  'version',
  'error',
  'status',
  'isDirty'
]

const ButtonStyles = {
  border: '2px solid #3A35A2',
  borderRadius: '100px',
  textTransform: 'none',
  fontWeight: 600,
  color: '#3A35A2',
  p: '5px 25px'
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '15px',
  borderRadius: '0px 30px 30px 0px',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#E1E2F6',
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800]
    })
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#614BC4',
    ...theme.applyStyles('dark', {
      backgroundColor: '#614BC4'
    })
  }
}))

const ResumeEditor = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [addSectionOpen, setAddSectionOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [sectionOrder, setSectionOrder] = useState<(keyof Resume)[]>([
    'Professional Summary' as any,
    'Work Experience',
    'Education',
    'Professional Affiliations',
    'Skills and Abilities'
  ])
  const [isEditingName, setIsEditingName] = useState(false)
  const [resumeName, setResumeName] = useState('Untitled')

  const resume = useSelector((state: RootState) => state?.resume.resume)
  const { instances } = useGoogleDrive()

  const AllSections = Object.keys(resume as Resume).filter(
    sec =>
      !sectionOrder.includes(sec as keyof Resume) && !nonVisibleSections.includes(sec)
  )

  const handleSectionSelect = (event: any, value: string | null) => {
    setSelectedSection(value)
  }

  const handleAddSelectedSection = () => {
    if (selectedSection && AllSections.includes(selectedSection)) {
      setSectionOrder(prev => [...prev, selectedSection as keyof Resume])
      setSelectedSection(null) // Reset selection
    }
    setAddSectionOpen(false)
  }

  const handlePreview = () => {
    console.log(resume)
    navigate('/resume/preview')
  }

  const handleSaveDraft = async () => {
    const savedResume = await instances?.resumeManager?.saveResume({
      resume: resume,
      type: 'unsigned'
    })
    console.log('Saved Resume:', savedResume)
  }

  const handleSignAndSave = async () => {
    const keyPair = await instances?.resumeVC?.generateKeyPair()
    const didDoc = await instances?.resumeVC?.createDID({
      keyPair
    })

    const signedResume = await instances?.resumeVC?.sign({
      formData: resume,
      issuerDid: didDoc.id,
      keyPair
    })
    await instances?.resumeManager?.saveResume({
      resume: signedResume,
      type: 'sign'
    })
    console.log('resume', signedResume)
  }

  const handleEditNameClick = () => {
    setIsEditingName(true)
    // Initialize with current resume name if available
    if (resume && resume.name) {
      setResumeName(resume.name)
    }
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResumeName(event.target.value)
  }

  const handleNameSave = () => {
    if (!resume) return

    dispatch(updateSection({ sectionId: 'name', content: resumeName }))
    setIsEditingName(false)
  }

  const handleNameKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleNameSave()
    } else if (event.key === 'Escape') {
      setIsEditingName(false)
      // Reset to original value
      if (resume && resume.name) {
        setResumeName(resume.name)
      } else {
        setResumeName('Untitled')
      }
    }
  }

  return (
    <Box sx={{ p: 6 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: '20px'
        }}
      >
        <Box sx={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {isEditingName ? (
              <TextField
                value={resumeName}
                onChange={handleNameChange}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyPress}
                autoFocus
                variant='standard'
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#000',
                    fontFamily: 'Poppins',
                    fontSize: '42px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '55.88px'
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#614BC4'
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#614BC4'
                  }
                }}
              />
            ) : (
              <Typography
                sx={{
                  color: '#000',
                  fontFamily: 'Poppins',
                  fontSize: '42px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '55.88px'
                }}
              >
                {resume?.name || 'Untitled'}
              </Typography>
            )}
            <IconButton onClick={handleEditNameClick}>
              <SVGEditName />
            </IconButton>
          </Box>
          <Typography
            sx={{
              color: '#2E2E48',
              fontFamily: 'DM Sans',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: 'normal',
              letterSpacing: '0.16px'
            }}
          >
            Name your resume with your first and last name so recruiters can easily locate
            your resume.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Button onClick={handlePreview} variant='outlined' sx={ButtonStyles}>
            Preview
          </Button>
          <Button variant='outlined' sx={ButtonStyles} onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <Button
            variant='outlined'
            sx={{ ...ButtonStyles, color: 'white', bgcolor: '#614BC4' }}
            onClick={handleSignAndSave}
          >
            Save and Sign
          </Button>
        </Box>
      </Box>

      <BorderLinearProgress variant='determinate' value={100} />
      <Typography
        sx={{
          color: '#2E2E48',
          fontFamily: 'DM Sans',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: 'normal',
          letterSpacing: '0.16px',
          mt: '20px'
        }}
      >
        Any section left blank will not appear on your resume.
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
        <LeftSidebar />

        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }}
        >
          <Box>
            {resume &&
              sectionOrder.map(key => (
                <Section
                  key={key}
                  sectionId={key}
                  highlightedText={''}
                  tooltipPosition={null}
                />
              ))}
          </Box>

          {/* Autocomplete for Adding New Sections */}
          {addSectionOpen && (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center'
              }}
            >
              <Autocomplete
                options={AllSections}
                value={selectedSection}
                onChange={handleSectionSelect}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Add Section'
                    placeholder='Type to search...'
                    variant='outlined'
                    fullWidth
                  />
                )}
                fullWidth
              />
              <Button
                onClick={handleAddSelectedSection}
                disabled={!selectedSection}
                sx={{ borderRadius: 5 }}
              >
                Add
              </Button>
            </Box>
          )}
        </Box>

        <RightSidebar />
      </Box>
    </Box>
  )
}

export default ResumeEditor
