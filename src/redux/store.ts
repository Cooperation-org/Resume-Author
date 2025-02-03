// redux/store.ts
import { configureStore } from '@reduxjs/toolkit'
import resumeReducer from './slices/resume'
import vcSlice from './slices/vc'
import resumesReducer from './slices/myresumes'

const store = configureStore({
  reducer: {
    resume: resumeReducer,
    vcReducer: vcSlice,
    resumeReducer: resumeReducer,
    myresumes: resumesReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
