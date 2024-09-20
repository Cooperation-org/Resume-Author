import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Skill } from '../../types/resume.d';

interface SkillsState {
  skills: Skill[];
}

const initialState: SkillsState = {
  skills: [],
};

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.skills.push(action.payload);
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter(skill => skill.id !== action.payload);
    },
    updateSkill: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const index = state.skills.findIndex(
        skill => skill.id === action.payload.id
      );
      if (index !== -1) {
        state.skills[index].name = action.payload.name;
      }
    },
  },
});

export const { addSkill, removeSkill, updateSkill } = skillsSlice.actions;
export default skillsSlice.reducer;
