import React, { useState, useEffect, useCallback } from 'react'
import { getFileViaFirebase } from '../firebase/storage'
import { useParams, useLocation } from 'react-router-dom'

const RawPreview = () => {
  const [rawCredential, setRawCredential] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { fileId } = useParams<{ fileId: string }>()
  const location = useLocation()

  const getFullFileId = useCallback((): string => {
    const path = location.pathname
    const prefix = '/credential-raw/'
    if (path.startsWith(prefix)) {
      return path.substring(prefix.length)
    }
    return fileId || ''
  }, [fileId, location.pathname])

  const extractGoogleDriveId = (url: string): string => {
    // Handle Google Drive links in format https://drive.google.com/file/d/{fileId}/view?usp=...
    const regex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/
    const match = url.match(regex)
    if (match && match[1]) {
      return match[1]
    }
    // If not a Google Drive link or different format, return the original
    return url
  }

  useEffect(() => {
    const extractRawCredential = async () => {
      const fullFileId = getFullFileId()

      if (!fullFileId) {
        setError('File ID is missing')
        setLoading(false)
        return
      }

      try {
        // Extract the actual file ID if it's a Google Drive link
        const actualFileId = extractGoogleDriveId(fullFileId)

        console.log('Using file ID:', actualFileId)
        const fileData = await getFileViaFirebase(actualFileId)
        console.log('🚀 ~ extractRawCredential ~ fileData:', fileData)
        setRawCredential(fileData)
      } catch (err) {
        setError('Failed to extract raw credential')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    extractRawCredential()
  }, [fileId, getFullFileId, location.pathname])

  if (loading) {
    return <div>Loading credential...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h2>Raw Credential</h2>
      <pre>{JSON.stringify(rawCredential, null, 2)}</pre>
    </div>
  )
}

export default RawPreview
