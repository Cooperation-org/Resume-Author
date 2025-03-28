export function adaptGoogleDriveDataToEditor(rawData: any): Resume {
  const isVC = !!rawData?.credentialSubject

  if (isVC) {
    const vc = rawData
    const subject = vc.credentialSubject || {}
    const person = subject.person || {}
    const contact = person.contact || {}

    return {
      id: vc.id || '',
      lastUpdated: vc.issuanceDate || new Date().toISOString(),
      name: person.name?.formattedName || 'Untitled Resume',
      version: 1,

      contact: {
        fullName: contact.fullName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        location: {
          street: contact.location?.street || '',
          city: contact.location?.city || '',
          state: contact.location?.state || '',
          country: contact.location?.country || '',
          postalCode: contact.location?.postalCode || ''
        },
        socialLinks: {
          linkedin: contact.socialLinks?.linkedin || '',
          github: contact.socialLinks?.github || '',
          portfolio: contact.socialLinks?.portfolio || '',

          instagram: contact.socialLinks?.twitter || ''
        }
      },

      summary: subject.narrative?.text || '',

      experience: {
        items: [...(subject.employmentHistory || []), ...(subject.experience || [])].map(
          (exp: any) => ({
            id: '',
            title: exp.title || '',
            company: exp.company || '',
            position: exp.title || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            description: exp.description || '',
            achievements: [],
            currentlyEmployed: exp.stillEmployed || false,
            duration: '',
            showDuration: false,
            verificationStatus: 'unverified',
            credentialLink: ''
          })
        )
      },

      education: {
        items: (subject.educationAndLearning || []).map((edu: any) => ({
          id: '',
          type: edu.degree || '',
          programName: edu.fieldOfStudy || '',
          degree: edu.degree || '',
          field: edu.fieldOfStudy || '',
          institution: edu.institution || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          currentlyEnrolled: false,
          inProgress: false,
          description: edu.description || '',
          showDuration: false,
          duration: '',
          awardEarned: false,
          verificationStatus: 'unverified',
          credentialLink: ''
        }))
      },

      skills: {
        items: (subject.skills || []).map((skill: any) => ({
          id: '',
          skills: skill.name || '',
          verificationStatus: 'unverified',
          credentialLink: ''
        }))
      },

      awards: {
        items: (subject.awards || []).map((award: any) => ({
          id: '',
          title: award.title || '',
          description: award.description || '',
          issuer: award.issuer || '',
          date: award.date || '',
          verificationStatus: 'unverified',
          credentialLink: ''
        }))
      },

      publications: {
        items: (subject.publications || []).map((pub: any) => ({
          id: '',
          title: pub.title || '',
          publisher: pub.publisher || '',
          publishedDate: pub.date || '',
          url: pub.url || '',
          type: 'Other',
          authors: [],
          verificationStatus: 'unverified',
          credentialLink: ''
        }))
      },

      certifications: {
        items: (subject.certifications || []).map((cert: any) => ({
          id: '',
          name: cert.name || '',
          issuer: cert.issuer || '',
          issueDate: cert.date || '',
          expiryDate: '',
          credentialId: '',
          verificationStatus: 'unverified',
          noExpiration: false,
          credentialLink: cert.url || ''
        }))
      },

      professionalAffiliations: {
        items: (subject.professionalAffiliations || []).map((aff: any) => ({
          id: '',
          name: aff.role || '',
          organization: aff.organization || '',
          startDate: aff.startDate || '',
          endDate: aff.endDate || '',
          activeAffiliation: false,
          showDuration: false,
          verificationStatus: 'unverified',
          credentialLink: ''
        }))
      },

      volunteerWork: {
        items: (subject.volunteerWork || []).map((vol: any) => ({
          id: '',
          role: vol.role || '',
          organization: vol.organization || '',
          startDate: vol.startDate || '',
          endDate: vol.endDate || '',
          description: vol.description || '',
          currentlyVolunteering: false,
          duration: '',
          showDuration: false,
          verificationStatus: 'unverified',
          location: vol.location || '',
          cause: vol.cause || '',
          credentialLink: ''
        }))
      },

      hobbiesAndInterests: subject.hobbiesAndInterests || [],

      languages: {
        items: (subject.languages || []).map((lang: any) => ({
          id: '',
          name: lang.language || '',
          proficiency: lang.proficiency || '',
          verificationStatus: 'unverified',
          certification: lang.certification || '',
          writingLevel: lang.writingLevel || '',
          speakingLevel: lang.speakingLevel || '',
          readingLevel: lang.readingLevel || ''
        }))
      },

      testimonials: {
        items: subject.testimonials || []
      },

      projects: {
        items: (subject.projects || []).map((proj: any) => ({
          id: '',
          name: proj.name || '',
          description: proj.description || '',
          url: proj.url || '',
          verificationStatus: 'unverified',
          technologies: proj.technologies || [],
          credentialLink: proj.credentialLink || ''
        }))
      }
    }
  }

  return {
    id: rawData.id || '',
    lastUpdated: rawData.lastUpdated || new Date().toISOString(),
    name: rawData.name || 'Untitled Resume',
    version: rawData.version || 1,

    contact: {
      fullName: rawData.contact?.fullName || '',
      email: rawData.contact?.email || '',
      phone: rawData.contact?.phone || '',
      location: {
        street: rawData.contact?.location?.street || '',
        city: rawData.contact?.location?.city || '',
        state: rawData.contact?.location?.state || '',
        country: rawData.contact?.location?.country || '',
        postalCode: rawData.contact?.location?.postalCode || ''
      },
      socialLinks: {
        linkedin: rawData.contact?.socialLinks?.linkedin || '',
        github: rawData.contact?.socialLinks?.github || '',
        portfolio: rawData.contact?.socialLinks?.portfolio || '',
        instagram: rawData.contact?.socialLinks?.instagram || ''
      }
    },

    summary: rawData.summary || '',

    experience: {
      items: rawData.experience?.items || []
    },

    education: {
      items: rawData.education?.items || []
    },

    skills: {
      items: rawData.skills?.items || []
    },

    awards: {
      items: rawData.awards?.items || []
    },

    publications: {
      items: rawData.publications?.items || []
    },

    certifications: {
      items: rawData.certifications?.items || []
    },

    professionalAffiliations: {
      items: rawData.professionalAffiliations?.items || []
    },

    volunteerWork: {
      items: rawData.volunteerWork?.items || []
    },

    hobbiesAndInterests: rawData.hobbiesAndInterests || [],

    languages: {
      items: rawData.languages?.items || []
    },

    testimonials: {
      items: rawData.testimonials?.items || []
    },

    projects: {
      items: rawData.projects?.items || []
    }
  }
}
