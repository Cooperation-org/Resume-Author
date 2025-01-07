import { Box, Button, Typography, Autocomplete, TextField } from '@mui/material'
import LeftSidebar, { leftSections } from './ResumeEditor/LeftSidebar'
import RightSidebar from './ResumeEditor/RightSidebar'
import Section from './ResumeEditor/Section'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

const nonVisibleSections = [
  ...leftSections,
  'id',
  'lastUpdated',
  'version',
  'error',
  'status',
  'isDirty'
]

const ResumeEditor = () => {
  const [addSectionOpen, setAddSectionOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [sectionOrder, setSectionOrder] = useState<(keyof Resume)[]>([
    'summary',
    'experience',
    'education'
  ])

  // Tooltip state
  const [highlightedText, setHighlightedText] = useState<string>('')
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number
    left: number
  } | null>(null)

  const resume = useSelector((state: RootState) => state.resume.resume)
  const { vcs, status, error } = useSelector((state: RootState) => state.vcReducer)

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

  return (
    <Box sx={{ display: 'flex', gap: 4, p: 4, marginBottom: 2 }}>
      <LeftSidebar
        highlightedText={highlightedText}
        credentials={vcs}
        tooltipPosition={tooltipPosition}
      />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}
      >
        <Box>
          <Typography variant='h4' fontWeight='600' mb={2}>
            Edit your resume
          </Typography>
          {resume &&
            sectionOrder.map(key => (
              <Section
                key={key}
                sectionId={key}
                highlightedText={highlightedText}
                credentials={vcs}
                tooltipPosition={tooltipPosition}
              />
            ))}
        </Box>

        {/* Add Section Button */}
        {!addSectionOpen && (
          <Button
            variant='outlined'
            startIcon={<Plus />}
            sx={{ mb: 2, fontSize: '1rem', borderRadius: 5 }}
            onClick={() => setAddSectionOpen(true)}
          >
            Add Section
          </Button>
        )}

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

      {/* Right Sidebar */}
      <RightSidebar />

      {/* Verified Credentials Tooltip */}
      {tooltipPosition && vcs.some(file => file.length > 0) && (
        <Box
          sx={{
            position: 'absolute',
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1000,
            padding: '8px',
            width: '300px'
          }}
        >
          <Typography variant='body2' fontWeight='600'>
            Verified Credentials
          </Typography>
          <ul>
            {vcs.map((credential, index) => (
              <li key={index}>{credential[0].name}</li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  )
}

export default ResumeEditor
