/**
 * Adapter to transform resume data to make it compatible with the resumeVC.sign function
 * This ensures all data is properly preserved during the signing process
 */
export const prepareResumeForVC = (
  resume: Resume | null,
  sectionEvidence?: Record<string, string[][]>,
  allFiles?: any[]
): any => {
  if (!resume) {
    console.error('Cannot prepare null resume for VC')
    return null
  }

  const preparedResume = JSON.parse(JSON.stringify(resume))

  // Add evidence/files data if provided
  if (sectionEvidence && allFiles) {
    // Convert file IDs to actual Google Drive URLs for saving
    const evidenceWithUrls: Record<string, string[][]> = {}

    Object.keys(sectionEvidence).forEach(sectionId => {
      const sectionFiles = sectionEvidence[sectionId]
      evidenceWithUrls[sectionId] = sectionFiles.map(itemFiles =>
        itemFiles.map(fileId => {
          const file = allFiles.find(f => f.id === fileId)
          if (file?.googleId) {
            return `https://drive.google.com/uc?export=view&id=${file.googleId}`
          } else if (file?.url) {
            return file.url
          }
          return fileId
        })
      )
    })

    preparedResume.evidence = evidenceWithUrls
    console.log('Converting evidence IDs to URLs:', {
      originalEvidence: sectionEvidence,
      convertedEvidence: evidenceWithUrls,
      availableFiles: allFiles.length
    })
  }

  if (preparedResume.languages?.items) {
    preparedResume.languages.items = preparedResume.languages.items.map((lang: any) => ({
      language: lang.name ?? '',
      proficiency: lang.proficiency ?? '',
      ...lang
    }))
  }

  if (preparedResume.skills?.items) {
    preparedResume.skills.items = preparedResume.skills.items.map((skill: any) => {
      let skillName = skill.skills
      try {
        if (skillName?.includes('<')) {
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = skillName
          skillName = tempDiv.textContent ?? tempDiv.innerText ?? ''
        }
      } catch (e) {
        console.warn('Error parsing skill HTML:', e)
      }

      return {
        name: skillName ?? '',
        originalSkills: skill.skills,
        ...skill
      }
    })
  }

  if (preparedResume.experience?.items) {
    preparedResume.experience.items = preparedResume.experience.items.map((exp: any) => ({
      ...exp,
      stillEmployed: exp.currentlyEmployed ?? false,
      title: exp.title ?? exp.position ?? '',
      company: exp.company ?? ''
    }))
  }

  if (preparedResume.education?.items) {
    preparedResume.education.items = preparedResume.education.items.map((edu: any) => ({
      ...edu,
      degree: edu.degree ?? edu.type ?? '',
      fieldOfStudy: edu.field ?? edu.fieldOfStudy ?? ''
    }))
  }

  if (preparedResume.certifications?.items) {
    preparedResume.certifications.items = preparedResume.certifications.items.map(
      (cert: any) => ({
        ...cert,
        date: cert.issueDate ?? cert.date ?? '',
        url: cert.credentialLink ?? cert.url ?? ''
      })
    )
  }

  if (preparedResume.professionalAffiliations?.items) {
    preparedResume.professionalAffiliations.items =
      preparedResume.professionalAffiliations.items.map((aff: any) => ({
        ...aff,
        role: aff.role ?? aff.name ?? ''
      }))
  }

  if (preparedResume.projects?.items) {
    preparedResume.projects.items = preparedResume.projects.items.map((proj: any) => ({
      ...proj,
      startDate: proj.startDate ?? '',
      endDate: proj.endDate ?? ''
    }))
  }

  if (preparedResume.awards?.items) {
    preparedResume.awards.items = preparedResume.awards.items.map((award: any) => ({
      title: award.title ?? '',
      issuer: award.issuer ?? '',
      date: award.date ?? award.issueDate ?? '',
      description: award.description ?? '',
      ...award
    }))
  }

  if (preparedResume.publications?.items) {
    preparedResume.publications.items = preparedResume.publications.items.map(
      (pub: any) => ({
        title: pub.title ?? '',
        publisher: pub.publisher ?? '',
        date: pub.date ?? pub.publishedDate ?? '',
        url: pub.url ?? '',
        ...pub
      })
    )
  }

  if (preparedResume.volunteerWork?.items) {
    preparedResume.volunteerWork.items = preparedResume.volunteerWork.items.map(
      (vol: any) => ({
        ...vol,
        role: vol.role ?? ''
      })
    )
  }

  if (
    preparedResume.hobbiesAndInterests &&
    !Array.isArray(preparedResume.hobbiesAndInterests)
  ) {
    preparedResume.hobbiesAndInterests = []
  }

  if (preparedResume.testimonials?.items) {
    preparedResume.testimonials.items = preparedResume.testimonials.items.map(
      (test: any) => ({
        ...test,
        author: test.author ?? '',
        text: test.text ?? ''
      })
    )
  }

  if (preparedResume.contact?.socialLinks) {
    const links = preparedResume.contact.socialLinks

    if (!links.twitter && links.instagram) {
      links.twitter = links.instagram
    }
  }

  return preparedResume
}

