import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

// Define types for TypeScript
interface FaqItem {
  question: string
  answer: string
}

const Faq: React.FC = () => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState<string | false>(false)

  // FAQ data included directly in the component
  const faqData: FaqItem[] = [
    {
      question: 'Is this an application released for widespread production use?',
      answer:
        'No, this is a Proof of Concept with a number of goals:\n\n• Demonstration of verifiable credentials (VCs) and credentials conforming to them (1Edtech CLRv2 and OBv3) being used to create a new resume credential\n• This new resume credential (a compound credential) fully complies with both the HR Open Standards organization schema and subschema for Recruiting used by their Learning and Employment Record Resume Standard (LER-RS), and is fully compatible with the decentralised LER Ecosystem\n• Support the requirement to "meet the industry where it is" by generating from the resume credential a PDF version\n• Acts as a bridge from "where we are today" with "where we hope to be tomorrow" by enabling the credential data to be sent via traditional email or messaging apps\n\nHowever, this is still a Proof of Concept in that it does NOT have a wide variety of credential sections that many individuals might like to include in their resume for a particular job opening.\n\nIt is offered as an open source repository that anyone wishing to build upon it to add features and functionality are encouraged to, including commercializing their efforts using some or all the code from the repository.'
    },
    {
      question: 'What does this cost for me to try out?',
      answer:
        "It is free to use during Proof of Concept period as it is being supported by the T3 Innovation Network of the US Chamber of Commerce Foundation to allow anyone to use it and hopefully provide feedback to the Resume Author builders on their experience of it, their desire to see other features in it, and anything else they'd like to share."
    },
    {
      question: 'What kinds of file formats does the import your resume support?',
      answer:
        "At present it doesn't support importing existing resumes. That's a feature that is needed but currently 'grayed out' as a function because in the initial scope of this Proof of Concept it was considered a lower priority than addressing other standards compatibility challenges."
    },
    {
      question:
        "What's the difference between Sign Up and Login on the main launch page of Resume Author?",
      answer:
        "• Sign Up: To use Resume Author you need a credential wallet designed to store credentials this application creates. The first step is to install the DCC Learner Credential Wallet that has been enhanced to work with Resume Author. Sign Up guides the user through these steps.\n\n• Login: For those users that have already acquired the enhanced version of Learner Credential Wallet, the user simply needs to authorize its access to the Resume Author application. The Login choice takes the user directly to that authorization process. Every use of Resume Author requires this sign as a security precaution to protect the user's stored credential data."
    },
    {
      question: 'Do I have to have a digital wallet to use Resume Author?',
      answer:
        "Yes, you do, but you don't have to use it. This Proof of Concept requires that you download and install on your portable device the Learner Credential Wallet (LCW) from the Digital Credential Consortium. However, you can elect to use Google Drive if you have a Google Drive account, to store your resume in.\n\nCredentials or Resumes used by Resume Author must be stored somewhere. Resume Author offers two options:\n\n• You may use Wallet Attached Storage to your Learner Credential Wallet (LCW)\n• You may use your Google Drive account"
    },
    {
      question: 'Where do I get my Learner Credential Wallet?',
      answer:
        'During this Proof of Concept phase of Resume Author the LCW is being made available via TestFlight and Google Play Console, software tools for beta testing applications intended for mobile devices. This will download the version of the LCW that has been customized to support the features of Resume Author https://lcw.app'
    },
    {
      question: 'Where can I get help?',
      answer:
        'You can send an email to support@resume-author.com (whatever the email will be) to ask for assistance.'
    },
    {
      question: 'Is this a proprietary or commercial application?',
      answer:
        'No, this is an open source project that is intended to demonstrate a new way to create resumes employers can extract information from without using complex and potentially expensive artificial intelligence systems. The code behind it is free for anyone to download and use per its open source license.'
    },
    {
      question: 'What are the licenses under which this application is made available?',
      answer:
        '• The written material associated the application, including manuals, implementation guides, are offered with the Creative Commons CC BY license\n• The software that runs Resume Author is shared with the open source Apache 2 License\n• The source Code Repository is on the Resume Author Github'
    }
  ]

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  // Function to convert text with bullet points into a List component
  const formatAnswer = (text: string) => {
    if (!text.includes('•')) {
      return <Typography variant='body1'>{text}</Typography>
    }

    const paragraphs = text.split('\n\n')

    return (
      <>
        {paragraphs.map((paragraph, paragraphIndex) => {
          if (paragraph.trim().startsWith('•')) {
            const items = paragraph.split('•').filter(item => item.trim() !== '')
            return (
              <List key={paragraphIndex} dense sx={{ pl: 1, mb: 2 }}>
                {items.map((item, itemIndex) => (
                  <ListItem key={itemIndex} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                    </ListItemIcon>
                    <ListItemText primary={item.trim()} />
                  </ListItem>
                ))}
              </List>
            )
          } else {
            return (
              <Typography key={paragraphIndex} variant='body1' paragraph>
                {paragraph}
              </Typography>
            )
          }
        })}
      </>
    )
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          align='center'
          sx={{ mb: 3 }}
        >
          Frequently Asked Questions
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {faqData.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{
              mb: 2,
              boxShadow: 'none',
              '&:before': { display: 'none' },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '4px !important',
              overflow: 'hidden'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{
                bgcolor:
                  expanded === `panel${index}` ? 'primary.light' : 'background.default',
                color:
                  expanded === `panel${index}` ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: expanded === `panel${index}` ? 'primary.light' : 'action.hover'
                }
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper' }}>
              {formatAnswer(faq.answer)}
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Container>
  )
}

export default Faq
