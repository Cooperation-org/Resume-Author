import { useState, useEffect, useCallback } from 'react'
import { GoogleDriveStorage, Resume, ResumeVC } from '@cooperation/vc-storage'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getLocalStorage } from '../tools/cookie'
import StorageService from '../tools/storage-singlton'

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

// Updated useGoogleDrive hook
const useGoogleDrive = () => {
  const accessToken = getLocalStorage('auth')
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (accessToken) {
      try {
        // Initialize the singleton with current token
        const storageService = StorageService.getInstance()
        storageService.initialize(accessToken)
        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing GoogleDriveStorage:', error)
        setIsInitialized(false)
      }
    } else {
      console.warn('No access token available.')
      setIsInitialized(false)
    }
  }, [accessToken])

  const getContent = useCallback(
    async (fileID: string): Promise<ClaimDetail | null> => {
      if (!isInitialized) {
        console.warn('Storage instance is not available.')
        return null
      }

      try {
        const storageService = StorageService.getInstance()
        const storage = storageService.getStorage()
        const file = await storage.retrieve(fileID)
        return file as unknown as ClaimDetail
      } catch (error) {
        console.error('Error retrieving file:', error)
        return null
      }
    },
    [isInitialized]
  )

  // Get instances from the singleton
  const getInstances = useCallback(() => {
    if (!isInitialized) {
      return {
        storage: null,
        resumeManager: null,
        resumeVC: null
      }
    }

    const storageService = StorageService.getInstance()
    return {
      storage: storageService.getStorage(),
      resumeManager: storageService.getResumeManager(),
      resumeVC: storageService.getResumeVC()
    }
  }, [isInitialized])

  return {
    getContent,
    instances: getInstances(),
    isInitialized
  }
}

export default useGoogleDrive
