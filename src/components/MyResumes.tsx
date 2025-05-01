import { Box, Typography, Button } from '@mui/material'
import ResumeCard from './ResumeCard'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../redux/store'
import { useEffect } from 'react'
import { fetchUserResumes } from '../redux/slices/myresumes'
import useDraftResume from '../hooks/useDraftResume'
import { logout } from '../tools/auth'

const buttonStyles = {
  background: '#3A35A2',
  padding: '10px 31px',
  borderRadius: '100px',
  color: '#FFF',
  textAlign: 'center' as const,
  fontFamily: 'Nunito Sans',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: '24px',
  border: '3px solid #3A35A2',
  textDecoration: 'none'
}

const ResumeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { signed, unsigned, status, error } = useSelector(
    (state: RootState) => state.myresumes
  )

  // Get all drafts from localStorage but don't change the UI
  const { getAllDrafts } = useDraftResume(null)
  // We'll keep track of which drafts have local changes
  const localDrafts = getAllDrafts()

  useEffect(() => {
    dispatch(fetchUserResumes())
  }, [dispatch])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Check if a resume has unsaved changes in localStorage (used internally)
  const hasLocalDraft = (resumeId: string) => {
    return Boolean(localDrafts[resumeId])
  }

  // Helper function to determine if an unsigned resume is a completed template or a draft
  const isCompletedUnsigned = (resume: any) => {
    // Check if this resume has completed all required fields
    // You'll need to determine what makes a resume "complete" based on your requirements
    // This is a placeholder - implement the actual logic
    return resume?.content?.isComplete === true
  }

  // Filter unsigned resumes into drafts (incomplete) and completed but unsigned
  const draftResumes = unsigned.filter(resume => !isCompletedUnsigned(resume))

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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link style={buttonStyles} to='/resume/new'>
            Create new resume
          </Link>
          <Button
            onClick={handleLogout}
            sx={{
              ...buttonStyles,
              textTransform: 'capitalize',
              '&:hover': {
                background: '#322e8e',
                border: '3px solid #322e8e'
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Handle Loading & Error States */}
      {status === 'loading' && <Typography>Loading resumes...</Typography>}
      {status === 'failed' && <Typography color='error'>Error: {error}</Typography>}

      {/* Render Signed Resumes */}
      {signed.length > 0 && (
        <>
          <Typography variant='h6' sx={{ color: '#2E2E48', fontWeight: 600, mt: 2 }}>
            Signed Resumes
          </Typography>
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

      {/* Render Draft Resumes */}
      {draftResumes.length > 0 && (
        <>
          <Typography variant='h6' sx={{ color: '#2E2E48', fontWeight: 600, mt: 2 }}>
            Draft Resumes
          </Typography>
          {draftResumes.map(resume => (
            <ResumeCard
              key={resume.id}
              id={resume.id}
              title={
                resume?.content?.contact?.fullName?.split('.')[0] ||
                resume?.name?.split('.')[0]
              }
              date={new Date().toLocaleDateString()}
              credentials={0}
              isDraft={true}
              resume={resume}
              hasLocalChanges={hasLocalDraft(resume.id)}
              localDraftTime={localDrafts[resume.id]?.localStorageLastUpdated || null}
            />
          ))}
        </>
      )}

      {/* Show Message if No Resumes Exist */}
      {signed.length + unsigned.length === 0 && status === 'succeeded' && (
        <Typography>You don't have any resumes.</Typography>
      )}
    </Box>
  )
}

export default ResumeScreen
