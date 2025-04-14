import React, { useEffect, useState, useCallback } from 'react'
import { Box, CircularProgress, Typography, IconButton } from '@mui/material'
import { useParams } from 'react-router-dom'
import { GoogleDriveStorage } from '@cooperation/vc-storage'
import { getLocalStorage } from '../tools/cookie'
import ResumePreview from '../components/resumePreview'
import html2pdf from 'html2pdf.js'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

type RawCredentialData = {
  content?: {
    credentialSubject?: Record<string, any>
  }
  credentialSubject?: Record<string, any>
  issuanceDate?: string
  data?: Record<string, any>
}

interface Testimonial extends VerifiableItem {
  author: string
  text: string
  credentialLink?: string
}

const PreviewPageFromDrive: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [resumeData, setResumeData] = useState<Resume | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      instagram: safeGet(
        socialLinks,
        ['instagram'],
        safeGet(socialLinks, ['twitter'], '')
      )
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
        const accessToken = getLocalStorage('auth')

        if (!accessToken) {
          throw new Error('No authentication token found')
        }

        const storage = new GoogleDriveStorage(accessToken as string)

        const fileData = await storage.retrieve(id!)

        let parsedContent: RawCredentialData = {}
        if (fileData?.data) {
          parsedContent = fileData.data
        } else {
          parsedContent = fileData ?? {}
        }

        let resumeContent: Record<string, any> = {}

        if (parsedContent?.credentialSubject) {
          resumeContent = parsedContent.credentialSubject
        } else if (parsedContent?.content?.credentialSubject) {
          resumeContent = parsedContent.content.credentialSubject
        } else if ((fileData as any)?.credentialSubject) {
          resumeContent = (fileData as any).credentialSubject
        } else if ((fileData as any)?.content?.credentialSubject) {
          resumeContent = (fileData as any).content.credentialSubject
        } else {
          resumeContent = parsedContent ?? fileData ?? {}
        }

        console.log('Raw resume content:', resumeContent)

        const transformedResumeData: Resume = {
          id: id ?? '',
          lastUpdated: parsedContent.issuanceDate ?? new Date().toISOString(),
          name: safeGet(
            resumeContent,
            ['person', 'name', 'formattedName'],
            safeGet(resumeContent, ['name'], 'Untitled Resume')
          ),
          version: 1,
          contact: {
            fullName: safeGet(
              resumeContent,
              ['person', 'contact', 'fullName'],
              safeGet(resumeContent, ['contact', 'fullName'], '')
            ),
            email: safeGet(
              resumeContent,
              ['person', 'contact', 'email'],
              safeGet(resumeContent, ['contact', 'email'], '')
            ),
            phone: safeGet(
              resumeContent,
              ['person', 'contact', 'phone'],
              safeGet(resumeContent, ['contact', 'phone'], '')
            ),
            location: {
              street: safeGet(
                resumeContent,
                ['person', 'contact', 'location', 'street'],
                safeGet(resumeContent, ['contact', 'location', 'street'], '')
              ),
              city: safeGet(
                resumeContent,
                ['person', 'contact', 'location', 'city'],
                safeGet(resumeContent, ['contact', 'location', 'city'], '')
              ),
              state: safeGet(
                resumeContent,
                ['person', 'contact', 'location', 'state'],
                safeGet(resumeContent, ['contact', 'location', 'state'], '')
              ),
              country: safeGet(
                resumeContent,
                ['person', 'contact', 'location', 'country'],
                safeGet(resumeContent, ['contact', 'location', 'country'], '')
              ),
              postalCode: safeGet(
                resumeContent,
                ['person', 'contact', 'location', 'postalCode'],
                safeGet(resumeContent, ['contact', 'location', 'postalCode'], '')
              )
            },
            socialLinks: extractSocialLinks(
              resumeContent.person?.contact?.socialLinks ??
                resumeContent.contact?.socialLinks ??
                {}
            )
          },
          summary: safeGet(
            resumeContent,
            ['narrative', 'text'],
            safeGet(resumeContent, ['summary'], '')
          ),
          experience: {
            items: [
              ...(resumeContent.employmentHistory ?? []),
              ...(resumeContent.experience?.items ?? [])
            ]
              .filter(
                (exp, index, self) =>
                  self.findIndex(
                    t =>
                      t.id === exp.id ||
                      (t.title === exp.title &&
                        t.company === (exp.organization?.tradeName || exp.company) &&
                        t.startDate === exp.startDate &&
                        t.endDate === exp.endDate)
                  ) === index
              )
              .map((exp: Record<string, any>): WorkExperience => {
                const startDate = exp.startDate ?? ''
                const endDate = exp.endDate ?? ''
                const duration = exp.duration ?? ''
                const isCurrentlyEmployed =
                  exp.stillEmployed ?? exp.currentlyEmployed ?? false

                return {
                  id: exp.id ?? '',
                  title: exp.title ?? exp.position ?? '',
                  company: exp.organization?.tradeName ?? exp.company ?? '',
                  position: exp.title ?? exp.position ?? '',
                  startDate: startDate,
                  endDate: endDate,
                  description: exp.description ?? '',
                  achievements: exp.achievements ?? [],
                  currentlyEmployed: isCurrentlyEmployed,
                  duration: duration,
                  verificationStatus: exp.verificationStatus ?? 'unverified',
                  credentialLink: exp.credentialLink ?? ''
                }
              })
          },
          education: {
            items: (
              resumeContent.educationAndLearning ??
              resumeContent.education?.items ??
              []
            ).map((edu: Record<string, any>): Education => {
              const startDate = edu.startDate ?? ''
              const endDate = edu.endDate ?? ''
              const duration = edu.duration ?? ''
              const isCurrentlyEnrolled = edu.currentlyEnrolled ?? false

              const degree = edu.degree ?? edu.type ?? ''
              const fieldOfStudy = edu.fieldOfStudy ?? edu.field ?? ''

              return {
                id: edu.id ?? '',
                type: degree,
                programName: fieldOfStudy,
                degree: degree,
                field: fieldOfStudy,
                institution: edu.institution ?? '',
                startDate: startDate,
                endDate: endDate,
                currentlyEnrolled: isCurrentlyEnrolled,
                inProgress: edu.inProgress ?? false,
                description: edu.description ?? '',
                duration: duration,
                awardEarned: edu.awardEarned ?? true,
                verificationStatus: edu.verificationStatus ?? 'unverified',
                credentialLink: edu.credentialLink ?? ''
              }
            })
          },
          skills: {
            items: (resumeContent.skills ?? resumeContent.skills?.items ?? []).map(
              (skill: Record<string, any>): Skill => ({
                id: skill.id ?? '',
                skills: skill.originalSkills ?? skill.skills ?? skill.name ?? '',
                verificationStatus: skill.verificationStatus ?? 'unverified',
                credentialLink: skill.credentialLink ?? ''
              })
            )
          },
          awards: {
            items: (resumeContent.awards ?? resumeContent.awards?.items ?? []).map(
              (award: Record<string, any>): Award => ({
                id: award.id ?? '',
                title: award.title ?? '',
                description: award.description ?? '',
                issuer: award.issuer ?? '',
                date: award.date ?? '',
                verificationStatus: award.verificationStatus ?? 'unverified'
              })
            )
          },
          publications: {
            items: (
              resumeContent.publications ??
              resumeContent.publications?.items ??
              []
            ).map(
              (pub: Record<string, any>): Publication => ({
                id: pub.id ?? '',
                title: pub.title ?? '',
                publisher: pub.publisher ?? '',
                publishedDate: pub.publishedDate ?? pub.date ?? '',
                url: pub.url ?? '',
                type: pub.type ?? 'Other',
                authors: pub.authors ?? [],
                verificationStatus: pub.verificationStatus ?? 'unverified'
              })
            )
          },
          certifications: {
            items: (
              resumeContent.certifications ??
              resumeContent.certifications?.items ??
              []
            ).map((cert: Record<string, any>): Certification => {
              const rawDateValue = cert.issueDate || cert.date || ''
              let processedDate = ''

              if (rawDateValue) {
                try {
                  if (
                    typeof rawDateValue === 'string' &&
                    (rawDateValue.includes('-') || rawDateValue.includes('/'))
                  ) {
                    const dateObj = new Date(rawDateValue)
                    if (!isNaN(dateObj.getTime())) {
                      processedDate = dateObj.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    } else {
                      processedDate = rawDateValue
                    }
                  } else {
                    processedDate = rawDateValue
                  }
                } catch (e) {
                  processedDate = rawDateValue
                }
              }

              return {
                id: cert.id ?? '',
                name: cert.name ?? '',
                issuer: cert.issuer ?? '',
                issueDate: processedDate,
                expiryDate: cert.expiryDate ?? '',
                credentialId: cert.credentialId ?? cert.id ?? '',
                verificationStatus: cert.verificationStatus ?? 'unverified',
                noExpiration:
                  cert.noExpiration !== undefined ? cert.noExpiration : !cert.expiryDate,
                score: cert.score ?? ''
              }
            })
          },
          professionalAffiliations: {
            items: (
              resumeContent.professionalAffiliations ??
              resumeContent.professionalAffiliations?.items ??
              []
            ).map((affiliation: Record<string, any>): ProfessionalAffiliation => {
              const startDate = affiliation.startDate ?? ''
              const endDate = affiliation.endDate ?? ''
              const duration = affiliation.duration ?? ''
              const isActive = affiliation.activeAffiliation ?? false

              return {
                id: affiliation.id ?? '',
                name: affiliation.name ?? affiliation.role ?? '',
                organization: affiliation.organization ?? '',
                startDate: startDate,
                endDate: endDate,
                activeAffiliation: isActive,
                duration: duration,
                verificationStatus: affiliation.verificationStatus ?? 'unverified',
                credentialLink: affiliation.credentialLink ?? '',
                role: affiliation.role ?? affiliation.name ?? ''
              }
            })
          },
          volunteerWork: {
            items: (
              resumeContent.volunteerWork ??
              resumeContent.volunteerWork?.items ??
              []
            ).map((volunteer: Record<string, any>): VolunteerWork => {
              const startDate = volunteer.startDate ?? ''
              const endDate = volunteer.endDate ?? ''
              const duration = volunteer.duration ?? ''
              const isCurrentlyVolunteering = volunteer.currentlyVolunteering ?? false

              return {
                id: volunteer.id ?? '',
                role: volunteer.role ?? '',
                organization: volunteer.organization ?? '',
                startDate: startDate,
                endDate: endDate,
                description: volunteer.description ?? '',
                currentlyVolunteering: isCurrentlyVolunteering,
                duration: duration,
                verificationStatus: volunteer.verificationStatus ?? 'unverified',
                location: volunteer.location ?? '',
                cause: volunteer.cause ?? ''
              }
            })
          },
          hobbiesAndInterests: resumeContent.hobbiesAndInterests ?? [],
          languages: {
            items: (resumeContent.languages ?? resumeContent.languages?.items ?? []).map(
              (lang: Record<string, any>): Language => ({
                id: lang.id ?? '',
                name: lang.language ?? lang.name ?? '',
                proficiency: (lang.proficiency as 'Basic') ?? 'Basic',
                verificationStatus: lang.verificationStatus ?? 'unverified',
                certification: lang.certification ?? '',
                writingLevel: lang.writingLevel ?? '',
                speakingLevel: lang.speakingLevel ?? '',
                readingLevel: lang.readingLevel ?? ''
              })
            )
          },
          testimonials: {
            items: (
              resumeContent.testimonials ??
              resumeContent.testimonials?.items ??
              []
            ).map(
              (test: Record<string, any>): Testimonial => ({
                id: test.id ?? '',
                author: test.author ?? '',
                text: test.text ?? '',
                verificationStatus: test.verificationStatus ?? 'unverified',
                credentialLink: test.credentialLink ?? ''
              })
            )
          },
          projects: {
            items: (resumeContent.projects ?? resumeContent.projects?.items ?? []).map(
              (project: Record<string, any>): Project => {
                const name = project.name ?? ''
                const description = project.description ?? ''
                const url = project.url ?? ''
                const technologies = project.technologies ?? []
                const credentialLink = project.credentialLink ?? ''
                const verificationStatus = project.verificationStatus ?? 'unverified'

                return {
                  id: project.id ?? '',
                  name,
                  description,
                  url,
                  verificationStatus,
                  technologies,
                  credentialLink
                }
              }
            )
          }
        }

        console.log('Transformed Resume Data:', transformedResumeData)

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
