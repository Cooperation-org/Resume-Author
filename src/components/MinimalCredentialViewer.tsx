import React from 'react'
import { Box, Typography, Grid, Link as MuiLink } from '@mui/material'

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

function getPersonName(subject: CredentialSubject): string {
  return (
    subject?.fullName ||
    subject?.name ||
    subject?.persons ||
    subject?.employeeName ||
    'Unknown Person'
  )
}

function cleanHTML(htmlContent: any): string {
  if (typeof htmlContent !== 'string') {
    return ''
  }
  return htmlContent
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p><\/p>/g, '')
    .replace(/<br>/g, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
}

const MinimalCredentialViewer: React.FC<MinimalCredentialViewerProps> = ({ vcData }) => {
  if (!vcData) return null
  const subject: CredentialSubject = vcData.credentialSubject || {}
  const vcType = getVCType(vcData)
  const credentialTitle = getCredentialTitle(vcData, vcType)
  const personName = getPersonName(subject)
  const hasPortfolio = Array.isArray(subject.portfolio) && subject.portfolio.length > 0

  const renderPortfolio = () => {
    if (!hasPortfolio) return null
    return (
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontWeight: 600, mb: 1 }}>
          Supporting Evidence / Portfolio:
        </Typography>
        <Grid container spacing={2}>
          {subject.portfolio!.map((item, idx) => {
            const isImage = item.url.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i)
            return (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                {isImage ? (
                  <Box sx={{ mb: 1 }}>
                    <img
                      src={item.url}
                      alt={item.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: 120,
                        borderRadius: 6,
                        border: '1px solid #e0e0e0'
                      }}
                    />
                    <Typography
                      variant='caption'
                      sx={{ display: 'block', mt: 0.5, wordBreak: 'break-all' }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                ) : (
                  <MuiLink
                    href={item.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    underline='hover'
                    sx={{ color: '#2563EB', fontWeight: 500, wordBreak: 'break-all' }}
                  >
                    {item.name}
                  </MuiLink>
                )}
              </Grid>
            )
          })}
        </Grid>
      </Box>
    )
  }

  const renderCredentialContent = () => {
    switch (vcType) {
      case 'employment':
        return (
          <Box sx={{ mt: 1 }}>
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              <b>Company:</b> {subject.company}
            </Typography>
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              <b>Role:</b> {subject.role}
            </Typography>
            {subject.credentialDuration && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                <b>Duration:</b> {subject.credentialDuration}
              </Typography>
            )}
            {subject.credentialDescription && (
              <Typography variant='body2' sx={{ mt: 1 }}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(subject.credentialDescription)
                  }}
                />
              </Typography>
            )}
          </Box>
        )
      case 'volunteering':
        return (
          <Box sx={{ mt: 1 }}>
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              <b>Organization:</b> {subject.volunteerOrg}
            </Typography>
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              <b>Work:</b> {subject.volunteerWork}
            </Typography>
            {subject.volunteerDates && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                <b>Dates:</b> {subject.volunteerDates}
              </Typography>
            )}
            {subject.volunteerDescription && (
              <Typography variant='body2' sx={{ mt: 1 }}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(subject.volunteerDescription)
                  }}
                />
              </Typography>
            )}
            {subject.skillsGained && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                <b>Skills Gained:</b>{' '}
                {Array.isArray(subject.skillsGained)
                  ? subject.skillsGained.join(', ')
                  : subject.skillsGained}
              </Typography>
            )}
          </Box>
        )
      case 'performance-review':
        return (
          <Box sx={{ mt: 1 }}>
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              <b>Employee Name:</b> {subject.employeeName}
            </Typography>
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              <b>Job Title:</b> {subject.employeeJobTitle}
            </Typography>
            {subject.reviewDuration && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                <b>Review Period:</b> {subject.reviewDuration}
              </Typography>
            )}
            {subject.overallRating && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                <b>Overall Rating:</b> {subject.overallRating}/5
              </Typography>
            )}
            {subject.reviewComments && (
              <Typography variant='body2' sx={{ mt: 1 }}>
                <span
                  dangerouslySetInnerHTML={{ __html: cleanHTML(subject.reviewComments) }}
                />
              </Typography>
            )}
          </Box>
        )
      case 'recommendation':
        return (
          <Box sx={{ mt: 1 }}>
            {subject.howKnow && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                <b>How They Know:</b>{' '}
                <span dangerouslySetInnerHTML={{ __html: cleanHTML(subject.howKnow) }} />
              </Typography>
            )}
            {subject.recommendationText && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                <b>Recommendation:</b>{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(subject.recommendationText)
                  }}
                />
              </Typography>
            )}
            {subject.qualifications && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                <b>Qualifications:</b>{' '}
                <span
                  dangerouslySetInnerHTML={{ __html: cleanHTML(subject.qualifications) }}
                />
              </Typography>
            )}
            {subject.explainAnswer && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                <b>Explanation:</b>{' '}
                <span
                  dangerouslySetInnerHTML={{ __html: cleanHTML(subject.explainAnswer) }}
                />
              </Typography>
            )}
          </Box>
        )
      case 'skill':
      default:
        const achievement = subject.achievement?.[0]
        return (
          <Box sx={{ mt: 1 }}>
            {achievement?.description && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                <b>Description:</b>{' '}
                <span
                  dangerouslySetInnerHTML={{ __html: cleanHTML(achievement.description) }}
                />
              </Typography>
            )}
            {achievement?.criteria?.narrative && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                <b>Criteria:</b>{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(achievement.criteria.narrative)
                  }}
                />
              </Typography>
            )}
          </Box>
        )
    }
  }

  return (
    <Box
      sx={{
        border: '1px solid #003FE0',
        borderRadius: '10px',
        p: 2,
        mb: 2,
        background: '#F7F9FC',
        boxShadow: '0 2px 8px rgba(0,63,224,0.04)',
        minWidth: 0,
        maxWidth: 600
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#003FE0', mr: 1 }}>
          {credentialTitle}
        </Typography>
        <Typography sx={{ fontWeight: 500, fontSize: '15px', color: '#222' }}>
          {personName && `by ${personName}`}
        </Typography>
      </Box>
      {renderCredentialContent()}
      {renderPortfolio()}
    </Box>
  )
}

export default MinimalCredentialViewer
