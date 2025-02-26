import React from 'react'
import { Box } from '@mui/material'
import { BlueVerifiedBadge } from '../assets/svgs'

export const cleanHTML = (htmlContent: string): string => {
  if (!htmlContent) return ''

  return htmlContent
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p><\/p>/g, '')
    .replace(/<br>/g, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
}

export const HTMLWithVerifiedLinks: React.FC<{ htmlContent: string }> = ({
  htmlContent
}) => {
  if (!htmlContent) return null

  const cleanedHTML = cleanHTML(htmlContent)
  const hasLinkedCredsLinks = cleanedHTML.includes('linkedcreds.allskillscount.org/view/')

  if (!hasLinkedCredsLinks) {
    return <span dangerouslySetInnerHTML={{ __html: cleanedHTML }} />
  }

  // Split the HTML into parts at each linkedcreds link
  const parts: Array<{ type: 'html' | 'verified-link'; content: string }> = []
  const regex =
    /(<a[^>]*href="[^"]*linkedcreds\.allskillscount\.org\/view\/[^"]*"[^>]*>.*?<\/a>)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(cleanedHTML)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'html',
        content: cleanedHTML.substring(lastIndex, match.index)
      })
    }

    parts.push({
      type: 'verified-link',
      content: match[0]
    })

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < cleanedHTML.length) {
    parts.push({
      type: 'html',
      content: cleanedHTML.substring(lastIndex)
    })
  }

  return (
    <>
      {parts.map((part, index) =>
        part.type === 'html' ? (
          <span key={index} dangerouslySetInnerHTML={{ __html: part.content }} />
        ) : (
          <Box key={index} sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <BlueVerifiedBadge />
            <span dangerouslySetInnerHTML={{ __html: part.content }} />
          </Box>
        )
      )}
    </>
  )
}

export const isVerifiedLink = (url: string): boolean => {
  if (!url) return false
  return url.includes('linkedcreds.allskillscount.org/view/')
}
