import { GoogleDriveStorage, Resume } from '@cooperation/vc-storage'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCookie, getLocalStorage } from '../../tools/cookie'

interface ResumeData {
  id: string
  name: string
  content: {
    resume: {
      id: string
      lastUpdated: string
      contact: {
        fullName: string
      }
    }
  }
}

interface VCState {
  accessToken: string | null
  vcs: any[] // Adjust the type based on your VC structure
  resumes: {
    signed: ResumeData[]
    unsigned: ResumeData[]
  }
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: VCState = {
  accessToken: null,
  vcs: [],
  resumes: {
    signed: [],
    unsigned: []
  },
  status: 'idle',
  error: null
}

// Async thunk to fetch VCs
export const fetchVCs = createAsyncThunk('vc/fetchVCs', async () => {
  const accessToken = getLocalStorage('auth')
  if (!accessToken) {
    console.error('Access token not found')
    throw new Error('Access token not found')
  }

  const storage = new GoogleDriveStorage(accessToken as string)
  const claimsData: any[] = await storage.getAllFilesByType('VCs')
  const vcs = claimsData.map((file: any[]) =>
    file.filter((f: { name: string }) => f.name !== 'RELATIONS')
  )
  // Filter out files where `name` is "RELATIONS"
  return claimsData.map((file: any[]) =>
    file.filter((f: { name: string }) => f.name !== 'RELATIONS')
  )
})

// Async thunk to fetch resumes
export const fetchUserResumes = createAsyncThunk('vc/fetchUserResumes', async () => {
  const accessToken = getCookie('auth_token')
  if (!accessToken) {
    console.error('Access token not found')
    throw new Error('Access token not found')
  }

  const storage = new GoogleDriveStorage(accessToken)
  const resumeManager = new Resume(storage)

  const resumeVCs = await resumeManager.getSignedResumes()
  const resumeSessions = await resumeManager.getNonSignedResumes()

  return {
    signed: resumeVCs,
    unsigned: resumeSessions
  }
})

const vcSlice = createSlice({
  name: 'vc',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
    clearVCs: state => {
      state.vcs = []
    },
    clearResumes: state => {
      state.resumes = {
        signed: [],
        unsigned: []
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchVCs.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchVCs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.vcs = action.payload
      })
      .addCase(fetchVCs.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch VCs'
      })
      .addCase(fetchUserResumes.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchUserResumes.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.resumes = action.payload
      })
      .addCase(fetchUserResumes.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch resumes'
      })
  }
})

export const { setAccessToken, clearVCs, clearResumes } = vcSlice.actions

export default vcSlice.reducer
