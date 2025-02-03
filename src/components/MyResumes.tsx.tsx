import { Box, Typography } from '@mui/material'
import ResumeCard from './ResumeCard'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

const ResumeScreen: React.FC = () => {
  const { signed, unsigned, status, error } = useSelector(
    (state: RootState) => state.myresumes
  )
  console.log('🚀 ~ unsigned:', unsigned)

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

      {/* Handle Loading & Error States */}
      {status === 'loading' && <Typography>Loading resumes...</Typography>}
      {status === 'failed' && <Typography color='error'>Error: {error}</Typography>}

      {/* Render Signed Resumes */}
      {signed.map(resume => (
        <ResumeCard
          key={resume?.id}
          id={resume?.id}
          title={resume?.name}
          date={new Date(resume?.lastUpdated).toLocaleDateString()}
          credentials={0}
          isDraft={false}
          resume={resume}
        />
      ))}

      {/* Render Unsigned (Draft) Resumes */}
      {unsigned.map(resume => (
        <ResumeCard
          key={resume.id}
          id={resume.id}
          title={resume?.name.split('.')[0]}
          date={new Date().toLocaleDateString()}
          credentials={0}
          isDraft={true}
          resume={resume}
        />
      ))}

      {/* Show Message if No Resumes Exist */}
      {signed.length + unsigned.length === 0 && status === 'succeeded' && (
        <Typography>You don’t have any resumes.</Typography>
      )}
    </Box>
  )
}

export default ResumeScreen
