import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { GoogleDriveStorage, Resume as ResumeManager } from '@cooperation/vc-storage'
import { getLocalStorage } from '../../tools/cookie'

// Define Resume Types
interface IssuerInfo {
  id: string
  name: string
  type: 'organization' | 'institution' | 'individual'
  verificationURL?: string
  logo?: string
}

interface VerificationCredential {
  vcId?: string
  vcDid?: string
  issuer: IssuerInfo
  dateVerified: string
  expiryDate?: string
  status: 'valid' | 'expired' | 'revoked'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface VerifiableItem {
  id: string
  verificationStatus: 'unverified' | 'pending' | 'verified'
  verifiedCredentials?: VerificationCredential[]
  isVisible?: boolean
}

interface Contact {
  fullName: string
  email: string
  phone?: string
  location?: {
    city: string
    state?: string
    country: string
  }
  socialLinks?: {
    linkedin?: string
    github?: string
    portfolio?: string
    twitter?: string
  }
}

interface Resume {
  fullName: string
  id: string
  lastUpdated: string
  name: string
  version?: number
  contact: Contact
  summary: string
  content: {
    issuanceDate: string | number | Date
    credentialSubject: any
    contact: any
    resume: any
  }
}

// Define State
interface ResumeState {
  signed: Resume[]
  unsigned: Resume[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ResumeState = {
  signed: [],
  unsigned: [],
  status: 'idle',
  error: null
}

// ✅ Fetch Resumes (Signed & Unsigned)
export const fetchUserResumes = createAsyncThunk('resume/fetchUserResumes', async () => {
  const accessToken = getLocalStorage('auth')
  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const storage = new GoogleDriveStorage(accessToken)
  const resumeManager = new ResumeManager(storage)

  const resumeVCs = await resumeManager.getSignedResumes()
  console.log(resumeVCs)

  const resumeSessions = await resumeManager.getNonSignedResumes()

  return {
    signed: resumeVCs,
    unsigned: resumeSessions
  }
})

// Redux Slice
const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // ✅ Add a new resume
    addResume: (
      state,
      action: PayloadAction<{ resume: Resume; type: 'signed' | 'unsigned' }>
    ) => {
      state[action.payload.type].push(action.payload.resume)
    },

    // ✅ Update Resume Title (Root + Nested)
    updateTitle: (
      state,
      action: PayloadAction<{ id: string; newTitle: string; type: 'signed' | 'unsigned' }>
    ) => {
      const { id, newTitle, type } = action.payload
      state[type] = state[type].map(resume =>
        resume.id === id
          ? {
              ...resume,
              name: `${newTitle}.json`, // ✅ Rename Google Drive File
              content: {
                ...resume.content,
                resume: {
                  ...resume.content.resume,
                  title: undefined // ❌ Remove Title from JSON
                }
              }
            }
          : resume
      )
    },
    // ✅ Duplicate Resume (with new ID and updated title)
    duplicateResume: (
      state,
      action: PayloadAction<{ id: string; type: 'signed' | 'unsigned' }>
    ) => {
      const { id, type } = action.payload
      const resumeToDuplicate = state[type].find(resume => resume.id === id)

      if (resumeToDuplicate) {
        const newResume = {
          ...JSON.parse(JSON.stringify(resumeToDuplicate)), // Deep clone
          id: `${resumeToDuplicate.id}`,
          content: {
            ...resumeToDuplicate.content,
            resume: {
              ...resumeToDuplicate.content,
              title: `${resumeToDuplicate?.content?.contact}`
            }
          }
        }
        state[type].push(newResume)
      }
    },

    // ✅ Delete Resume
    deleteResume: (
      state,
      action: PayloadAction<{ id: string; type: 'signed' | 'unsigned' }>
    ) => {
      const { id, type } = action.payload
      state[type] = state[type].filter(resume => resume.id !== id)
    }
  },

  extraReducers: builder => {
    builder
      .addCase(fetchUserResumes.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchUserResumes.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.signed = action.payload.signed
        state.unsigned = action.payload.unsigned
      })
      .addCase(fetchUserResumes.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch resumes'
      })
  }
})

// Export actions
export const { addResume, updateTitle, duplicateResume, deleteResume } =
  resumeSlice.actions

// Export reducer
export default resumeSlice.reducer
