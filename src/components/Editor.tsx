import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Typography, Autocomplete, TextField } from '@mui/material'
import LeftSidebar, { leftSections } from './ResumeEditor/LeftSidebar'
import RightSidebar from './ResumeEditor/RightSidebar'
import Section from './ResumeEditor/Section'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Plus } from 'lucide-react'
import ExperienceSection from './ResumeEditor/ExperienceSection'
import type { ResumeState } from '../redux/slices/resume'

type ReduxResume = NonNullable<ResumeState['resume']>
type ResumeSectionKey = keyof ReduxResume

const nonVisibleSections: string[] = [
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
  const [selectedSection, setSelectedSection] = useState<ResumeSectionKey | null>(null)
  const [sectionOrder, setSectionOrder] = useState<ResumeSectionKey[]>([
    'summary',
    'experience',
    'education'
  ])

  const resume = useSelector((state: RootState) => state.resume.resume)
  type FullWorkExperience = ReduxResume['experience']['items'][number]
  const prevExperiencesRef = useRef<FullWorkExperience[] | undefined>(
    resume?.experience?.items
  )

  useEffect(() => {
    if (
      resume?.experience?.items &&
      resume.experience.items !== prevExperiencesRef.current
    ) {
      console.log('Experience section was saved or updated:', resume.experience.items)
      prevExperiencesRef.current = resume.experience.items
    }
  }, [resume?.experience?.items])

  useEffect(() => {
    console.log('🚀 ~ resume', resume)
  }, [resume])

  const AllSections = resume
    ? (Object.keys(resume) as ResumeSectionKey[]).filter(
        sec => !sectionOrder.includes(sec) && !nonVisibleSections.includes(sec)
      )
    : []

  const handleSectionSelect = (_event: any, value: ResumeSectionKey | null) => {
    setSelectedSection(value)
  }

  const handleAddSelectedSection = () => {
    if (selectedSection && AllSections.includes(selectedSection)) {
      setSectionOrder(prev => [...prev, selectedSection])
      setSelectedSection(null) // Reset selection
    }
    setAddSectionOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', gap: 4, p: 4, marginBottom: 2 }}>
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
          <Typography variant='h4' fontWeight='600' mb={2}>
            Edit your resume
          </Typography>
          {resume &&
            sectionOrder.map(sectionKey => {
              if (sectionKey === 'experience') {
                return <ExperienceSection key={sectionKey} />
              } else {
                return <Section key={sectionKey} sectionId={sectionKey} />
              }
            })}
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
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
  )
}

export default ResumeEditor
