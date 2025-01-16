// redux/store.ts
import { configureStore } from '@reduxjs/toolkit'
import resumeReducer from './slices/resume'
import vcSlice from './slices/vc'

const store = configureStore({
  reducer: {
    resume: resumeReducer,
    vcReducer: vcSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
