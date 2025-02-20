import { useState, useEffect, useCallback } from 'react'
import { GoogleDriveStorage, Resume, ResumeVC } from '@cooperation/vc-storage'
import { getCookie, getLocalStorage } from '../tools/cookie'

interface ClaimDetail {
  data: {
    '@context': string[]
    id: string
    type: string[]
    issuer: {
      id: string
      type: string[]
    }
    issuanceDate: string
    expirationDate: string
    credentialSubject: {
      [x: string]: any
      type: string[]
      name: string
      achievement: any
      duration: string
      portfolio: any
    }
  }
}

const useGoogleDrive = () => {
  const accessToken = getCookie('auth_token')
  // if (!accessToken) {
  //   throw new Error('Access token not found')
  // }

  const [instances, setInstances] = useState<{
    storage: GoogleDriveStorage | null
    resumeManager: Resume | null
    resumeVC: ResumeVC | null
  } | null>({
    storage: null,
    resumeManager: null,
    resumeVC: null
  })

  useEffect(() => {
    if (accessToken) {
      try {
        const storageInstance = new GoogleDriveStorage(accessToken)
        const resumeManager = new Resume(storageInstance)
        const resumeVC = new ResumeVC()
        setInstances({
          storage: storageInstance,
          resumeManager,
          resumeVC
        })
      } catch (error) {
        console.error('Error initializing GoogleDriveStorage:', error)
      }
    } else {
      console.warn('No access token available.')
    }
  }, [accessToken])

  const memoizedStorage = instances?.storage

  const getContent = useCallback(
    async (fileID: string): Promise<ClaimDetail | null> => {
      if (!memoizedStorage) {
        console.warn('Storage instance is not available.')
        return null
      }
      try {
        const file = await memoizedStorage.retrieve(fileID)
        return file as unknown as ClaimDetail
      } catch (error) {
        console.error('Error retrieving file:', error)
        return null
      }
    },
    [memoizedStorage]
  )

  return {
    getContent,
    instances
  }
}

export default useGoogleDrive
