import React, { useRef, useState, ReactNode, useLayoutEffect, useEffect, useMemo } from 'react'
import { Box, Typography, Link } from '@mui/material'
import ResumeQRCode from './ResumeQRCode'
import { BlueVerifiedBadge } from '../assets/svgs'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { HTMLWithVerifiedLinks, isVerifiedLink } from '../tools/htmlUtils'
import MinimalCredentialViewer from './MinimalCredentialViewer'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

const PAGE_SIZE = {
  width: '210mm',
  height: '297mm'
}
const HEADER_HEIGHT_PX = 125
const FOOTER_HEIGHT_PX = 90 // Footer height including padding (60px + 30px py)
const CONTENT_PADDING_TOP = 15
const CONTENT_PADDING_BOTTOM = 15

const mmToPx = (mm: number) => mm * 3.779527559

const SectionTitle: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Typography
    variant='h6'
    sx={{
      fontWeight: 700,
      mb: '8px', // Reduced from 11px
      lineHeight: '20px',
      fontSize: '16px', // Reduced from 18px
      color: '#000'
    }}
  >
    {children}
  </Typography>
)

// Component for rendering links with favicons
const LinkWithFavicon: React.FC<{ url: string; platform?: string }> = ({
  url,
  platform
}) => {
  const cleanUrl = url.replace(/^https?:\/\//, '')
  const domain = platform ? platform.toLowerCase() : cleanUrl.split('/')[0]
  const faviconDomain = domain.includes('.') ? domain : `${domain}.com`
  const isVerified = isVerifiedLink(url)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '5px'
      }}
    >
      <Typography
        variant='body2'
        sx={{
          fontWeight: 700,
          color: '#000',
          fontSize: '10px',
          ml: '24px',
          lineHeight: '8px',
          fontFamily: 'DM Sans'
        }}
      >
        {platform ?? domain}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isVerified && <BlueVerifiedBadge />}
        <img
          src={`https://www.google.com/s2/favicons?domain=${faviconDomain}&sz=32`}
          alt={`${domain} favicon`}
          style={{ width: 16, height: 16, borderRadius: '50%' }}
        />
        <Link
          href={`https://${cleanUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          sx={{
            color: '#2563EB',
            textDecoration: 'underline',
            fontSize: '16px',
            lineHeight: '9px',
            fontWeight: 400,
            fontFamily: 'DM Sans',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          {cleanUrl}
        </Link>
      </Box>
    </Box>
  )
}

// Updated PageHeader component
const PageHeader: React.FC<{ fullName: string; city?: string; forcedId?: string }> = ({
  fullName,
  city,
  forcedId
}) => {
  const [resumeLink, setResumeLink] = useState<string>('')
  const [hasValidId, setHasValidId] = useState<boolean>(false)

  const handleLinkGenerated = (link: string, isValid: boolean) => {
    setResumeLink(link)
    setHasValidId(isValid)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#F7F9FC',
        height: `${HEADER_HEIGHT_PX}px`
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', ml: '45px' }}>
        <Typography sx={{ fontWeight: 600, color: '#2E2E48', fontSize: '30px' }}>
          {fullName}
        </Typography>
        {city && (
          <Typography sx={{ fontWeight: 400, color: '#2E2E48', fontSize: '18px', ml: 2 }}>
            {city}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Box
          sx={{
            textAlign: 'center',
            py: '20px',
            mr: '15px',
            display: hasValidId ? 'block' : 'none' // Hide when no valid ID
          }}
        >
          <Link
            href={resumeLink}
            target='_blank'
            rel='noopener noreferrer'
            sx={{
              color: '#000',
              textAlign: 'center',
              fontFamily: 'Arial',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '16px',
              textDecorationLine: 'underline',
              cursor: 'pointer'
            }}
          >
            View Source
          </Link>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: `${HEADER_HEIGHT_PX}px`,
            width: '128px',
            backgroundColor: '#2563EB'
          }}
        >
          <ResumeQRCode
            size={86}
            bgColor='transparent'
            fgColor='#fff'
            forcedId={forcedId}
            onLinkGenerated={handleLinkGenerated}
          />
        </Box>
      </Box>
    </Box>
  )
}

// Updated PageFooter component
const PageFooter: React.FC<{
  fullName: string
  email: string
  phone?: string
  pageNumber: number
  totalPages: number
  forcedId?: string
}> = ({ fullName, email, phone, pageNumber, totalPages, forcedId }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [resumeLink, setResumeLink] = useState<string>('') //NOSONAR
  const [hasValidId, setHasValidId] = useState<boolean>(false)

  const handleLinkGenerated = (link: string, isValid: boolean) => {
    setResumeLink(link)
    setHasValidId(isValid)
  }

  return (
    <Box
      sx={{
        backgroundColor: '#F7F9FC',
        py: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `${FOOTER_HEIGHT_PX}px`
      }}
    >
      <Typography
        variant='caption'
        sx={{
          color: '#000',
          textAlign: 'center',
          fontFamily: 'DM Sans',
          fontSize: '10px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '15px',
          mr: '10px'
        }}
      >
        {fullName} | Page {pageNumber} of {totalPages} |{' '}
        {phone && (
          <a href={`tel:${phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {phone}
          </a>
        )}
        {' | '}
        <a
          href={`mailto:${email}`}
          style={{ textDecoration: 'underline', color: '#2563EB' }}
        >
          {email}
        </a>
      </Typography>
      {hasValidId && (
        <ResumeQRCode
          size={32}
          bgColor='transparent'
          fgColor='#000'
          forcedId={forcedId}
          onLinkGenerated={handleLinkGenerated}
        />
      )}
    </Box>
  )
}

