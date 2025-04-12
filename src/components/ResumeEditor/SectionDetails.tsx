import React from 'react'
import { Box } from '@mui/material'
import ProfessionalSummary from './sections/ProfessionalSummary'
import WorkExperience from './sections/WorkExperience'
import Education from './sections/Education'
import ProfessionalAffiliations from './sections/ProfessionalAffiliations'
import SkillsAndAbilities from './sections/SkillsAndAbilities'
import HobbiesAndInterests from './sections/HobbiesAndInterests'
import Projects from './sections/Projects'
import VolunteerWork from './sections/VolunteerWork'
import CertificationsAndLicenses from './sections/CertificationsAndLicenses'

interface SectionDetailsProps {
  sectionId: string
  onDelete?: () => void
  onAddFiles?: () => void
  onAddCredential?: (text: string) => void
}

export default function SectionDetails({
  sectionId,
  onDelete,
  onAddFiles,
  onAddCredential
}: Readonly<SectionDetailsProps>) {
  const renderSection = () => {
    switch (sectionId) {
      case 'Professional Summary':
        return (
          <ProfessionalSummary
            onAddFiles={onAddFiles}
            onDelete={onDelete}
            onAddCredential={onAddCredential}
          />
        )
      case 'Work Experience':
        return (
          <WorkExperience
            onAddFiles={onAddFiles}
            onDelete={onDelete}
            onAddCredential={onAddCredential}
          />
        )
      case 'Education':
        return (
          <Education
            onAddFiles={onAddFiles}
            onDelete={onDelete}
            onAddCredential={onAddCredential}
          />
        )
      case 'Professional Affiliations':
        return (
          <ProfessionalAffiliations
            onAddFiles={onAddFiles}
            onDelete={onDelete}
            onAddCredential={onAddCredential}
          />
        )
      case 'Skills and Abilities':
        return (
          <SkillsAndAbilities
            onAddFiles={onAddFiles}
            onDelete={onDelete}
            onAddCredential={onAddCredential}
          />
        )
      case 'Hobbies and Interests':
        return (
          <HobbiesAndInterests
            onAddFiles={onAddFiles}
            onDelete={onDelete}
            onAddCredential={onAddCredential}
          />
        )
      case 'Projects':
        return (
          <Projects
            onAddFiles={onAddFiles}
            onDelete={onDelete}
            onAddCredential={onAddCredential}
          />
        )
      case 'Volunteer Work':
        return (
          <VolunteerWork
            onAddFiles={onAddFiles}
            onDelete={onDelete}
            onAddCredential={onAddCredential}
          />
        )
      case 'Certifications and Licenses':
        return (
          <CertificationsAndLicenses
            onAddFiles={onAddFiles}
            onDelete={onDelete}
            onAddCredential={onAddCredential}
          />
        )
      default:
        return null
    }
  }

  return <Box>{renderSection()}</Box>
}
