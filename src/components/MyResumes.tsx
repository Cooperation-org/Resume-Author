import { Box, Typography } from '@mui/material'
import ResumeCard from './ResumeCard'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../redux/store'
import { useEffect } from 'react'
import { fetchUserResumes } from '../redux/slices/myresumes'
import useDraftResume from '../hooks/useDraftResume'

const ResumeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
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
  const completedUnsignedResumes = unsigned.filter(resume => isCompletedUnsigned(resume))
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

      {/* Render Completed but Unsigned Resumes */}
      {completedUnsignedResumes.length > 0 && (
        <>
          <Typography variant='h6' sx={{ color: '#2E2E48', fontWeight: 600, mt: 2 }}>
            Completed Resumes
          </Typography>
          {completedUnsignedResumes.map(resume => (
            <ResumeCard
              key={resume.id}
              id={resume.id}
              title={resume?.content?.contact?.fullName?.split('.')[0]}
              date={new Date().toLocaleDateString()}
              credentials={0}
              isDraft={false} // Not a draft, but unsigned
              resume={resume}
              hasLocalChanges={hasLocalDraft(resume.id)}
              localDraftTime={localDrafts[resume.id]?.localStorageLastUpdated || null}
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
              title={resume?.content?.contact?.fullName?.split('.')[0]}
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
