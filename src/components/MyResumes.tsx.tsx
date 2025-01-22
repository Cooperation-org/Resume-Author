import { Box, Typography } from '@mui/material'
import ResumeCard from './ResumeCard'
import { Link } from 'react-router-dom'
import { RootState } from '../redux/store'
import { useSelector } from 'react-redux'

const ResumeScreen: React.FC = () => {
  const resumes = useSelector((state: RootState) => state.vcReducer.resumes)
  const status = useSelector((state: RootState) => state.vcReducer.status)

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
        />
      ))}

      {status === 'loading' && <Typography>Loading resumes...</Typography>}
      {status === 'failed' && <Typography>Failed to load resumes.</Typography>}

      {/* Render Unsigned Resumes */}
      {resumes.unsigned.map(resume => (
        <ResumeCard
          key={resume.id}
          id={resume.id}
          title={resume.name}
          date={new Date().toLocaleDateString()} // Use a default date or fetch from content
          credentials={0} // Update this if you have credentials data
          isDraft={true}
          lastUpdated='2 months ago' // Update this if you have lastUpdated data
        />
      ))}
    </Box>
  )
}

export default ResumeScreen