const SummarySection: React.FC<{ summary?: string }> = ({ summary }) => {
  if (!summary) return null
  return (
    <Box sx={{ mb: '15px' }}> {/* Reduced margin from 20px */}
      <SectionTitle>Professional Summary</SectionTitle>
      <Typography
        variant='body2'
        sx={{
          color: '#000',
          fontWeight: 400,
          fontSize: '14px', // Reduced from 16px
          fontFamily: 'Arial',
          lineHeight: 1.5
        }}
      >
        <HTMLWithVerifiedLinks htmlContent={summary} />
      </Typography>
    </Box>
  )
}

const SocialLinksSection: React.FC<{
  socialLinks?: Record<string, string | undefined>
}> = ({ socialLinks }) => {
  if (!socialLinks) return null

  const hasLinks = Object.values(socialLinks).some(link => !!link)
  if (!hasLinks) return null

  return (
    <Box sx={{ mb: '15px' }}> {/* Reduced margin from 20px */}
      <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap', flexDirection: 'row' }}>
        {Object.entries(socialLinks).map(([platform, url]) =>
          url ? (
            <Box key={platform}>
              <LinkWithFavicon url={url} platform={platform} />
            </Box>
          ) : null
        )}
      </Box>
    </Box>
  )
}

// Helper to get credential name
function getCredentialName(claim: any): string {
  try {
    if (!claim || typeof claim !== 'object') {
      return 'Invalid Credential'
    }
    const credentialSubject = claim.credentialSubject
    if (!credentialSubject || typeof credentialSubject !== 'object') {
      return 'Unknown Credential'
    }
    if (credentialSubject.employeeName) {
      return `Performance Review: ${credentialSubject.employeeJobTitle || 'Unknown Position'}`
    }
    if (credentialSubject.volunteerWork) {
      return `Volunteer: ${credentialSubject.volunteerWork}`
    }
    if (credentialSubject.role) {
      return `Employment: ${credentialSubject.role}`
    }
    if (credentialSubject.credentialName) {
      return credentialSubject.credentialName
    }
    if (credentialSubject.achievement && credentialSubject.achievement[0]?.name) {
      return credentialSubject.achievement[0].name
    }
    return 'Credential'
  } catch {
    return 'Credential'
  }
}

// Helper to render credential link as blue link or MinimalCredentialViewer
function renderCredentialLink(credentialLink: string | undefined) {
  if (!credentialLink) return null
  let credObj = null
  try {
    if (credentialLink.startsWith('{')) {
      credObj = JSON.parse(credentialLink)
    }
  } catch (e) {}
  if (credObj) {
    return <MinimalCredentialViewer vcData={credObj} />
  }
  // fallback: treat as URL
  return (
    <a
      href={credentialLink}
      target='_blank'
      rel='noopener noreferrer'
      style={{ color: '#2563EB', textDecoration: 'underline', fontWeight: 600 }}
    >
      View Credential
    </a>
  )
}

// Helper to render portfolio links/images
function renderPortfolio(portfolio: any[] | undefined) {
  if (!portfolio || !Array.isArray(portfolio) || portfolio.length === 0) return null
  return (
    <ul style={{ paddingLeft: 20, margin: 0 }}>
      {portfolio.map((item, idx) =>
        item.name && item.url ? (
          <li key={idx} style={{ marginBottom: 2 }}>
            <a
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              style={{ color: '#2563EB', textDecoration: 'underline' }}
            >
              {item.name}
            </a>
          </li>
        ) : null
      )}
    </ul>
  )
}