/**
 * Transform the VC format back to the Resume format for UI display
 */
export const transformVCToResume = (vc: any): Resume => {
  if (!vc?.credentialSubject) {
    throw new Error('Invalid VC format')
  }

  const subject = vc.credentialSubject
  const person = subject.person ?? {}
  const contact = person.contact ?? {}

  const resume: Partial<Resume> = {
    id: vc.id ?? '',
    lastUpdated: vc.issuanceDate ?? new Date().toISOString(),
    name: person.name?.formattedName ?? 'Untitled Resume',
    version: 1,

    contact: {
      fullName: contact.fullName ?? '',
      email: contact.email ?? '',
      phone: contact.phone ?? '',
      location: {
        street: contact.location?.street ?? '',
        city: contact.location?.city ?? '',
        state: contact.location?.state ?? '',
        country: contact.location?.country ?? '',
        postalCode: contact.location?.postalCode ?? ''
      },
      socialLinks: {
        linkedin: contact.socialLinks?.linkedin ?? '',
        github: contact.socialLinks?.github ?? '',
        portfolio: contact.socialLinks?.portfolio ?? '',
        instagram: contact.socialLinks?.instagram ?? ''
      }
    },

    summary: subject.narrative?.text ?? '',

    experience: {
      items: (subject.experience ?? []).map((exp: any) => ({
        title: exp.title ?? '',
        company: exp.company ?? '',
        duration: exp.duration ?? '',
        currentlyEmployed: exp.stillEmployed ?? false,
        description: exp.description ?? '',
        position: exp.title ?? '',
        startDate: exp.startDate ?? '',
        id: '',
        verificationStatus: 'unverified',
        credentialLink: ''
      }))
    },

    education: {
      items: (subject.educationAndLearning ?? []).map((edu: any) => ({
        type: edu.degree ?? '',
        programName: edu.fieldOfStudy ?? '',
        institution: edu.institution ?? '',
        duration: '',
        currentlyEnrolled: false,
        inProgress: false,
        awardEarned: true,
        description: '',
        id: '',
        verificationStatus: 'unverified',
        credentialLink: '',
        selectedCredentials: [],
        degree: edu.degree ?? '',
        field: edu.fieldOfStudy ?? '',
        startDate: edu.startDate ?? '',
        endDate: edu.endDate ?? ''
      }))
    },

    skills: {
      items: (subject.skills ?? []).map((skill: any) => ({
        skills: skill.originalSkills ?? `<p>${skill.name ?? ''}</p>`,
        id: '',
        verificationStatus: 'unverified',
        credentialLink: ''
      }))
    },

    awards: {
      items: (subject.awards ?? []).map((award: any) => ({
        title: award.title ?? '',
        issuer: award.issuer ?? '',
        date: award.date ?? '',
        description: award.description ?? '',
        id: '',
        verificationStatus: 'unverified',
        credentialLink: ''
      }))
    },

    publications: {
      items: (subject.publications ?? []).map((pub: any) => ({
        title: pub.title ?? '',
        publisher: pub.publisher ?? '',
        publishedDate: pub.date ?? '',
        url: pub.url ?? '',
        id: '',
        verificationStatus: 'unverified',
        credentialLink: '',
        authors: []
      }))
    },

    certifications: {
      items: (subject.certifications ?? []).map((cert: any) => ({
        name: cert.name ?? '',
        issuer: cert.issuer ?? '',
        issueDate: cert.date ?? '',
        expiryDate: '',
        credentialId: '',
        noExpiration: false,
        id: '',
        verificationStatus: 'unverified',
        credentialLink: cert.url ?? ''
      }))
    },

    professionalAffiliations: {
      items: (subject.professionalAffiliations ?? []).map((aff: any) => ({
        name: aff.role ?? '',
        organization: aff.organization ?? '',
        startDate: aff.startDate ?? '',
        endDate: aff.endDate ?? '',
        activeAffiliation: false,
        id: '',
        verificationStatus: 'unverified',
        credentialLink: ''
      }))
    },

    volunteerWork: {
      items: (subject.volunteerWork ?? []).map((vol: any) => ({
        role: vol.role ?? '',
        organization: vol.organization ?? '',
        location: '',
        startDate: vol.startDate ?? '',
        endDate: vol.endDate ?? '',
        currentlyVolunteering: false,
        description: vol.description ?? '',
        duration: '',
        id: '',
        verificationStatus: 'unverified',
        credentialLink: ''
      }))
    },

    hobbiesAndInterests: subject.hobbiesAndInterests ?? [],

    languages: {
      items: (subject.languages ?? []).map((lang: any) => ({
        name: lang.language ?? '',
        proficiency: lang.proficiency ?? ''
      }))
    },

    testimonials: {
      items: (subject.testimonials ?? []).map((test: any) => ({
        author: test.author ?? '',
        text: test.text ?? '',
        id: '',
        verificationStatus: 'unverified',
        credentialLink: ''
      }))
    },

    projects: {
      items: (subject.projects ?? []).map((proj: any) => ({
        name: proj.name ?? '',
        description: proj.description ?? '',
        url: proj.url ?? '',
        id: '',
        verificationStatus: 'unverified',
        credentialLink: '',
        technologies: []
      }))
    }
  }

  return resume as Resume
}

