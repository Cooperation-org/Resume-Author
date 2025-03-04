import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLocalStorage } from '../../tools/cookie'

interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
}

const token = getLocalStorage('auth')

const initialState: AuthState = {
  isAuthenticated: !!token,
  accessToken: token
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.isAuthenticated = true
      state.accessToken = action.payload.accessToken
    },
    clearAuth: state => {
      state.isAuthenticated = false
      state.accessToken = null
    }
  }
})

export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
