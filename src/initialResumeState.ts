import { ResumeState } from './redux/slices/resume'

export const initialState: ResumeState = {
  resume: {
    id: '', // Set during resume creation or loading
    lastUpdated: new Date().toISOString(),
    version: 1,
    contact: {
      fullName: '',
      email: '',
      phone: '',
      location: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      },
      socialLinks: {
        linkedin: '',
        github: '',
        portfolio: '',
        twitter: ''
      }
    },
    
    summary: '',
    experience: {
      items: []
    },
    education: {
      items: []
    },
    skills: {
      items: []
    },

    awards: {
      items: []
    },
    publications: {
      items: []
    },
    certifications: {
      items: []
    },
    professionalAffiliations: {
      items: []
    },
    volunteerWork: {
      items: []
    },
    hobbiesAndInterests: [],
    languages: {
      items: []
    },
    testimonials: {
      items: []
    }
  },
  status: 'idle',
  error: null,
  activeSection: null,
  highlightedText: null,
  pendingVerifications: [],
  isDirty: true,
  sectionVisibility: {
    summary: true,
    contact: true,
    experience: true,
    education: true,
    skills: true,
    accomplishments: true,
    awards: true,
    publications: true,
    certifications: true,
    professionalAffiliations: true,
    volunteerWork: true,
    languages: true,
    testimonials: true
  },
  selectedCredentials: [],
  claims: []
}
