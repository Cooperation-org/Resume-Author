import React, { useRef, useState, ReactNode, useLayoutEffect } from 'react'
import { Box, Typography, Link } from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'
import { BlueVerifiedBadge } from '../assets/svgs'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { HTMLWithVerifiedLinks, isVerifiedLink } from '../tools/htmlUtils'

const PAGE_SIZE = {
  width: '210mm',
  height: '297mm',
  maxContentHeight: '267mm'
}

const SectionTitle: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Typography
    variant='h6'
    sx={{
      fontWeight: 700,
      mb: '11px',
      lineHeight: '20px',
      fontSize: '18px',
      color: '#000'
    }}
  >
    {children}
  </Typography>
)

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
        {platform || domain}
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

const PageHeader: React.FC<{ fullName: string }> = ({ fullName }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: '#F7F9FC',
      height: '125px'
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', ml: '45px' }}>
      <Typography sx={{ fontWeight: 600, color: '#2E2E48', fontSize: '30px' }}>
        {fullName}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center', py: '20px', mr: '15px' }}>
        <Typography
          variant='caption'
          sx={{
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Arial',
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '16px',
            textDecorationLine: 'underline'
          }}
        >
          View a verifiable <br />
          presentation of this <br />
          resume
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '125px',
          width: '128px',
          backgroundColor: '#2563EB'
        }}
      >
        <QRCodeSVG
          value='https://resume.example.com'
          size={86}
          level='L'
          bgColor='transparent'
          fgColor='#fff'
        />
      </Box>
    </Box>
  </Box>
)

