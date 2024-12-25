import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { initialState } from '../../initialResumeState'
import { SectionId } from '../../types/resumeTypes'

export interface ResumeState {
  resume: Resume | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  activeSection: string | null // tracks the section currently being edited.
  highlightedText: string | null // tracks the text highlighted by the user.
  pendingVerifications: string[] // tracks the credentials pending verification.
  selectedCredentials: string[] // tracks the credentials selected for linking to a section.
  isDirty: boolean // tracks whether the resume has unsaved changes.
  sectionVisibility: { [key: string]: boolean } // tracks the visibility of each section.
}

export const fetchResume = createAsyncThunk(
  'resume/fetchResume',
  async (resumeId: string) => {
    // get the resume from Google drive if it exists
    return {} as Resume
  }
)

export const saveResume = createAsyncThunk(
  'resume/saveResume',
  async (resume: Resume) => {
    // save the resume to Google drive
    return resume
  }
)

export const linkCredential = createAsyncThunk(
  'resume/linkCredential',
  async ({
    resumeId,
    workExperienceId,
    credential
  }: {
    resumeId: string
    workExperienceId: string
    credential: VerificationCredential
  }) => {
    return { resumeId, workExperienceId, credential }
  }
)

//  Payload Types
type UpdateSectionPayload = {
  sectionId: SectionId
  content: any
}
interface AddExperiencePayload extends WorkExperience {}
interface UpdateExperiencePayload {
  id: string
  experience: WorkExperience
}
interface DeleteExperiencePayload {
  id: string
}
type ReorderExperiencesPayload = WorkExperience[]

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<string | null>) => {
      state.activeSection = action.payload
    },
    setHighlightedText: (state, action: PayloadAction<string | null>) => {
      state.highlightedText = action.payload
    },
    updateSection: (state, action: PayloadAction<UpdateSectionPayload>) => {
      if (!state.resume) return

      const { sectionId, content } = action.payload

      switch (sectionId) {
        case 'summary':
          state.resume.summary = content
          break
        case 'contact':
          state.resume.contact = content
          break
        case 'experience':
          state.resume.experience.items = content.items
          break
        case 'education':
          state.resume.education.items = content.items
          break
        case 'skills':
          state.resume.skills.items = content.items
          break
        // Otherwise, directly update the section
        case 'hobbiesAndInterests':
          state.resume.hobbiesAndInterests = content
          break
        default:
          console.warn(`Unhandled sectionId: ${sectionId}`)
      }
      state.isDirty = true
    },

    removeSection: (state, action: PayloadAction<SectionId>) => {
      if (!state.resume) return
      const sectionId = action.payload
      if (sectionId in state.resume) {
        switch (sectionId) {
          case 'summary':
            state.resume.summary = ''
            break
          case 'contact':
            state.resume.contact = { fullName: '', email: '' }
            break
          case 'hobbiesAndInterests':
            state.resume.hobbiesAndInterests = []
            break
          default:
            ;(state.resume as any)[sectionId].items = []
        }
        state.isDirty = true
      }
    },

    addSection: (state, action: PayloadAction<{ sectionName: SectionId }>) => {
      if (!state.resume) return
      const { sectionName } = action.payload

      switch (sectionName) {
        case 'summary':
          state.resume.summary = ''
          break
        case 'contact':
          state.resume.contact = { fullName: '', email: '' }
          break
        case 'hobbiesAndInterests':
          state.resume.hobbiesAndInterests = []
          break
        case 'experience':
          state.resume.experience = { items: [] }
          break
        case 'education':
          state.resume.education = { items: [] }
          break
        case 'skills':
          state.resume.skills = { items: [] }
          break
        // ... etc.
        default:
          console.warn(`Unhandled sectionName: ${sectionName}`)
      }
      state.isDirty = true
    },

    setSectionVisibility: (
      state,
      action: PayloadAction<{ sectionId: SectionId; isVisible: boolean }>
    ) => {
      const { sectionId, isVisible } = action.payload
      state.sectionVisibility[sectionId] = isVisible
    },

    toggleSectionVisibility: (state, action: PayloadAction<SectionId>) => {
      const sectionId = action.payload
      if (state.resume && sectionId in state.resume) {
        state.sectionVisibility[sectionId] = !state.sectionVisibility[sectionId]
        state.isDirty = true
      }
    },

    selectCredential: (state, action: PayloadAction<string>) => {
      if (!state.selectedCredentials.includes(action.payload)) {
        state.selectedCredentials.push(action.payload)
      }
    },
    unselectCredential: (state, action: PayloadAction<string>) => {
      state.selectedCredentials = state.selectedCredentials.filter(
        id => id !== action.payload
      )
    },
    addPendingVerification: (state, action: PayloadAction<string>) => {
      if (!state.pendingVerifications.includes(action.payload)) {
        state.pendingVerifications.push(action.payload)
      }
    },
    removePendingVerification: (state, action: PayloadAction<string>) => {
      state.pendingVerifications = state.pendingVerifications.filter(
        id => id !== action.payload
      )
    },
    resetDirtyState: state => {
      state.isDirty = false
    },
    setSelectedResume: (state, action: PayloadAction<Resume>) => {
      state.resume = action.payload
      state.isDirty = false
    },
    addExperience: (state, action: PayloadAction<AddExperiencePayload>) => {
      if (!state.resume) return
      state.resume.experience.items.push(action.payload)
      state.isDirty = true
    },
    updateExperience: (state, action: PayloadAction<UpdateExperiencePayload>) => {
      if (!state.resume) return
      const { id, experience } = action.payload
      const idx = state.resume.experience.items.findIndex(exp => exp.id === id)
      if (idx !== -1) {
        state.resume.experience.items[idx] = experience
        state.isDirty = true
      }
    },
    deleteExperience: (state, action: PayloadAction<DeleteExperiencePayload>) => {
      if (!state.resume) return
      state.resume.experience.items = state.resume.experience.items.filter(
        exp => exp.id !== action.payload.id
      )
      state.isDirty = true
    },
    reorderExperiences: (state, action: PayloadAction<ReorderExperiencesPayload>) => {
      if (!state.resume) return
      state.resume.experience.items = action.payload
      state.isDirty = true
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchResume.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchResume.fulfilled, (state, action: PayloadAction<Resume>) => {
        state.status = 'succeeded'
        state.resume = action.payload
        state.isDirty = false
      })
      .addCase(fetchResume.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to fetch resume'
      })
      .addCase(saveResume.pending, state => {
        state.status = 'loading'
      })
      .addCase(saveResume.fulfilled, (state, action: PayloadAction<Resume>) => {
        state.status = 'succeeded'
        state.resume = action.payload
        state.isDirty = false // Reset the dirty state
      })
      .addCase(saveResume.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to save resume'
      })
      .addCase(
        linkCredential.fulfilled,
        (
          state,
          action: PayloadAction<{
            resumeId: string
            workExperienceId: string
            credential: VerificationCredential
          }>
        ) => {
          const { resumeId, workExperienceId, credential } = action.payload
          if (state.resume && state.resume.id === resumeId) {
            const targetExp = state.resume.experience.items.find(
              exp => exp.id === workExperienceId
            )
            if (targetExp) {
              if (!targetExp.verifiedCredentials) {
                targetExp.verifiedCredentials = []
              }
              targetExp.verifiedCredentials.push(credential)
              state.isDirty = true
            } else {
              console.warn(`WorkExperience with id ${workExperienceId} not found.`)
            }
          }
        }
      )
  }
})

export const {
  setActiveSection,
  setHighlightedText,
  updateSection,
  removeSection,
  setSectionVisibility,
  toggleSectionVisibility,
  selectCredential,
  unselectCredential,
  addPendingVerification,
  removePendingVerification,
  resetDirtyState,
  setSelectedResume,
  addExperience,
  updateExperience,
  deleteExperience,
  addSection,
  reorderExperiences
} = resumeSlice.actions

export default resumeSlice.reducer