// Helper to render date or duration for sections
function renderDateOrDuration({
  duration,
  startDate,
  endDate,
  currentlyVolunteering,
  noExpiration,
  issueDate
}: {
  duration?: string
  startDate?: string
  endDate?: string
  currentlyVolunteering?: boolean
  noExpiration?: boolean
  issueDate?: string
}) {
  if (duration) {
    return duration
  }
  if (noExpiration) {
    return 'No Expiration'
  }
  if (issueDate) {
    return `Issued on ${issueDate}`
  }
  const start = startDate ?? ''
  let end = endDate ?? ''
  if (!endDate && (currentlyVolunteering || start)) {
    end = 'Present'
  }
  if (!start && !end) {
    return ''
  }
  return `${start}${start ? ' - ' : ''}${end}`
}

// Single Experience Item Component
const ExperienceItem: React.FC<{ item: WorkExperience; index: number }> = ({ item, index }) => {
  const dateText = renderDateOrDuration({
    duration: item.duration,
    startDate: item.startDate,
    endDate: item.endDate
  })
  let credLink = item.credentialLink
  let credObj = null
  if (credLink && credLink.startsWith('{')) {
    try {
      credObj = JSON.parse(credLink)
    } catch (e) {}
  }
  let portfolio = credObj?.credentialSubject?.portfolio

  return (
    <Box key={item.id || `exp-${index}`} sx={{ mb: '15px' }}> {/* Reduced margin from 20px */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {item.verificationStatus === 'verified' && <BlueVerifiedBadge />}
        <Typography
          variant='subtitle1'
          sx={{
            fontWeight: 700,
            ml: item.verificationStatus === 'verified' ? 1 : 0,
            fontSize: '16px', // Standardized font size
            fontFamily: 'Arial'
          }}
        >
          {item.position ?? item.title}
        </Typography>
      </Box>
      <Typography
        variant='body2'
        sx={{
          color: '#000',
          fontWeight: 400,
          fontSize: '14px', // Slightly smaller for company name
          fontFamily: 'Arial'
        }}
      >
        {item.company}
      </Typography>
      {dateText && (
        <Typography
          variant='body2'
          sx={{
            color: '#000',
            mb: 0.5,
            fontWeight: 400,
            fontSize: '14px',
            fontFamily: 'Arial'
          }}
        >
          {dateText}
        </Typography>
      )}
      {item.description && (
        <Typography
          variant='body2'
          sx={{
            mb: 1,
            fontWeight: 400,
            fontSize: '14px', // Reduced font size for descriptions
            fontFamily: 'Arial',
            lineHeight: 1.5 // Better line spacing
          }}
        >
          <HTMLWithVerifiedLinks htmlContent={item.description} />
        </Typography>
      )}
      {/* Credential Link */}
      {renderCredentialLink(item.credentialLink)}
      {/* Portfolio */}
      {renderPortfolio(portfolio)}
    </Box>
  )
}

// Single Education Item Component
const EducationItem: React.FC<{ item: Education }> = ({ item }) => {
  const dateText = renderDateOrDuration({
    duration: item.duration,
    startDate: item.startDate,
    endDate: item.endDate,
    currentlyVolunteering: item.currentlyEnrolled
  })
  let credLink = item.credentialLink
  let credObj = null
  if (credLink && credLink.startsWith('{')) {
    try {
      credObj = JSON.parse(credLink)
    } catch (e) {}
  }
  let portfolio = credObj?.credentialSubject?.portfolio
  // Fix for empty degree and program name
  let educationTitle = ''
  if (item.type && item.programName) {
    educationTitle = `${item.type} in ${item.programName}`
  } else if (item.type) {
    educationTitle = String(item.type)
  } else if (item.programName) {
    educationTitle = String(item.programName)
  }
  if (educationTitle && item.institution) {
    educationTitle += `, ${item.institution}`
  } else if (item.institution) {
    educationTitle = item.institution
  }
  return (
    <Box key={item.id} sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        {item.awardEarned && <BlueVerifiedBadge />}
        <Box sx={{ ml: item.awardEarned ? 1 : 0 }}>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 700, fontSize: '15px', fontFamily: 'Arial' }}
          >
            {educationTitle}
          </Typography>
          {dateText && (
            <Typography
              variant='body2'
              sx={{
                color: '#000',
                fontWeight: 400,
                fontSize: '15px',
                fontFamily: 'Arial'
              }}
            >
              {dateText}
              {item.inProgress ? ' | In Progress' : ''}
            </Typography>
          )}
          {item.description && (
            <Typography
              variant='body2'
              sx={{
                color: '#000',
                fontWeight: 400,
                fontSize: '14px',
                fontFamily: 'Arial'
              }}
            >
              <HTMLWithVerifiedLinks htmlContent={item.description} />
            </Typography>
          )}
          {/* Credential Link */}
          {renderCredentialLink(item.credentialLink)}
          {/* Portfolio */}
          {renderPortfolio(portfolio)}
        </Box>
      </Box>
    </Box>
  )
}

