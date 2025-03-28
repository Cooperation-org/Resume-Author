import { Box, Typography, Button, Paper } from '@mui/material'
import ResumeCard from './ResumeCard'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../redux/store'
import { useEffect } from 'react'
import { fetchUserResumes } from '../redux/slices/myresumes'

const ResumeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { signed, unsigned, status, error } = useSelector(
    (state: RootState) => state.myresumes
  )
  console.log('🚀 ~ unsigned:', unsigned)

  useEffect(() => {
    dispatch(fetchUserResumes())
  }, [dispatch])
  const renderErrorMessage = () => {
    if (
      error?.includes('invalid authentication credentials') ||
      error?.includes('OAuth')
    ) {
      return (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant='h6' sx={{ mb: 2, color: '#2E2E48' }}>
            Session Expired
          </Typography>
          <Typography sx={{ mb: 3 }}>
            It looks like your login session has expired. Please sign in again to access
            your resumes.
          </Typography>
          <Button
            variant='contained'
            sx={{
              bgcolor: '#4F46E5',
              borderRadius: '40px',
              '&:hover': { bgcolor: '#3f38b5' }
            }}
            component={Link}
            to='/login'
          >
            Sign In
          </Button>
        </Paper>
      )
    } else if (error?.includes('Root folder') || error?.includes('not found')) {
      return (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant='h6' sx={{ mb: 2, color: '#2E2E48' }}>
            Time to Create Your First Resume!
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Welcome! Looks like you're new here. Start your journey by creating your first
            professional resume.
          </Typography>
          <Button
            variant='contained'
            sx={{
              bgcolor: '#4F46E5',
              borderRadius: '40px',
              '&:hover': { bgcolor: '#3f38b5' }
            }}
            component={Link}
            to='/resume/new'
          >
            Create Your First Resume
          </Button>
        </Paper>
      )
    } else {
      return (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant='h6' sx={{ mb: 2, color: '#2E2E48' }}>
            Oops! Something Went Wrong
          </Typography>
          <Typography sx={{ mb: 3 }}>
            We're having trouble retrieving your resumes right now. Please try again in a
            moment.
          </Typography>
          <Button
            variant='contained'
            sx={{
              bgcolor: '#4F46E5',
              borderRadius: '40px',
              '&:hover': { bgcolor: '#3f38b5' }
            }}
            onClick={() => dispatch(fetchUserResumes())}
          >
            Try Again
          </Button>
        </Paper>
      )
    }
  }

  // Helper function to render empty state
  const renderEmptyState = () => {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant='h6' sx={{ mb: 2, color: '#2E2E48' }}>
          No Resumes Yet
        </Typography>
        <Typography sx={{ mb: 3 }}>
          You haven't created any resumes yet. Get started by creating your first resume.
        </Typography>
        <Button
          variant='contained'
          sx={{
            bgcolor: '#4F46E5',
            borderRadius: '40px',
            '&:hover': { bgcolor: '#3f38b5' }
          }}
          component={Link}
          to='/resume/new'
        >
          Create Your First Resume
        </Button>
      </Paper>
    )
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

      {/* Handle Loading & Error States */}
      {status === 'loading' && (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant='h6' sx={{ color: '#2E2E48' }}>
            Loading your resumes...
          </Typography>
        </Paper>
      )}

      {status === 'failed' && renderErrorMessage()}

      {/* Render Signed Resumes */}
      {status === 'succeeded' && signed.length > 0 && (
        <>
          {signed.map(resume => (
            <ResumeCard
              key={resume?.id}
              id={resume?.id}
              title={resume?.content?.credentialSubject?.person?.name?.formattedName}
              date={new Date(resume?.content?.issuanceDate).toLocaleDateString()}
              credentials={0}
              isDraft={false}
              resume={resume}
            />
          ))}
        </>
      )}

      {/* Render Unsigned (Draft) Resumes */}
      {status === 'succeeded' && unsigned.length > 0 && (
        <>
          {unsigned.map(resume => (
            <ResumeCard
              key={resume.id}
              id={resume.id}
              title={resume?.content?.contact?.fullName?.split('.')[0]}
              date={new Date().toLocaleDateString()}
              credentials={0}
              isDraft={true}
              resume={resume}
            />
          ))}
        </>
      )}

      {/* Show Empty State if No Resumes Exist */}
      {status === 'succeeded' &&
        signed.length + unsigned.length === 0 &&
        renderEmptyState()}
    </Box>
  )
}

export default ResumeScreen
