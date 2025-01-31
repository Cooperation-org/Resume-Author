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
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useCallback, useEffect, useState } from 'react'
import { SVGEditName } from '../assets/svgs'
import { GoogleDriveStorage, Resume as ResumeManager } from '@cooperation/vc-storage'
import { getCookie } from '../tools'

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
  p: '0 25px'
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
  const [addSectionOpen, setAddSectionOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [sectionOrder, setSectionOrder] = useState<(keyof Resume)[]>([
    'Professional Summary' as any,
    'Work Experience',
    'Education',
    'Professional Affiliations',
    'Skills and Abilities'
  ])

  // Tooltip state
  const [highlightedText, setHighlightedText] = useState<string>('')
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number
    left: number
  } | null>(null)

  const resume = useSelector((state: RootState) => state?.resume.resume)
  const { vcs, status, error } = useSelector((state: RootState) => state.vcReducer)
  console.log('🚀 ~ ResumeEditor ~ vcs:', vcs)

  const AllSections = Object.keys(resume as unknown as Resume).filter(
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
  // Handle text selection
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection()
    try {
      if (selection && selection.toString().trim() !== '') {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        // Calculate tooltip position
        const viewportWidth = window.innerWidth
        const tooltipWidth = 300 // Approximate width of the tooltip
        const left = rect.left + window.scrollX
        const top = rect.bottom + window.scrollY

        // Adjust position if tooltip goes off-screen
        const adjustedLeft =
          left + tooltipWidth > viewportWidth ? left - tooltipWidth : left

        setTooltipPosition({ top, left: adjustedLeft })
        setHighlightedText(selection.toString().trim())
        console.log('Selected text:', selection.toString().trim())
        console.log('Tooltip Position:', { top, left: adjustedLeft })
      } else {
        setTooltipPosition(null)
        setHighlightedText('')
      }
    } catch (error) {
      console.error('Error getting text selection', error)
    }
  }, [])

  // Add event listener for text selection
  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection)
    return () => {
      document.removeEventListener('mouseup', handleTextSelection)
    }
  }, [handleTextSelection])

  const handleSaveDraft = async () => {
    const accessToken = getCookie('accessToken')
    if (!accessToken) {
      console.error('Access token not found')
      return
    }
    const storage = new GoogleDriveStorage(accessToken)
    const resumeManager = new ResumeManager(storage)
    const savedResume = await resumeManager.saveResume({
      resume: resume,
      type: 'unsigned'
    })
    console.log('Saved Resume:', savedResume)
  }

  return (
    <Box sx={{ p: 6 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: '30px'
        }}
      >
        <Box sx={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
              Alice Parker Resume
            </Typography>
            <IconButton>
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
            Placeholder for instructional text, if needed, TBD
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Button variant='outlined' sx={ButtonStyles}>
            Preview
          </Button>
          <Button variant='outlined' sx={ButtonStyles} onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <Button
            variant='outlined'
            sx={{ ...ButtonStyles, color: 'white', bgcolor: '#614BC4' }}
          >
            Save and Sign
          </Button>
        </Box>
      </Box>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            sx={{
              color: '#2E2E48',
              fontFamily: 'DM Sans',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: 'normal',
              letterSpacing: '0.16px',
              mt: 2
            }}
          >
            Progress: 50%
          </Typography>
          <Typography
            sx={{
              color: '#2E2E48',
              fontFamily: 'DM Sans',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: 'normal',
              letterSpacing: '0.16px',
              mt: 2,
              pr: 2
            }}
          >
            Add at least 1 credential!{' '}
          </Typography>
        </Box>

        <BorderLinearProgress variant='determinate' value={50} />
      </Box>
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