// Single Certification Item Component
const CertificationItem: React.FC<{ item: Certification }> = ({ item }) => {
  let displayDate = ''
  if (item.noExpiration) {
    displayDate = 'No Expiration'
  }
  if (item.issueDate) {
    if (displayDate) {
      displayDate = `Issued on ${item.issueDate} | ${displayDate}`
    } else {
      displayDate = `Issued on ${item.issueDate}`
    }
  }
  let credLink = item.credentialLink
  let credObj = null
  if (credLink && credLink.startsWith('{')) {
    try {
      credObj = JSON.parse(credLink)
    } catch (e) {}
  }
  let portfolio = credObj?.credentialSubject?.portfolio
  return (
    <Box key={item.id || item.name} sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        {item.verificationStatus === 'verified' && <BlueVerifiedBadge />}
        <Box sx={{ ml: item.verificationStatus === 'verified' ? 1 : 0 }}>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 700, fontSize: '16px', fontFamily: 'Arial' }}
          >
            {item.name}
          </Typography>
          {item.issuer && (
            <Typography
              variant='body2'
              sx={{
                color: '#000',
                fontFamily: 'Arial',
                fontSize: '16px',
                fontWeight: 400
              }}
            >
              Issued by {item.issuer}
            </Typography>
          )}
          {displayDate && (
            <Typography
              variant='body2'
              sx={{
                color: '#000',
                fontFamily: 'Arial',
                fontSize: '16px',
                fontWeight: 400
              }}
            >
              {displayDate}
            </Typography>
          )}
          {item.verificationStatus === 'verified' && item.credentialId && (
            <Typography
              variant='body2'
              sx={{
                color: '#2563EB',
                fontFamily: 'Arial',
                fontSize: '16px',
                fontWeight: 400
              }}
            >
              Credential ID: {item.credentialId}
            </Typography>
          )}
          {/* Credential Link */}
          {renderCredentialLink(item.credentialLink)}
          {/* Portfolio */}
          {renderPortfolio(portfolio)}
        </Box>
      </Box>
    </Box>
  )
}

// Single Project Item Component
const ProjectItem: React.FC<{ item: Project }> = ({ item }) => {
  const dateText = renderDateOrDuration({})
  let credLink = item.credentialLink
  let credObj = null
  if (credLink && credLink.startsWith('{')) {
    try {
      credObj = JSON.parse(credLink)
    } catch (e) {}
  }
  let portfolio = credObj?.credentialSubject?.portfolio
  return (
    <Box key={item.id} sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        {item.verificationStatus === 'verified' && <BlueVerifiedBadge />}
        <Box sx={{ ml: item.verificationStatus === 'verified' ? 1 : 0 }}>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '16px' }}
          >
            {item.name}
          </Typography>
          {dateText && (
            <Typography
              variant='body2'
              sx={{
                fontFamily: 'Arial',
                fontSize: '16px',
                fontWeight: 400
              }}
            >
              {dateText}
            </Typography>
          )}
          {item.description && (
            <Typography
              variant='body2'
              sx={{ mb: 1, fontFamily: 'Arial', fontSize: '16px', fontWeight: 400 }}
            >
              <HTMLWithVerifiedLinks htmlContent={item.description} />
            </Typography>
          )}
          {item.url && (
            <Box sx={{ mb: 1 }}>
              <LinkWithFavicon url={item.url} />
            </Box>
          )}
          {/* Credential Link */}
          {renderCredentialLink(item.credentialLink)}
          {/* Portfolio */}
          {renderPortfolio(portfolio)}
        </Box>
      </Box>
    </Box>
  )
}

