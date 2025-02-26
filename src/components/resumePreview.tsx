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
          {item.verificationStatus === 'verified' && <BlueVerifiedBadge />} &nbsp;
          <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
            {item.position}
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
          {item.startDate} – {item.endDate ?? 'Present'}
        </Typography>
        <Typography
          variant='body2'
          sx={{ mb: 1, fontWeight: 400, fontSize: '16px', fontFamily: 'Arial' }}
        >
          <HTMLWithVerifiedLinks htmlContent={item.description} />
        </Typography>
        <Box component='ul' sx={{ m: 0, pl: 2 }}>
          {item?.achievements?.map((achievement, idx) => (
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
      </Box>
    ))}
  </Box>
)

const EducationSection: React.FC<{ items: Education[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Education</SectionTitle>
    {items?.map(item => (
      <Box key={item.id} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        {item.awardEarned && <BlueVerifiedBadge />} &nbsp;
        <Typography
          variant='subtitle1'
          sx={{ fontWeight: 700, fontSize: '15px', fontFamily: 'Arial' }}
        >
          {item.type} in {item.programName},&nbsp;
        </Typography>
        <Typography
          variant='body2'
          sx={{ color: '#000', fontWeight: 400, fontSize: '15px', fontFamily: 'Arial' }}
        >
          {item.institution},{item.startDate} – {item.endDate}
          {item.gpa && ` | GPA: ${item.gpa}`}
        </Typography>
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
            alignItems: 'center',
            gap: 1,
            width: 'calc(50% - 8px)'
          }}
        >
          {item.verificationStatus === 'verified' && <BlueVerifiedBadge />} &nbsp;
          <Typography sx={{ fontWeight: 400, fontSize: '16px', fontFamily: 'Arial' }}>
            {item.name}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
)

// const CertificationsSection: React.FC<{ items: Certification[] }> = ({ items }) => (
//   <Box sx={{ mb: '30px' }}>
//     <SectionTitle>Certifications</SectionTitle>
//     {items?.map(item => (
//       <Box key={item.id} sx={{ mb: 2 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           {item.verificationStatus === 'verified' && <BlueVerifiedBadge />} &nbsp;
//           <Typography
//             variant='subtitle1'
//             sx={{ fontWeight: 700, fontSize: '16px', fontFamily: 'Arial' }}
//           >
//             {item.name}
//           </Typography>
//         </Box>
//         <Typography
//           variant='body2'
//           sx={{ color: '#000', fontFamily: 'Arial', fontSize: '16px', fontWeight: 400 }}
//         >
//           {item.issuer} | {item.issueDate} - {item.expiryDate}
//         </Typography>
//         {item.verificationStatus === 'verified' && item.credentialId && (
//           <Typography
//             variant='body2'
//             sx={{
//               color: '#2563EB',
//               fontFamily: 'Arial',
//               fontSize: '16px',
//               fontWeight: 400
//             }}
//           >
//             Credential ID: {item.credentialId}
//           </Typography>
//         )}
//         {item.description && (
//           <Typography
//             variant='body2'
//             sx={{
//               color: '#000',
//               fontFamily: 'Arial',
//               fontSize: '16px',
//               fontWeight: 400
//             }}
//           >
//             <HTMLWithVerifiedLinks htmlContent={item.description} />
//           </Typography>
//         )}
//       </Box>
//     ))}
//   </Box>
// )

const ProjectsSection: React.FC<{ items: Project[] }> = ({ items }) => (
  <Box sx={{ mb: '30px' }}>
    <SectionTitle>Projects</SectionTitle>
    {items?.map(item => (
      <Box key={item.id} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {item.verificationStatus === 'verified' && <BlueVerifiedBadge />} &nbsp;
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '16px' }}
          >
            {item.name}
          </Typography>
        </Box>
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
    ))}
  </Box>
)

const usePagination = (content: ReactNode[], maxHeight: number) => {
  const [pages, setPages] = useState<ReactNode[][]>([])
  const measureRef = useRef<HTMLDivElement>(null)
  const measuredRef = useRef<boolean>(false)

  useLayoutEffect(() => {
    const measureAndPaginate = () => {
      if (!measureRef.current) return

      const mmToPx = (mm: number) => mm * 3.779527559
      const maxHeightPx = mmToPx(maxHeight)
      const contentElements = Array.from(measureRef.current.children)
      const contentHeights = contentElements?.map(el => el.getBoundingClientRect().height)

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
    return () => window.removeEventListener('resize', handleResize)
  }, [content, maxHeight])

  return { pages, measureRef }
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const resume = useSelector((state: RootState) => state?.resume.resume)
  console.log(':  resume', resume)
  const content = [
    <SummarySection key='summary' summary={resume?.summary as any} />,
    <SocialLinksSection key='social' socialLinks={resume?.contact.socialLinks} />,
    <ExperienceSection key='experience' items={resume?.experience.items as any} />,
    <EducationSection key='education' items={resume?.education.items as any} />,
    <SkillsSection key='skills' items={resume?.skills.items as any} />,
    // resume?.certifications?.items && (
    //   <CertificationsSection key='certifications' items={resume?.certifications.items} />
    // ),
    <ProjectsSection key='projects' items={resume?.projects.items as any} />
  ]

  const { pages, measureRef } = usePagination(
    content,
    parseInt(PAGE_SIZE.maxContentHeight)
  )

  return (
    <Box
      id='resume-preview'
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{ position: 'absolute', visibility: 'hidden', width: PAGE_SIZE.width }}
        ref={measureRef}
      >
        {content}
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
            // mb: '30px',
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
          <PageHeader fullName={resume?.contact.fullName as any} />
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
              fullName={resume?.contact.fullName as any}
              email={resume?.contact.email as any}
              phone={resume?.contact.phone as any}
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
