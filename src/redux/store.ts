// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './slices/resume';

const store = configureStore({
  reducer: {
    resume: resumeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
