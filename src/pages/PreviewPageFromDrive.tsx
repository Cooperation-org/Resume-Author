import React, { useEffect, useState, useCallback } from 'react'
import { Box, CircularProgress, Typography, IconButton } from '@mui/material'
import { useParams } from 'react-router-dom'
import { GoogleDriveStorage } from '@cooperation/vc-storage'
import { getLocalStorage } from '../tools/cookie'
import ResumePreview from '../components/resumePreview'
import html2pdf from 'html2pdf.js'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

// Define a type for the raw credential data structure
type RawCredentialData = {
  content?: {
    credentialSubject?: Record<string, any>
  }
  credentialSubject?: Record<string, any>
  issuanceDate?: string
  data?: Record<string, any>
}

const PreviewPageFromDrive: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [resumeData, setResumeData] = useState<Resume | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Type guard and helper functions
  const safeGet = useCallback((obj: any, path: string[], defaultValue = ''): string => {
    return path.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue),
      obj
    )
  }, [])

  const extractSocialLinks = useCallback(
    (socialLinks: any) => ({
      linkedin: safeGet(socialLinks, ['linkedin'], ''),
      github: safeGet(socialLinks, ['github'], ''),
      portfolio: safeGet(socialLinks, ['portfolio'], ''),
      twitter: safeGet(socialLinks, ['twitter'], '')
    }),
    [safeGet]
  )

  const exportResumeToPDF = () => {
    if (!resumeData) return

    const element = document.getElementById('resume-preview')
    if (!element) return

    const options = {
      margin: [0, 0, 0, 0],
      filename: `${resumeData.contact.fullName}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    const metadata = {
      title: `${resumeData.contact.fullName}'s Resume`,
      creator: 'Reactive Resume',
      subject: 'Resume',
      keywords: ['Resume', 'CV', resumeData.contact.fullName],
      custom: { resumeData: JSON.stringify(resumeData) }
    }

    html2pdf().set(metadata).from(element).set(options).save()
  }

  useEffect(() => {
    const fetchResumeFromDrive = async () => {
      try {
        // Get access token from local storage
        const accessToken = getLocalStorage('auth')

        if (!accessToken) {
          throw new Error('No authentication token found')
        }

        // Initialize Google Drive Storage
        const storage = new GoogleDriveStorage(accessToken as string)

        // Fetch the specific resume file by ID
        const fileData = await storage.retrieve(id!)

        // Parse the file content
        const parsedContent: RawCredentialData = fileData?.data || {}

        // Determine the correct data structure
        const resumeContent: Record<string, any> = parsedContent.content
          ? parsedContent.content.credentialSubject || {}
          : parsedContent.credentialSubject || {}

        // Transform the data to match the Resume type
        const transformedResumeData: Resume = {
          id: '',
          lastUpdated: parsedContent.issuanceDate || new Date().toISOString(),
          name: safeGet(resumeContent, ['person', 'name', 'formattedName'], ''),
          version: 1,
          contact: {
            fullName: safeGet(resumeContent, ['person', 'contact', 'fullName'], ''),
            email: safeGet(resumeContent, ['person', 'contact', 'email'], ''),
            phone: safeGet(resumeContent, ['person', 'contact', 'phone'], ''),
            location: {
              street: safeGet(
                resumeContent,
                ['person', 'contact', 'location', 'street'],
                ''
              ),
              city: safeGet(resumeContent, ['person', 'contact', 'location', 'city'], ''),
              state: safeGet(
                resumeContent,
                ['person', 'contact', 'location', 'state'],
                ''
              ),
              country: safeGet(
                resumeContent,
                ['person', 'contact', 'location', 'country'],
                ''
              ),
              postalCode: safeGet(
                resumeContent,
                ['person', 'contact', 'location', 'postalCode'],
                ''
              )
            },
            socialLinks: extractSocialLinks(
              resumeContent.person?.contact?.socialLinks || {}
            )
          },
          summary: safeGet(resumeContent, ['narrative', 'text'], ''),
          experience: {
            items: [
              ...(resumeContent.employmentHistory || []),
              ...(resumeContent.experience || [])
            ].map(
              (exp: Record<string, any>): WorkExperience => ({
                id: exp.id || '',
                title: exp.title || '',
                company: exp.organization?.tradeName || exp.company || '',
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
            items: (resumeContent.educationAndLearning || []).map(
              (edu: Record<string, any>): Education => ({
                id: edu.id || '',
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
                duration: edu.duration || '',
                awardEarned: false,
                verificationStatus: 'unverified',
                credentialLink: ''
              })
            )
          },
          skills: {
            items: (resumeContent.skills || []).map(
              (skill: Record<string, any>): Skill => ({
                id: skill.id || '',
                skills: skill.skills || skill.name || '',
                verificationStatus: 'unverified',
                credentialLink: ''
              })
            )
          },
          awards: {
            items: (resumeContent.awards || []).map(
              (award: Record<string, any>): Award => ({
                id: award.id || '',
                title: award.title || '',
                description: award.description || '',
                issuer: award.issuer || '',
                date: award.date || '',
                verificationStatus: 'unverified'
              })
            )
          },
          publications: {
            items: (resumeContent.publications || []).map(
              (pub: Record<string, any>): Publication => ({
                id: pub.id || '',
                title: pub.title || '',
                publisher: pub.publisher || '',
                publishedDate: pub.publishedDate || '',
                url: pub.url || '',
                type: 'Other',
                authors: [],
                verificationStatus: 'unverified'
              })
            )
          },
          certifications: {
            items: (resumeContent.certifications || []).map(
              (cert: Record<string, any>): Certification => ({
                id: cert.id || '',
                name: cert.name || '',
                issuer: cert.issuer || '',
                issueDate: cert.issueDate || '',
                expiryDate: cert.expiryDate || '',
                credentialId: cert.credentialId || '',
                verificationStatus: 'unverified',
                noExpiration: !cert.expiryDate,
                score: cert.score || ''
              })
            )
          },
          professionalAffiliations: {
            items: (resumeContent.professionalAffiliations || []).map(
              (affiliation: Record<string, any>): ProfessionalAffiliation => ({
                id: affiliation.id || '',
                name: affiliation.name || '',
                organization: affiliation.organization || '',
                startDate: affiliation.startDate || '',
                endDate: affiliation.endDate || '',
                activeAffiliation: affiliation.activeAffiliation || false,
                showDuration: false,
                verificationStatus: 'unverified',
                credentialLink: '',
                role: affiliation.role || ''
              })
            )
          },
          volunteerWork: {
            items: (resumeContent.volunteerWork || []).map(
              (volunteer: Record<string, any>): VolunteerWork => ({
                id: volunteer.id || '',
                role: volunteer.role || '',
                organization: volunteer.organization || '',
                startDate: volunteer.startDate || '',
                endDate: volunteer.endDate || '',
                description: volunteer.description || '',
                currentlyVolunteering: false,
                duration: '',
                showDuration: false,
                verificationStatus: 'unverified',
                location: volunteer.location || '',
                cause: volunteer.cause || ''
              })
            )
          },
          hobbiesAndInterests: resumeContent.hobbiesAndInterests || [],
          languages: {
            items: (resumeContent.languages || []).map(
              (lang: Record<string, any>): Language => ({
                id: '',
                name: lang.language || '',
                proficiency: (lang.proficiency as 'Basic') || 'Basic',
                verificationStatus: 'unverified',
                certification: lang.certification || '',
                writingLevel: lang.writingLevel || '',
                speakingLevel: lang.speakingLevel || '',
                readingLevel: lang.readingLevel || ''
              })
            )
          },
          testimonials: { items: [] },
          projects: {
            items: (resumeContent.projects || []).map(
              (project: Record<string, any>): Project => ({
                id: project.id || '',
                name: project.name || '',
                description: project.description || '',
                url: project.url || '',
                verificationStatus: 'unverified',
                technologies: project.technologies || [],
                credentialLink: project.credentialLink || ''
              })
            )
          }
        }

        console.log('Transformed Resume Data:', transformedResumeData)

        // Set the resume data
        setResumeData(transformedResumeData)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching resume:', err)
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load resume. Please try again later.'
        )
        setIsLoading(false)
      }
    }

    if (id) {
      fetchResumeFromDrive()
    }
  }, [id, safeGet, extractSocialLinks])

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress size={24} />
        <Typography variant='body1' color='text.secondary'>
          Loading resume data...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography color='error' variant='body1'>
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          display: { xs: 'none', sm: 'block' },
          '@media print': {
            display: 'none'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <IconButton
            onClick={exportResumeToPDF}
            sx={{
              width: '36px',
              height: '36px',
              borderRadius: '4px',
              transition: 'transform, background-color',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'scale(1)'
              },
              '&:active': {
                transform: 'scale(0.95)'
              }
            }}
          >
            <PictureAsPdfIcon sx={{ width: '36px', height: '36px' }} />
          </IconButton>
        </Box>
      </Box>
      {resumeData && <ResumePreview data={resumeData} />}
    </Box>
  )
}

export default PreviewPageFromDrive