/**
 * Transforms a resume from the VC schema to the editor schema
 */
export const transformVCToEditorSchema = (resume: any): any => {
  if (!resume) return null

  const transformed = {
    id: resume.id || '',
    fullName: resume.credentialSubject?.person?.name?.formattedName || 'Untitled',
    lastUpdated: new Date().toISOString(),
    name: resume.credentialSubject?.person?.name?.formattedName || 'Untitled',
    version: 1,
    contact: {
      fullName: resume.credentialSubject?.person?.contact?.fullName || '',
      email: resume.credentialSubject?.person?.contact?.email || '',
      phone: resume.credentialSubject?.person?.contact?.phone || '',
      location: {
        street: resume.credentialSubject?.person?.contact?.location?.street || '',
        city: resume.credentialSubject?.person?.contact?.location?.city || '',
        state: resume.credentialSubject?.person?.contact?.location?.state || '',
        country: resume.credentialSubject?.person?.contact?.location?.country || '',
        postalCode: resume.credentialSubject?.person?.contact?.location?.postalCode || ''
      },
      socialLinks: {
        linkedin: resume.credentialSubject?.person?.contact?.socialLinks?.linkedin || '',
        github: resume.credentialSubject?.person?.contact?.socialLinks?.github || '',
        portfolio:
          resume.credentialSubject?.person?.contact?.socialLinks?.portfolio || '',
        instagram: resume.credentialSubject?.person?.contact?.socialLinks?.instagram || ''
      }
    },
    summary: resume.credentialSubject?.narrative?.text || '',
    experience: {
      items: Array.isArray(resume.credentialSubject?.experience)
        ? resume.credentialSubject.experience.map((exp: any) => ({
            title: exp.title || '',
            company: exp.company || '',
            duration: exp.duration || '',
            currentlyEmployed: exp.stillEmployed || false,
            description: exp.description || '',
            showDuration: true,
            position: exp.position || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            achievements: [],
            id: '',
            verificationStatus: 'unverified',
            credentialLink: '',
            selectedCredentials: []
          }))
        : []
    },
    education: {
      items: Array.isArray(resume.credentialSubject?.educationAndLearning)
        ? resume.credentialSubject.educationAndLearning.map((edu: any) => ({
            type: edu.degree || 'Bachelors',
            programName: edu.fieldOfStudy || '',
            institution: edu.institution || '',
            duration: edu.duration || '1 year',
            showDuration: false,
            currentlyEnrolled: false,
            inProgress: false,
            awardEarned: false,
            description: edu.description || '',
            id: '',
            verificationStatus: 'unverified',
            credentialLink: '',
            selectedCredentials: [],
            degree: edu.degree || '',
            field: edu.fieldOfStudy || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || ''
          }))
        : []
    },
    skills: {
      items: Array.isArray(resume.credentialSubject?.skills)
        ? resume.credentialSubject.skills.map((skill: any) => ({
            skills: skill.name || '',
            id: '',
            verificationStatus: 'unverified',
            credentialLink: '',
            selectedCredentials: []
          }))
        : []
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
      items: Array.isArray(resume.credentialSubject?.professionalAffiliations)
        ? resume.credentialSubject.professionalAffiliations.map((aff: any) => ({
            name: aff.role || '',
            organization: aff.organization || '',
            startDate: aff.startDate || '',
            endDate: aff.endDate || '',
            showDuration: false,
            activeAffiliation: false,
            id: '',
            verificationStatus: 'unverified',
            credentialLink: '',
            duration: '',
            selectedCredentials: []
          }))
        : []
    },
    volunteerWork: {
      items: []
    },
    hobbiesAndInterests: Array.isArray(resume.credentialSubject?.hobbiesAndInterests)
      ? resume.credentialSubject.hobbiesAndInterests
      : [],
    languages: {
      items: Array.isArray(resume.credentialSubject?.languages)
        ? resume.credentialSubject.languages.map((lang: any) => ({
            name: lang.language || ''
          }))
        : []
    },
    testimonials: {
      items: []
    },
    projects: {
      items: []
    },
    content: resume
  }

  return transformed
}