// Single Professional Affiliation Item Component
const ProfessionalAffiliationItem: React.FC<{ item: ProfessionalAffiliation }> = ({ item }) => {
  const dateText = renderDateOrDuration({
    duration: item.duration,
    startDate: item.startDate,
    endDate: item.endDate
  })
  let credLink = item.credentialLink
  let credObj = null
  if (credLink && credLink.startsWith('{')) {
    try {
      credObj = JSON.parse(credLink)
    } catch (e) {}
  }
  let portfolio = credObj?.credentialSubject?.portfolio
  return (
    <Box key={item.id} sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        {item.verificationStatus === 'verified' && <BlueVerifiedBadge />}
        <Box sx={{ ml: item.verificationStatus === 'verified' ? 1 : 0 }}>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 700, fontSize: '16px', fontFamily: 'Arial' }}
          >
            {item.name ?? item.role ?? 'Affiliation'}
            {item.organization && ` of the ${item.organization}`}
          </Typography>
          {dateText && (
            <Typography
              variant='body2'
              sx={{
                color: '#000',
                fontFamily: 'Arial',
                fontSize: '16px',
                fontWeight: 400
              }}
            >
              {dateText}
            </Typography>
          )}
          {item.activeAffiliation && (
            <Typography
              variant='body2'
              sx={{
                color: '#000',
                fontFamily: 'Arial',
                fontSize: '16px',
                fontWeight: 400
              }}
            >
              Active Affiliation
            </Typography>
          )}
          {/* Credential Link */}
          {renderCredentialLink(item.credentialLink)}
          {/* Portfolio */}
          {renderPortfolio(portfolio)}
        </Box>
      </Box>
    </Box>
  )
}

// Single Volunteer Work Item Component
const VolunteerWorkItem: React.FC<{ item: VolunteerWork }> = ({ item }) => {
  const dateText = renderDateOrDuration({
    duration: item.duration,
    startDate: item.startDate,
    endDate: item.endDate,
    currentlyVolunteering: item.currentlyVolunteering
  })
  let credLink = item.credentialLink
  let credObj = null
  if (credLink && credLink.startsWith('{')) {
    try {
      credObj = JSON.parse(credLink)
    } catch (e) {}
  }
  let portfolio = credObj?.credentialSubject?.portfolio
  return (
    <Box key={item.id} sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        {item.verificationStatus === 'verified' && <BlueVerifiedBadge />}
        <Box sx={{ ml: item.verificationStatus === 'verified' ? 1 : 0 }}>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '16px' }}
          >
            {item.role} at {item.organization}
          </Typography>
          {item.location && (
            <Typography
              variant='body2'
              sx={{ fontFamily: 'Arial', fontSize: '16px', fontWeight: 400 }}
            >
              {item.location}
            </Typography>
          )}
          {dateText && (
            <Typography
              variant='body2'
              sx={{ fontFamily: 'Arial', fontSize: '16px', fontWeight: 400 }}
            >
              {dateText}
            </Typography>
          )}
          {item.description && (
            <Typography
              variant='body2'
              sx={{ mb: 1, fontFamily: 'Arial', fontSize: '16px', fontWeight: 400 }}
            >
              <HTMLWithVerifiedLinks htmlContent={item.description} />
            </Typography>
          )}
          {/* Credential Link */}
          {renderCredentialLink(item.credentialLink)}
          {/* Portfolio */}
          {renderPortfolio(portfolio)}
        </Box>
      </Box>
    </Box>
  )
}

// Single Skill Item Component
const SkillItem: React.FC<{ item: Skill }> = ({ item }) => {
  let credLink = item.credentialLink
  let credObj = null
  if (credLink && credLink.startsWith('{')) {
    try {
      credObj = JSON.parse(credLink)
    } catch (e) {}
  }
  let portfolio = credObj?.credentialSubject?.portfolio
  return (
    <Box
      key={item.id}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        width: 'calc(100% - 8px)',
        mb: 1
      }}
    >
      {item.verificationStatus === 'verified' && <BlueVerifiedBadge />}
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: '16px',
          fontFamily: 'Arial',
          ml: item.verificationStatus === 'verified' ? 1 : 0
        }}
      >
        <HTMLWithVerifiedLinks htmlContent={item.skills || ''} />
      </Typography>
      {/* Credential Link */}
      {renderCredentialLink(item.credentialLink)}
      {/* Portfolio */}
      {renderPortfolio(portfolio)}
    </Box>
  )
}