const PageFooter: React.FC<{
  fullName: string
  email: string
  phone?: string
  pageNumber: number
  totalPages: number
}> = ({ fullName, email, phone, pageNumber, totalPages }) => (
  <Box
    sx={{
      backgroundColor: '#F7F9FC',
      py: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '15px',
      overflow: 'hidden'
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
      {fullName} | Page {pageNumber} of {totalPages} |
      {phone && (
        <a href={`tel:${phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {phone}
        </a>
      )}
      |
      <a
        href={`mailto:${email}`}
        style={{ textDecoration: 'underline', color: '#2563EB' }}
      >
        {email}
      </a>
    </Typography>
    <QRCodeSVG
      value='https://resume.example.com'
      size={32}
      level='H'
      bgColor='transparent'
      fgColor='#000'
    />
  </Box>
)

const SummarySection: React.FC<{ summary: string }> = ({ summary }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Professional Summary</SectionTitle>
    <Typography
      variant='body2'
      sx={{ color: '#000', fontWeight: 400, fontSize: '16px', fontFamily: 'Arial' }}
    >
      <HTMLWithVerifiedLinks htmlContent={summary} />
    </Typography>
  </Box>
)

const SocialLinksSection: React.FC<{
  socialLinks?: { [key: string]: string | undefined }
}> = ({ socialLinks }) => (
  <Box sx={{ mb: '30px' }}>
    <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', flexDirection: 'row' }}>
      {Object.entries(socialLinks || {}).map(
        ([platform, url]) =>
          url && (
            <Box key={platform}>
              <LinkWithFavicon url={url} platform={platform} />
            </Box>
          )
      )}
    </Box>
  </Box>
)

const ExperienceSection: React.FC<{ items: WorkExperience[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Work Experience</SectionTitle>
    {items?.map(item => (
      <Box key={item.id} sx={{ mb: '30px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {item.verificationStatus === 'verified' && <BlueVerifiedBadge />}
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 700, ml: item.verificationStatus === 'verified' ? 1 : 0 }}
          >
            {item.position || item.title}
          </Typography>
        </Box>
        <Typography
          variant='body2'
          sx={{ color: '#000', fontWeight: 400, fontSize: '16px', fontFamily: 'Arial' }}
        >
          {item.company}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            color: '#000',
            mb: 1,
            fontWeight: 400,
            fontSize: '16px',
            fontFamily: 'Arial'
          }}
        >
          {item.showDuration
            ? item.duration
            : `${item.startDate} – ${item.endDate || 'Present'}`}
        </Typography>
        <Typography
          variant='body2'
          sx={{ mb: 1, fontWeight: 400, fontSize: '16px', fontFamily: 'Arial' }}
        >
          <HTMLWithVerifiedLinks htmlContent={item.description} />
        </Typography>
        {item?.achievements && item.achievements.length > 0 && (
          <Box component='ul' sx={{ m: 0, pl: 2 }}>
            {item.achievements.map((achievement, idx) => (
              <Typography
                component='li'
                variant='body2'
                key={`${item.id}-achievement-${idx}`}
                sx={{ mb: 0.5, fontWeight: 400, fontSize: '16px', fontFamily: 'Arial' }}
              >
                <HTMLWithVerifiedLinks htmlContent={achievement} />
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    ))}
  </Box>
)

const EducationSection: React.FC<{ items: Education[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Education</SectionTitle>
    {items?.map(item => (
      <Box key={item.id} sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          {item.awardEarned && <BlueVerifiedBadge />}
          <Box sx={{ ml: item.awardEarned ? 1 : 0 }}>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 700, fontSize: '15px', fontFamily: 'Arial' }}
            >
              {item.type} in {item.programName}
              {item.institution && `, ${item.institution}`}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: '#000',
                fontWeight: 400,
                fontSize: '15px',
                fontFamily: 'Arial'
              }}
            >
              {item.showDuration && item.duration ? `Duration: ${item.duration}` : ''}
              {item.currentlyEnrolled ? ' | Currently Enrolled' : ''}
              {item.inProgress ? ' | In Progress' : ''}
            </Typography>
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
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
)

const SkillsSection: React.FC<{ items: Skill[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Skills</SectionTitle>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {items?.map(item => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            width: 'calc(50% - 8px)'
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
            <HTMLWithVerifiedLinks htmlContent={item.skills || item.name} />
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
)

const ProfessionalAffiliationsSection: React.FC<{ items: ProfessionalAffiliation[] }> = ({
  items
}) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Professional Affiliations</SectionTitle>
    {items?.map(item => (
      <Box key={item.id} sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          {item.verificationStatus === 'verified' && <BlueVerifiedBadge />}
          <Box sx={{ ml: item.verificationStatus === 'verified' ? 1 : 0 }}>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 700, fontSize: '16px', fontFamily: 'Arial' }}
            >
              {item.name}
              {item.organization && ` of the ${item.organization}`}
            </Typography>
            {(item.startDate || item.endDate) && (
              <Typography
                variant='body2'
                sx={{
                  color: '#000',
                  fontFamily: 'Arial',
                  fontSize: '16px',
                  fontWeight: 400
                }}
              >
                {item.showDuration
                  ? `Duration: ${item.startDate} - ${item.endDate || 'Present'}`
                  : `${item.startDate} - ${item.endDate || 'Present'}`}
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
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
)

const LanguagesSection: React.FC<{ items: Language[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Languages</SectionTitle>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {items?.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: 'calc(50% - 8px)'
          }}
        >
          <Typography sx={{ fontWeight: 400, fontSize: '16px', fontFamily: 'Arial' }}>
            {item.name} {item.proficiency && `(${item.proficiency})`}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
)

const HobbiesSection: React.FC<{ items: string[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Hobbies and Interests</SectionTitle>
    <Box component='ul' sx={{ pl: 2 }}>
      {items?.map((hobby, index) => (
        <Typography
          component='li'
          key={index}
          sx={{ fontWeight: 400, fontSize: '16px', fontFamily: 'Arial', mb: 1 }}
        >
          {hobby}
        </Typography>
      ))}
    </Box>
  </Box>
)

const CertificationsSection: React.FC<{ items: Certification[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Certifications</SectionTitle>
    {items?.map(item => (
      <Box key={item.id} sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          {item.verificationStatus === 'verified' && <BlueVerifiedBadge />}
          <Box sx={{ ml: item.verificationStatus === 'verified' ? 1 : 0 }}>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 700, fontSize: '16px', fontFamily: 'Arial' }}
            >
              {item.name}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: '#000',
                fontFamily: 'Arial',
                fontSize: '16px',
                fontWeight: 400
              }}
            >
              {item.issuer} | {item.issueDate} - {item.expiryDate || 'No Expiration'}
            </Typography>
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
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
)

const AwardsSection: React.FC<{ items: Award[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Achievements</SectionTitle>
    <Box component='ul' sx={{ pl: 2 }}>
      {items?.map(item => (
        <Typography
          component='li'
          key={item.id}
          sx={{
            fontWeight: 400,
            fontSize: '16px',
            fontFamily: 'Arial',
            mb: 1
          }}
        >
          <Box component='span' sx={{ fontWeight: 700 }}>
            {item.title}
          </Box>
          {item.issuer && ` from ${item.issuer}`}
          {item.date && ` (${item.date})`}
          {item.description && ` - ${item.description}`}
        </Typography>
      ))}
    </Box>
  </Box>
)

const ProjectsSection: React.FC<{ items: Project[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Projects</SectionTitle>
    {items?.map(item => (
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
            <Typography
              variant='body2'
              sx={{ mb: 1, fontFamily: 'Arial', fontSize: '16px', fontWeight: 400 }}
            >
              <HTMLWithVerifiedLinks htmlContent={item.description} />
            </Typography>
            {item.url && (
              <Box sx={{ mb: 1 }}>
                <LinkWithFavicon url={item.url} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
)

const PublicationsSection: React.FC<{ items: Publication[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Publications</SectionTitle>
    {items?.map(item => (
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
    ))}
  </Box>
)

const VolunteerWorkSection: React.FC<{ items: VolunteerWork[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Volunteer Work</SectionTitle>
    {items?.map(item => (
      <Box key={item.id} sx={{ mb: 2 }}>
        <Typography
          variant='subtitle1'
          sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '16px' }}
        >
          {item.role} at {item.organization}
        </Typography>
        <Typography
          variant='body2'
          sx={{ fontFamily: 'Arial', fontSize: '16px', fontWeight: 400 }}
        >
          {item.startDate} - {item.endDate || 'Present'}
        </Typography>
        {item.description && (
          <Typography
            variant='body2'
            sx={{ mb: 1, fontFamily: 'Arial', fontSize: '16px', fontWeight: 400 }}
          >
            <HTMLWithVerifiedLinks htmlContent={item.description} />
          </Typography>
        )}
      </Box>
    ))}
  </Box>
)

const usePagination = (content: ReactNode[], maxHeight: number) => {
  const [pages, setPages] = useState<ReactNode[][]>([])
  const measureRef = useRef<HTMLDivElement>(null)
  const measuredRef = useRef<boolean>(false)

  useLayoutEffect(() => {
    const timeoutId = setTimeout(() => {
      measureAndPaginate()
    }, 100)

    const measureAndPaginate = () => {
      if (!measureRef.current) return

      const mmToPx = (mm: number) => mm * 3.779527559
      const maxHeightPx = mmToPx(maxHeight)
      const contentElements = Array.from(measureRef.current.children)

      if (contentElements.length === 0) {
        setTimeout(measureAndPaginate, 100)
        return
      }

      const contentHeights = contentElements.map(el => el.getBoundingClientRect().height)

      let currentPage: ReactNode[] = []
      let currentHeight = 0
      const paginatedContent: ReactNode[][] = []

      for (let i = 0; i < content.length; i++) {
        const section = content[i]
        const sectionHeight = contentHeights[i]

        if (currentHeight + sectionHeight > maxHeightPx) {
          if (currentPage.length > 0) {
            paginatedContent.push([...currentPage])
            currentPage = []
            currentHeight = 0
          }

          if (sectionHeight > maxHeightPx) {
            paginatedContent.push([section])
          } else {
            currentPage = [section]
            currentHeight = sectionHeight
          }
          continue
        }

        currentPage.push(section)
        currentHeight += sectionHeight
      }

      if (currentPage.length > 0) {
        paginatedContent.push(currentPage)
      }

      setPages(paginatedContent)
      measuredRef.current = true
    }

    if (!measuredRef.current) {
      measureAndPaginate()
    }

    const handleResize = () => {
      measuredRef.current = false
      measureAndPaginate()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [content, maxHeight])

  return { pages, measureRef }
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data: propData }) => {
  const storeResume = useSelector((state: RootState) => state.resume?.resume)
  const resume = propData || storeResume

  const contentSections: ReactNode[] = []

  const { pages, measureRef } = usePagination(
    contentSections,
    parseInt(PAGE_SIZE.maxContentHeight)
  )

  if (!resume) return null

  if (resume?.summary) {
    contentSections.push(<SummarySection key='summary' summary={resume.summary} />)
  }

  if (
    resume?.contact?.socialLinks &&
    Object.values(resume.contact.socialLinks).some(link => !!link)
  ) {
    contentSections.push(
      <SocialLinksSection key='social' socialLinks={resume.contact.socialLinks} />
    )
  }

  if (resume?.experience?.items && resume.experience.items.length > 0) {
    contentSections.push(
      <ExperienceSection key='experience' items={resume.experience.items} />
    )
  }

  if (resume?.certifications?.items && resume.certifications.items.length > 0) {
    contentSections.push(
      <CertificationsSection key='certifications' items={resume.certifications.items} />
    )
  }

  if (resume?.awards?.items && resume.awards.items.length > 0) {
    contentSections.push(<AwardsSection key='awards' items={resume.awards.items} />)
  }

  if (resume?.education?.items && resume.education.items.length > 0) {
    contentSections.push(
      <EducationSection key='education' items={resume.education.items} />
    )
  }

  if (resume?.skills?.items && resume.skills.items.length > 0) {
    contentSections.push(<SkillsSection key='skills' items={resume.skills.items} />)
  }

  if (
    resume?.professionalAffiliations?.items &&
    resume.professionalAffiliations.items.length > 0
  ) {
    contentSections.push(
      <ProfessionalAffiliationsSection
        key='affiliations'
        items={resume.professionalAffiliations.items}
      />
    )
  }

  if (resume?.languages?.items && resume.languages.items.length > 0) {
    contentSections.push(
      <LanguagesSection key='languages' items={resume.languages.items} />
    )
  }

  if (resume?.hobbiesAndInterests && resume.hobbiesAndInterests.length > 0) {
    contentSections.push(
      <HobbiesSection key='hobbies' items={resume.hobbiesAndInterests} />
    )
  }

  if (resume?.projects?.items && resume.projects.items.length > 0) {
    contentSections.push(<ProjectsSection key='projects' items={resume.projects.items} />)
  }

  if (resume?.publications?.items && resume.publications.items.length > 0) {
    contentSections.push(
      <PublicationsSection key='publications' items={resume.publications.items} />
    )
  }

  if (resume?.volunteerWork?.items && resume.volunteerWork.items.length > 0) {
    contentSections.push(
      <VolunteerWorkSection key='volunteer' items={resume.volunteerWork.items} />
    )
  }

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
      <Box
        sx={{ position: 'absolute', visibility: 'hidden', width: PAGE_SIZE.width }}
        ref={measureRef}
      >
        {contentSections}
      </Box>

      {pages?.map((pageContent, pageIndex) => (
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
              boxShadow: 'none',
              m: 0,
              pageBreakAfter: 'avoid'
            }
          }}
        >
          <PageHeader fullName={resume?.contact?.fullName || 'Your Name'} />
          <Box
            sx={{
              height: PAGE_SIZE.maxContentHeight,
              py: '20px',
              px: '73px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {pageContent}
          </Box>
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <PageFooter
              fullName={resume?.contact?.fullName || 'Your Name'}
              email={resume?.contact?.email || 'email@example.com'}
              phone={resume?.contact?.phone}
              pageNumber={pageIndex + 1}
              totalPages={pages.length}
            />
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default ResumePreview
