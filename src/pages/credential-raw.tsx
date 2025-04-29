import React, { useState, useEffect, useCallback } from 'react'
import { getFileViaFirebase } from '../firebase/storage'
import { useParams, useLocation } from 'react-router-dom'

const RawPreview = () => {
  const [rawCredential, setRawCredential] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { fileId } = useParams<{ fileId: string }>()
  const location = useLocation()
  const [viewType, setViewType] = useState<'formatted' | 'raw'>('formatted')

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

  // Function to download JSON file
  const downloadJson = () => {
    if (!rawCredential) return

    // Create a Blob with the JSON data
    const blob = new Blob([JSON.stringify(rawCredential, null, 2)], {
      type: 'application/json'
    })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element
    const a = document.createElement('a')
    a.href = url
    a.download = `credential-${getFullFileId()}.json`

    // Trigger the download
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div>Loading credential...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h2>Raw Credential</h2>
      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setViewType('formatted')} style={{ marginRight: '10px' }}>
          Formatted View
        </button>
        <button onClick={() => setViewType('raw')}>Raw View</button>
        <button onClick={downloadJson} style={{ marginLeft: '10px' }}>
          Download JSON
        </button>
      </div>

      {viewType === 'formatted' ? (
        <pre
          style={{
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '5px',
            overflow: 'auto'
          }}
        >
          {JSON.stringify(rawCredential, null, 2)}
        </pre>
      ) : (
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(rawCredential)}
        </div>
      )}
    </div>
  )
}

export default RawPreview
