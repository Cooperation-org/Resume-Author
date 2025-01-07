import { GoogleDriveStorage } from '@cooperation/vc-storage'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCookie } from '../../tools'

interface VCState {
  accessToken: string | null
  vcs: any[] // Adjust the type based on your VC structure
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: VCState = {
  accessToken: null,
  vcs: [],
  status: 'idle',
  error: null
}

// Async thunk to fetch VCs
export const fetchVCs = createAsyncThunk('vc/fetchVCs', async () => {
  const accessToken = getCookie('accessToken')
  if (!accessToken) {
    console.error('Access token not found')
    throw new Error('Access token not found')
  }

  const storage = new GoogleDriveStorage(accessToken as string)
  const claimsData: any[] = await storage.getAllFilesByType('VCs')

  // Filter out files where `name` is "RELATIONS"
  return claimsData.map((file: any[]) =>
    file.filter((f: { name: string }) => f.name !== 'RELATIONS')
  )
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
  }
})

export const { setAccessToken, clearVCs } = vcSlice.actions

export default vcSlice.reducer
