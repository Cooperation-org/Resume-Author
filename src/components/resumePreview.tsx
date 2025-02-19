import React, { useEffect, useRef, useState, ReactNode } from 'react'
import { Box, Typography, Link } from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'
import VerifiedIcon from '@mui/icons-material/Verified'

interface VerifiableItem {
  id: string
  verificationStatus?: 'verified' | 'pending' | 'unverified'
}

interface Project extends VerifiableItem {
  name: string
  description: string
  url?: string
  technologies: string[]
}

interface Education extends VerifiableItem {
  degree: string
  field: string
  institution: string
  startDate: string
  endDate: string
  gpa?: number
}

interface Skill extends VerifiableItem {
  name: string
  level?: string
}

interface Certification extends VerifiableItem {
  name: string
  issuer: string
  issueDate: string
  expiryDate: string
  credentialId?: string
}

interface WorkExperience extends VerifiableItem {
  position: string
  company: string
  startDate: string
  endDate?: string
  description: string
  achievements: string[]
}

interface Resume {
  id: string
  contact: {
    fullName: string
    email: string
    phone?: string
    socialLinks?: {
      linkedin?: string
      github?: string
      portfolio?: string
      [key: string]: string | undefined
    }
  }
  summary: string
  experience: {
    items: WorkExperience[]
  }
  education: {
    items: Education[]
  }
  skills: {
    items: Skill[]
  }
  certifications: {
    items: Certification[]
  }
}

interface ResumePreviewProps {
  data: Resume & {
    projects: {
      items: Project[]
    }
  }
}

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

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <img
        src={`https://www.google.com/s2/favicons?domain=${faviconDomain}&sz=32`}
        alt={`${domain} favicon`}
        style={{ width: 16, height: 16 }}
      />
      <Link
        href={`https://${cleanUrl}`}
        target='_blank'
        rel='noopener noreferrer'
        sx={{
          color: '#2563EB',
          textDecoration: 'underline',
          fontSize: '14px',
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
  )
}

const VerificationBadge: React.FC = () => (
  <VerifiedIcon sx={{ color: '#2563EB', fontSize: 16, mr: 1 }} />
)

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
      justifyContent: 'center'
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
        lineHeight: '15px'
      }}
    >
      {fullName} | Page {pageNumber} of {totalPages} | {phone && `${phone} |`} {email}
    </Typography>
  </Box>
)

const SummarySection: React.FC<{ summary: string }> = ({ summary }) => (
  <Box sx={{ mb: 4 }}>
    <SectionTitle>Professional Summary</SectionTitle>
    <Typography variant='body2' sx={{ color: '#333' }}>
      {summary}
    </Typography>
  </Box>
)

const SocialLinksSection: React.FC<{
  socialLinks?: { [key: string]: string | undefined }
}> = ({ socialLinks }) => (
  <Box sx={{ mb: 4 }}>
    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
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
  <Box sx={{ mb: 4 }}>
    <SectionTitle>Work Experience</SectionTitle>
    {items.map(item => (
      <Box key={item.id} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {item.verificationStatus === 'verified' && <VerificationBadge />}
          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            {item.position}
          </Typography>
        </Box>
        <Typography variant='body2' sx={{ color: '#666' }}>
          {item.company}
        </Typography>
        <Typography variant='body2' sx={{ color: '#666', mb: 1 }}>
          {item.startDate} – {item.endDate ?? 'Present'}
        </Typography>
        <Typography variant='body2' sx={{ mb: 1 }}>
          {item.description}
        </Typography>
        <Box component='ul' sx={{ m: 0, pl: 2 }}>
          {item.achievements.map((achievement, idx) => (
            <Typography
              component='li'
              variant='body2'
              key={`${item.id}-achievement-${idx}`}
              sx={{ mb: 0.5 }}
            >
              {achievement}
            </Typography>
          ))}
        </Box>
      </Box>
    ))}
  </Box>
)

const EducationSection: React.FC<{ items: Education[] }> = ({ items }) => (
  <Box sx={{ mb: 4 }}>
    <SectionTitle>Education</SectionTitle>
    {items.map(item => (
      <Box key={item.id} sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {item.verificationStatus === 'verified' && <VerificationBadge />}
          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            {item.degree} in {item.field}
          </Typography>
        </Box>
        <Typography variant='body2' sx={{ color: '#666' }}>
          {item.institution}
        </Typography>
        <Typography variant='body2' sx={{ color: '#666' }}>
          {item.startDate} – {item.endDate}
          {item.gpa && ` | GPA: ${item.gpa}`}
        </Typography>
      </Box>
    ))}
  </Box>
)