/**
 * Transforms a resume from the editor schema to the VC schema
 */
export const transformEditorToVCSchema = (resume: any): any => {
  if (!resume) return null

  const transformed = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      {
        '@vocab': 'https://schema.hropenstandards.org/4.4/',
        name: 'https://schema.org/name',
        formattedName: 'https://schema.org/formattedName',
        primaryLanguage: 'https://schema.org/primaryLanguage',
        narrative: 'https://schema.org/narrative',
        text: 'https://schema.org/text',
        contact: 'https://schema.org/ContactPoint',
        email: 'https://schema.org/email',
        phone: 'https://schema.org/telephone',
        location: 'https://schema.org/address',
        street: 'https://schema.org/streetAddress',
        city: 'https://schema.org/addressLocality',
        state: 'https://schema.org/addressRegion',
        country: 'https://schema.org/addressCountry',
        postalCode: 'https://schema.org/postalCode',
        socialLinks: {
          '@id': 'https://schema.org/URL',
          '@container': '@set'
        },
        linkedin: 'https://schema.org/sameAs',
        github: 'https://schema.org/sameAs',
        portfolio: 'https://schema.org/url',
        twitter: 'https://schema.org/sameAs',
        experience: {
          '@id': 'https://schema.org/WorkExperience',
          '@container': '@list'
        },
        employmentHistory: {
          '@id': 'https://schema.org/employmentHistory',
          '@container': '@list'
        },
        company: 'https://schema.org/worksFor',
        position: 'https://schema.org/jobTitle',
        description: 'https://schema.org/description',
        startDate: 'https://schema.org/startDate',
        endDate: 'https://schema.org/endDate',
        stillEmployed: 'https://schema.org/Boolean',
        duration: 'https://schema.org/temporalCoverage',
        skills: {
          '@id': 'https://schema.org/skills',
          '@container': '@list'
        },
        educationAndLearning: {
          '@id': 'https://schema.org/EducationalOccupationalProgram',
          '@container': '@list'
        },
        degree: 'https://schema.org/educationalCredentialAwarded',
        fieldOfStudy: 'https://schema.org/studyField',
        institution: 'https://schema.org/educationalInstitution',
        year: 'https://schema.org/year',
        awards: {
          '@id': 'https://schema.org/Achievement',
          '@container': '@list'
        },
        title: 'https://schema.org/name',
        issuer: 'https://schema.org/issuer',
        date: 'https://schema.org/dateReceived',
        publications: {
          '@id': 'https://schema.org/CreativeWork',
          '@container': '@list'
        },
        publisher: 'https://schema.org/publisher',
        url: 'https://schema.org/url',
        certifications: {
          '@id': 'https://schema.org/EducationalOccupationalCredential',
          '@container': '@list'
        },
        professionalAffiliations: {
          '@id': 'https://schema.org/OrganizationRole',
          '@container': '@list'
        },
        organization: 'https://schema.org/memberOf',
        role: 'https://schema.org/jobTitle',
        volunteerWork: {
          '@id': 'https://schema.org/VolunteerRole',
          '@container': '@list'
        },
        hobbiesAndInterests: {
          '@id': 'https://schema.org/knowsAbout',
          '@container': '@set'
        },
        languages: {
          '@id': 'https://schema.org/knowsLanguage',
          '@container': '@list'
        },
        language: 'https://schema.org/inLanguage',
        proficiency: 'https://schema.org/proficiencyLevel',
        testimonials: {
          '@id': 'https://schema.org/Review',
          '@container': '@list'
        },
        author: 'https://schema.org/author',
        projects: {
          '@id': 'https://schema.org/Project',
          '@container': '@list'
        },
        issuanceDate: 'https://schema.org/issuanceDate',
        credentialSubject: 'https://schema.org/credentialSubject',
        person: 'https://schema.org/Person',
        Resume: 'https://schema.hropenstandards.org/4.4#Resume'
      },
      'https://w3id.org/security/suites/ed25519-2020/v1'
    ],
    id: `urn:uuid:${crypto.randomUUID()}`,
    type: ['VerifiableCredential', 'LERRSCredential'],
    issuer: 'did:key:z6MkpF19yNE48GbT7YcaCMjrLdBtcaSZY3NRq25bniMcctd3',
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      type: 'Resume',
      person: {
        name: {
          formattedName: resume.contact?.fullName || ''
        },
        primaryLanguage: 'en',
        contact: {
          fullName: resume.contact?.fullName || '',
          email: resume.contact?.email || '',
          phone: resume.contact?.phone || '',
          location: {
            street: resume.contact?.location?.street || '',
            city: resume.contact?.location?.city || '',
            state: resume.contact?.location?.state || '',
            country: resume.contact?.location?.country || '',
            postalCode: resume.contact?.location?.postalCode || ''
          },
          socialLinks: {
            linkedin: resume.contact?.socialLinks?.linkedin || '',
            github: resume.contact?.socialLinks?.github || '',
            portfolio: resume.contact?.socialLinks?.portfolio || '',
            twitter: resume.contact?.socialLinks?.instagram || ''
          }
        }
      },
      narrative: {
        text: resume.summary || ''
      },
      experience: Array.isArray(resume.experience?.items)
        ? resume.experience.items.map((exp: any) => ({
            company: exp.company || '',
            title: exp.title || '',
            description: exp.description || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            stillEmployed: exp.currentlyEmployed || false
          }))
        : [],
      skills: Array.isArray(resume.skills?.items)
        ? resume.skills.items.map((skill: any) => ({
            name: skill.skills || ''
          }))
        : [],
      educationAndLearning: Array.isArray(resume.education?.items)
        ? resume.education.items.map((edu: any) => ({
            institution: edu.institution || '',
            degree: edu.degree || '',
            fieldOfStudy: edu.field || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || ''
          }))
        : [],
      awards: [],
      publications: [],
      certifications: [],
      professionalAffiliations: Array.isArray(resume.professionalAffiliations?.items)
        ? resume.professionalAffiliations.items.map((aff: any) => ({
            organization: aff.organization || '',
            role: aff.name || '',
            startDate: aff.startDate || '',
            endDate: aff.endDate || ''
          }))
        : [],
      volunteerWork: [],
      hobbiesAndInterests: Array.isArray(resume.hobbiesAndInterests)
        ? resume.hobbiesAndInterests
        : [],
      languages: Array.isArray(resume.languages?.items)
        ? resume.languages.items.map((lang: any) => ({
            language: lang.name || '',
            proficiency: ''
          }))
        : [],
      testimonials: [],
      projects: []
    }
  }

  return transformed
}
