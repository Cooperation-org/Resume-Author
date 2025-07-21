import React from 'react'
import { Box, Typography, Grid } from '@mui/material'

interface PortfolioItem {
  name: string
  url: string
}

interface CredentialSubject {
  type?: string[]
  name?: string
  fullName?: string
  persons?: string
  achievement?: {
    name?: string
    description?: string
    criteria?: { narrative?: string }
    image?: { id?: string }
  }[]
  duration?: string
  credentialName?: string
  credentialDuration?: string
  credentialDescription?: string
  company?: string
  role?: string
  volunteerWork?: string
  volunteerOrg?: string
  volunteerDescription?: string
  skillsGained?: string[]
  volunteerDates?: string
  employeeName?: string
  employeeJobTitle?: string
  reviewStartDate?: string
  reviewEndDate?: string
  reviewDuration?: string
  jobKnowledgeRating?: string
  teamworkRating?: string
  initiativeRating?: string
  communicationRating?: string
  overallRating?: string
  reviewComments?: string
  goalsNext?: string
  portfolio?: PortfolioItem[]
  createdTime?: string
  evidenceLink?: string
  evidenceDescription?: string
  howKnow?: string
  recommendationText?: string
  qualifications?: string
  explainAnswer?: string
}

interface MinimalCredentialViewerProps {
  vcData: any
}

function getVCType(credential: any): string {
  const types = credential.type || []
  if (types.includes('EmploymentCredential')) return 'employment'
  if (types.includes('VolunteeringCredential')) return 'volunteering'
  if (types.includes('PerformanceReviewCredential')) return 'performance-review'
  if (
    credential.credentialSubject?.howKnow ||
    credential.credentialSubject?.recommendationText
  )
    return 'recommendation'
  return 'skill'
}

function getCredentialTitle(credential: any, vcType: string): string {
  const subject = credential.credentialSubject
  switch (vcType) {
    case 'employment':
      return subject?.credentialName || subject?.role || 'Employment Credential'
    case 'volunteering':
      return subject?.volunteerWork || 'Volunteering Credential'
    case 'performance-review':
      return subject?.employeeJobTitle
        ? `Performance Review: ${subject.employeeJobTitle}`
        : 'Performance Review'
    case 'recommendation':
      return 'Recommendation'
    case 'skill':
    default:
      return (
        subject?.achievement?.[0]?.name || subject?.credentialName || 'Skill Credential'
      )
  }
}

const MinimalCredentialViewer: React.FC<MinimalCredentialViewerProps> = ({ vcData }) => {
  if (!vcData) return null
  const subject: CredentialSubject = vcData.credentialSubject || {}
  const vcType = getVCType(vcData)
  const credentialTitle = getCredentialTitle(vcData, vcType)
  // Try to find a source link (id or url) for the credential
  let sourceUrl = ''
  if (
    vcData.id &&
    typeof vcData.id === 'string' &&
    (vcData.id.startsWith('http') || vcData.id.startsWith('urn:'))
  ) {
    sourceUrl = vcData.id
  } else if (subject.portfolio && subject.portfolio[0]?.url) {
    sourceUrl = subject.portfolio[0].url
  }
  return (
    <Box sx={{ p: 0, minWidth: 0 }}>
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: '#2563EB', textDecoration: 'underline', fontWeight: 600 }}
        >
          {credentialTitle}
        </a>
      ) : (
        <span style={{ color: '#2563EB', fontWeight: 600 }}>{credentialTitle}</span>
      )}
    </Box>
  )
}

export default MinimalCredentialViewer
export {}