const SkillsSection: React.FC<{ items: Skill[] }> = ({ items }) => (
  <Box sx={{ mb: 4 }}>
    <SectionTitle>Skills</SectionTitle>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {items.map(item => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: 'calc(50% - 8px)'
          }}
        >
          {item.verificationStatus === 'verified' && <VerificationBadge />}
          <Typography variant='body2'>{item.name}</Typography>
          {item.level && (
            <Typography variant='caption' sx={{ color: '#666', ml: 'auto' }}>
              {item.level}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  </Box>
)

const CertificationsSection: React.FC<{ items: Certification[] }> = ({ items }) => (
  <Box sx={{ mb: 4 }}>
    <SectionTitle>Certifications</SectionTitle>
    {items.map(item => (
      <Box key={item.id} sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {item.verificationStatus === 'verified' && <VerificationBadge />}
          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            {item.name}
          </Typography>
        </Box>
        <Typography variant='body2' sx={{ color: '#666' }}>
          {item.issuer} | {item.issueDate} - {item.expiryDate}
        </Typography>
        {item.verificationStatus === 'verified' && item.credentialId && (
          <Typography variant='body2' sx={{ color: '#2563EB' }}>
            Credential ID: {item.credentialId}
          </Typography>
        )}
      </Box>
    ))}
  </Box>
)

const ProjectsSection: React.FC<{ items: Project[] }> = ({ items }) => (
  <Box sx={{ mb: 4 }}>
    <SectionTitle>Projects</SectionTitle>
    {items.map(item => (
      <Box key={item.id} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {item.verificationStatus === 'verified' && <VerificationBadge />}
          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            {item.name}
          </Typography>
        </Box>
        <Typography variant='body2' sx={{ mb: 1 }}>
          {item.description}
        </Typography>
        {item.url && (
          <Box sx={{ mb: 1 }}>
            <LinkWithFavicon url={item.url} />
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {item.technologies.map(tech => (
            <Box
              key={`${item.id}-${tech}`}
              sx={{
                bgcolor: '#F3F4F6',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem'
              }}
            >
              {tech}
            </Box>
          ))}
        </Box>
      </Box>
    ))}
  </Box>
)

const usePagination = (content: ReactNode[], maxHeight: number) => {
  const [pages, setPages] = useState<ReactNode[][]>([])
  const measureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const measureAndPaginate = () => {
      if (!measureRef.current) return

      const mmToPx = (mm: number) => mm * 3.779527559
      const maxHeightPx = mmToPx(maxHeight)
      const contentElements = Array.from(measureRef.current.children)
      const contentHeights = contentElements.map(el => el.getBoundingClientRect().height)

      let currentPage: ReactNode[] = []
      let currentHeight = 0
      const paginatedContent: ReactNode[][] = []

      const addSectionToPage = (section: ReactNode, index: number) => {
        currentPage.push(section)
        currentHeight += contentHeights[index]
      }

      const startNewPage = (section: ReactNode, index: number) => {
        if (currentPage.length > 0) {
          paginatedContent.push([...currentPage])
        }
        currentPage = [section]
        currentHeight = contentHeights[index]
      }

      for (let i = 0; i < content.length; i++) {
        const section = content[i]
        const sectionHeight = contentHeights[i]
        const nextSectionHeight = i < content.length - 1 ? contentHeights[i + 1] : 0

        if (currentHeight + sectionHeight > maxHeightPx) {
          startNewPage(section, i)
          continue
        }

        if (
          i < content.length - 1 &&
          currentHeight + sectionHeight + nextSectionHeight > maxHeightPx &&
          nextSectionHeight < maxHeightPx
        ) {
          startNewPage(section, i)
          continue
        }

        addSectionToPage(section, i)
      }

      if (currentPage.length > 0) {
        paginatedContent.push(currentPage)
      }

      setPages(paginatedContent)
    }

    measureAndPaginate()
    window.addEventListener('resize', measureAndPaginate)
    return () => window.removeEventListener('resize', measureAndPaginate)
  }, [content, maxHeight])

  return { pages, measureRef }
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const content = [
    <SummarySection key='summary' summary={data.summary} />,
    <SocialLinksSection key='social' socialLinks={data.contact.socialLinks} />,
    <ExperienceSection key='experience' items={data.experience.items} />,
    <EducationSection key='education' items={data.education.items} />,
    <SkillsSection key='skills' items={data.skills.items} />,
    <CertificationsSection key='certifications' items={data.certifications.items} />,
    <ProjectsSection key='projects' items={data.projects.items} />
  ]

  const { pages, measureRef } = usePagination(
    content,
    parseInt(PAGE_SIZE.maxContentHeight)
  )

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box
        sx={{ position: 'absolute', visibility: 'hidden', width: PAGE_SIZE.width }}
        ref={measureRef}
      >
        {content}
      </Box>

      {pages.map((pageContent, pageIndex) => (
        <Box
          key={`page-${pageIndex}`}
          sx={{
            width: PAGE_SIZE.width,
            height: PAGE_SIZE.height,
            position: 'relative',
            bgcolor: '#fff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            mx: 'auto',
            '@media print': {
              boxShadow: 'none',
              m: 0,
              pageBreakAfter: 'always'
            }
          }}
        >
          <PageHeader fullName={data.contact.fullName} />
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
              fullName={data.contact.fullName}
              email={data.contact.email}
              phone={data.contact.phone}
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
