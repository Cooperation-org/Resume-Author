/**
 * Adapter to transform resume data to make it compatible with the resumeVC.sign function
 * This ensures all data is properly preserved during the signing process
 */
export const prepareResumeForVC = (resume: Resume | null): any => {
  if (!resume) {
    console.error('Cannot prepare null resume for VC')
    return null
  }

  const preparedResume = JSON.parse(JSON.stringify(resume))

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
