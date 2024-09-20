// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import skillsReducer from './slices/skillsSlice';
// Import other slices for experience, education, etc.

const store = configureStore({
  reducer: {
    skills: skillsReducer,
    // Add other slices: experienceReducer, educationReducer, etc.
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
