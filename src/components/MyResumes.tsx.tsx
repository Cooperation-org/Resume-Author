import { Box, Typography } from '@mui/material'
import ResumeCard from './ResumeCard'
import { Link } from 'react-router-dom'
import { RootState } from '../redux/store'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

const ResumeScreen: React.FC = () => {
  const reduxResumes = useSelector((state: RootState) => state.vcReducer.resumes)
  console.log('🚀 ~ resumes:', reduxResumes)
  const status = useSelector((state: RootState) => state.vcReducer.status)

  const [resumes, setResumes] = useState<{
    signed: ResumeData[]
    unsigned: ResumeData[]
  }>({
    signed: [],
    unsigned: []
  })

  useEffect(() => {
    if (reduxResumes) {
      setResumes(reduxResumes as any)
    }
  }, [reduxResumes])

  const handleCreateResume = (type: 'signed' | 'unsigned') => {
    const newResume: ResumeData = {
      id: `resume-${Date.now()}`, // Unique ID
      content: {
        resume: {
          contact: { fullName: 'New Resume' },
          lastUpdated: new Date().toISOString()
        }
      },
      type
    }

    setResumes(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), newResume] // Ensure prev[type] is an array
    }))
  }

  const removeResume = (id: string, type: 'signed' | 'unsigned') => {
    setResumes(prev => ({
      ...prev,
      [type]: (prev[type] || []).filter(resume => resume.id !== id) // Ensure prev[type] is an array
    }))
  }
  return (
    <Box
      sx={{
        mx: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        marginInline: 3,
        gap: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          mt: 2
        }}
      >
        <Typography variant='h4' sx={{ color: '#2E2E48', fontWeight: 700 }}>
          My Resumes
        </Typography>
        <Link
          style={{
            background: '#4F46E5',
            padding: '0.7rem 1rem',
            borderRadius: '40px',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 500
          }}
          to='/resume/new'
        >
          Create new resume
        </Link>
      </Box>

      {/* Render Signed Resumes */}
      {resumes.signed.map(resume => (
        <ResumeCard
          key={resume.id}
          id={resume.id}
          title={resume.content.resume.contact.fullName}
          date={new Date(resume.content.resume.lastUpdated).toLocaleDateString()}
          credentials={0} // Update this if you have credentials data
          resume={resume}
          addNewResume={handleCreateResume}
          removeResume={removeResume}
        />
      ))}

      {status === 'loading' && <Typography>Loading resumes...</Typography>}
      {resumes.signed.length + resumes.unsigned.length === 0 && status !== 'loading' && (
        <Typography>You dont have any resumes.</Typography>
      )}

      {/* Render Unsigned Resumes */}
      {resumes.unsigned.map(resume => (
        <ResumeCard
          key={resume.id}
          id={resume.id}
          title={resume.content.resume.contact.fullName}
          date={new Date().toLocaleDateString()} // Use a default date or fetch from content
          credentials={0} // Update this if you have credentials data
          isDraft={true}
          lastUpdated='2 months ago' // Update this if you have lastUpdated data
          resume={resume}
          addNewResume={handleCreateResume}
          removeResume={removeResume}
        />
      ))}
    </Box>
  )
}

export default ResumeScreen