// Single Language Item Component
const LanguageItem: React.FC<{ lang: Language; idx: number }> = ({ lang, idx }) => {
  return (
    <Box
      key={lang.id || `language-${idx}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: 'calc(100% - 8px)',
        mb: 1
      }}
    >
      <Typography sx={{ fontWeight: 400, fontSize: '16px', fontFamily: 'Arial' }}>
        {lang.name} {lang.proficiency ? `(${lang.proficiency})` : ''}
      </Typography>
    </Box>
  )
}

// Single Hobby Item Component
const HobbyItem: React.FC<{ hobby: string; idx: number }> = ({ hobby, idx }) => {
  return (
    <Typography
      component='li'
      key={`hobby-${idx}`}
      sx={{ fontWeight: 400, fontSize: '16px', fontFamily: 'Arial', mb: 1 }}
    >
      {hobby}
    </Typography>
  )
}

// Single Publication Item Component
const PublicationItem: React.FC<{ item: Publication }> = ({ item }) => {
  return (
    <Box key={item.id} sx={{ mb: 2 }}>
      <Typography
        variant='subtitle1'
        sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '16px' }}
      >
        {item.title}
      </Typography>
      <Typography
        variant='body2'
        sx={{ fontFamily: 'Arial', fontSize: '16px', fontWeight: 400 }}
      >
        {item.publisher} | {item.publishedDate || 'Published'}
      </Typography>
      {item.url && (
        <Box sx={{ mb: 1 }}>
          <LinkWithFavicon url={item.url} />
        </Box>
      )}
    </Box>
  )
}

const SkillsSection: React.FC<{ items: Skill[] }> = ({ items }) => {
  if (!items?.length) return null
  return (
    <Box sx={{ mb: '15px' }}> {/* Reduced margin from 20px */}
      <SectionTitle>Skills</SectionTitle>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {items.map(item => (
          <SkillItem key={item.id} item={item} />
        ))}
      </Box>
    </Box>
  )
}

const LanguagesSection: React.FC<{ items: Language[] }> = ({ items }) => {
  if (!items?.length) return null
  return (
    <Box sx={{ mb: '30px' }}>
      <SectionTitle>Languages</SectionTitle>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {items.map((lang, idx) => (
          <LanguageItem key={lang.id || `language-${idx}`} lang={lang} idx={idx} />
        ))}
      </Box>
    </Box>
  )
}

const HobbiesSection: React.FC<{ items: string[] }> = ({ items }) => {
  if (!items?.length) return null
  return (
    <Box sx={{ mb: '30px' }}>
      <SectionTitle>Hobbies and Interests</SectionTitle>
      <Box component='ul' sx={{ pl: 2 }}>
        {items.map((hobby, idx) => (
          <HobbyItem key={`hobby-${idx}`} hobby={hobby} idx={idx} />
        ))}
      </Box>
    </Box>
  )
}

// Improved usePagination that handles item-level splitting
function usePagination(content: ReactNode[]) {
  const [pages, setPages] = useState<ReactNode[][]>([])
  const measureRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // Give the browser time to properly render and measure
    let timeoutId: NodeJS.Timeout

    const measureAndPaginate = () => {
      if (!measureRef.current) return

      const fullPageHeightPx = mmToPx(parseFloat(PAGE_SIZE.height))
      // Calculate actual available content height
      const contentMaxHeightPx =
        fullPageHeightPx -
        HEADER_HEIGHT_PX -
        FOOTER_HEIGHT_PX -
        CONTENT_PADDING_TOP -
        CONTENT_PADDING_BOTTOM

      console.log('Page calculations:', {
        fullPageHeightPx,
        headerHeight: HEADER_HEIGHT_PX,
        footerHeight: FOOTER_HEIGHT_PX,
        paddingTop: CONTENT_PADDING_TOP,
        paddingBottom: CONTENT_PADDING_BOTTOM,
        contentMaxHeightPx,
        contentMaxHeightMm: contentMaxHeightPx / 3.779527559
      })

      // Wait for images and fonts to load
      measureRef.current.style.width = PAGE_SIZE.width
      measureRef.current.style.padding = `${CONTENT_PADDING_TOP}px 50px ${CONTENT_PADDING_BOTTOM}px`

      const contentElements = Array.from(measureRef.current.children)
      if (contentElements.length === 0) {
        setPages([[]])
        return
      }

      // Force layout and get accurate measurements
      const contentHeights = contentElements.map((el, idx) => {
        // Force reflow
        el.getBoundingClientRect()
        const computedStyle = window.getComputedStyle(el)
        const marginTop = parseFloat(computedStyle.marginTop)
        const marginBottom = parseFloat(computedStyle.marginBottom)
        const height = (el as HTMLElement).offsetHeight + marginTop + marginBottom

        console.log(`Element ${idx}:`, {
          height,
          marginTop,
          marginBottom,
          offsetHeight: (el as HTMLElement).offsetHeight,
          element: content[idx]
        })
        return height
      })

      let currentPage: ReactNode[] = []
      let currentHeight = 0
      const paginated: ReactNode[][] = []

      // Add a buffer to prevent content from touching the footer
      const SAFETY_MARGIN = 20 // Reduced from 40 to use more page space
      const effectiveMaxHeight = contentMaxHeightPx - SAFETY_MARGIN

      for (let i = 0; i < content.length; i++) {
        const element = content[i]
        const elementHeight = contentHeights[i] || 0

        console.log(`Processing element ${i}:`, {
          currentHeight,
          elementHeight,
          wouldBe: currentHeight + elementHeight,
          maxHeight: effectiveMaxHeight,
          fits: currentHeight + elementHeight <= effectiveMaxHeight
        })

        // Check if adding this element would exceed the page height
        if (currentHeight > 0 && currentHeight + elementHeight > effectiveMaxHeight) {
          // Start a new page
          console.log(`Breaking to new page at element ${i}`)
          paginated.push([...currentPage])
          currentPage = []
          currentHeight = 0
        }

        // Add element to current page
        currentPage.push(element)
        currentHeight += elementHeight
      }
      if (currentPage.length > 0) {
        paginated.push(currentPage)
      }
      if (paginated.length === 0) {
        paginated.push([])
      }

      console.log('Final pagination:', {
        totalElements: content.length,
        totalPages: paginated.length,
        elementsPerPage: paginated.map(p => p.length)
      })

      setPages(paginated)
    }

    // Initial measure after a short delay
    timeoutId = setTimeout(measureAndPaginate, 300)

    // Re-measure on window resize
    window.addEventListener('resize', measureAndPaginate)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', measureAndPaginate)
    }
  }, [content])

  return { pages, measureRef }
}

// Patch: Extract summary from professionalSummary.credentialSubject.narrative if present
function getSummary(resume: any) {
  if (
    resume.professionalSummary &&
    resume.professionalSummary.credentialSubject &&
    resume.professionalSummary.credentialSubject.narrative
  ) {
    return resume.professionalSummary.credentialSubject.narrative
  }
  return resume.summary || ''
}

const ResumePreview: React.FC<{ data?: Resume; forcedId?: string }> = ({
  data: propData,
  forcedId
}) => {
  const storeResume = useSelector((state: RootState) => state.resume?.resume || null)
  const resume = propData || storeResume
  const [initialRenderComplete, setInitialRenderComplete] = useState(false)

  const [openCredDialog, setOpenCredDialog] = useState(false)
  const [dialogCredObj, setDialogCredObj] = useState<any>(null)
  const [dialogImageUrl, setDialogImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setInitialRenderComplete(true)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [])

  // Build content sections array - memoized to prevent recreation on every render
  // Now we flatten sections with multiple items into individual elements
  const contentSections = useMemo(() => {
    const elements: ReactNode[] = []
    
    if (resume) {
      console.log('Building content sections:', {
        hasSummary: !!resume.summary,
        hasSocialLinks: !!resume.contact?.socialLinks,
        experienceCount: resume.experience?.items?.length || 0,
        educationCount: resume.education?.items?.length || 0,
        skillsCount: resume.skills?.items?.length || 0
      })

      // Always add summary as the first element, using getSummary
      const summary = getSummary(resume)
      if (summary) {
        elements.push(<SummarySection key='summary' summary={summary} />)
      }
      if (resume.contact?.socialLinks) {
        elements.push(
          <SocialLinksSection key='social' socialLinks={resume.contact.socialLinks} />
        )
      }
      
      // Experience section - add title then each item separately
      if (resume.experience?.items?.length) {
        elements.push(
          <Box key='experience-title' sx={{ mb: '8px' }}>
            <SectionTitle>Work Experience</SectionTitle>
          </Box>
        )
        resume.experience.items.forEach((item, index) => {
          elements.push(
            <ExperienceItem key={`experience-${item.id || index}`} item={item} index={index} />
          )
        })
      }
      
      // Certifications section - add title then each item separately
      if (resume.certifications?.items?.length) {
        elements.push(
          <Box key='certifications-title' sx={{ mb: '8px' }}>
            <SectionTitle>Certifications</SectionTitle>
          </Box>
        )
        resume.certifications.items.forEach((item) => {
          elements.push(
            <CertificationItem key={`certification-${item.id || item.name}`} item={item} />
          )
        })
      }
      
      // Education section - add title then each item separately
      if (resume.education?.items?.length) {
        elements.push(
          <Box key='education-title' sx={{ mb: '8px' }}>
            <SectionTitle>Education</SectionTitle>
          </Box>
        )
        resume.education.items.forEach((item) => {
          elements.push(
            <EducationItem key={`education-${item.id}`} item={item} />
          )
        })
      }
      
      // Skills section - keep as one unit since it's usually not that tall
      if (resume.skills?.items?.length) {
        elements.push(<SkillsSection key='skills' items={resume.skills.items} />)
      }
      
      // Professional Affiliations - add title then each item separately
      if (resume.professionalAffiliations?.items?.length) {
        elements.push(
          <Box key='affiliations-title' sx={{ mb: '8px' }}>
            <SectionTitle>Professional Affiliations</SectionTitle>
          </Box>
        )
        resume.professionalAffiliations.items.forEach((item) => {
          elements.push(
            <ProfessionalAffiliationItem key={`affiliation-${item.id}`} item={item} />
          )
        })
      }
      
      // Languages section - keep as one unit
      if (resume.languages?.items?.length) {
        elements.push(
          <LanguagesSection key='languages' items={resume.languages.items} />
        )
      }
      
      // Hobbies section - keep as one unit
      if (resume.hobbiesAndInterests?.length) {
        elements.push(
          <HobbiesSection key='hobbies' items={resume.hobbiesAndInterests} />
        )
      }
      
      // Projects - add title then each item separately
      if (resume.projects?.items?.length) {
        elements.push(
          <Box key='projects-title' sx={{ mb: '8px' }}>
            <SectionTitle>Projects</SectionTitle>
          </Box>
        )
        resume.projects.items.forEach((item) => {
          elements.push(
            <ProjectItem key={`project-${item.id}`} item={item} />
          )
        })
      }
      
      // Publications - add title then each item separately
      if (resume.publications?.items?.length) {
        elements.push(
          <Box key='publications-title' sx={{ mb: '8px' }}>
            <SectionTitle>Publications</SectionTitle>
          </Box>
        )
        resume.publications.items.forEach((item) => {
          elements.push(
            <PublicationItem key={`publication-${item.id}`} item={item} />
          )
        })
      }
      
      // Volunteer Work - add title then each item separately
      if (resume.volunteerWork?.items?.length) {
        elements.push(
          <Box key='volunteer-title' sx={{ mb: '8px' }}>
            <SectionTitle>Volunteer Work</SectionTitle>
          </Box>
        )
        resume.volunteerWork.items.forEach((item) => {
          elements.push(
            <VolunteerWorkItem key={`volunteer-${item.id}`} item={item} />
          )
        })
      }
    }
    
    return elements
  }, [resume])

  // Now use pagination with the flattened content elements
  const { pages, measureRef } = usePagination(contentSections)

  if (!resume) return null

  return (
    <Box
      id='resume-preview'
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible'
      }}
    >
      {/* Dialog for credential or image viewing */}
      <Dialog
        open={openCredDialog}
        onClose={() => setOpenCredDialog(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogContent
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {dialogCredObj && <MinimalCredentialViewer vcData={dialogCredObj} />}
          {dialogImageUrl && (
            <img
              src={dialogImageUrl}
              alt='Attachment'
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* Hidden measure area */}
      <Box
        ref={measureRef}
        sx={{
          visibility: 'hidden',
          position: 'absolute',
          width: PAGE_SIZE.width,
          pt: CONTENT_PADDING_TOP + 'px',
          pb: CONTENT_PADDING_BOTTOM + 'px',
          px: '50px',
          left: '-9999px', // Move far off screen
          top: 0
        }}
      >
        {contentSections}
      </Box>

      {/* Render pages */}
      {initialRenderComplete && (
        <>
          {(pages.length > 0 ? pages : [[]]).map((pageContent, pageIndex) => (
            <Box
              key={`page-${pageIndex}`}
              sx={{
                width: PAGE_SIZE.width,
                height: PAGE_SIZE.height,
                position: 'relative',
                bgcolor: '#fff',
                border: '1px solid #78809A',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                mx: 'auto',
                mb: '30px',
                '@media print': {
                  width: '100%',
                  height: '100%',
                  margin: 0,
                  padding: 0,
                  boxShadow: 'none'
                }
              }}
            >
              <PageHeader
                fullName={resume.contact?.fullName || 'Your Name'}
                city={resume.contact?.location?.city}
                forcedId={forcedId}
              />
              <Box
                sx={{
                  pt: CONTENT_PADDING_TOP + 'px',
                  pb: CONTENT_PADDING_BOTTOM + 'px',
                  px: '50px',
                  position: 'relative',
                  minHeight: 0,
                  height: `calc(100% - ${HEADER_HEIGHT_PX}px - ${FOOTER_HEIGHT_PX}px)`,
                  overflow: 'hidden' // Prevent content from spilling out
                }}
              >
                {pageContent}
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  width: '100%'
                }}
              >
                <PageFooter
                  fullName={resume.contact?.fullName || 'Your Name'}
                  email={resume.contact?.email || 'email@example.com'}
                  phone={resume.contact?.phone}
                  pageNumber={pageIndex + 1}
                  totalPages={Math.max(pages.length, 1)}
                  forcedId={forcedId}
                />
              </Box>
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}

export default ResumePreview
