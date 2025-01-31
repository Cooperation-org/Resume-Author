import { useState, useEffect, useCallback } from 'react'
import { GoogleDriveStorage } from '@cooperation/vc-storage'
import { getCookie, getLocalStorage } from '../tools'

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
  const accessToken = getCookie('accessToken')
  // if (!accessToken) {
  //   throw new Error('Access token not found')
  // }

  const [storage, setStorage] = useState<GoogleDriveStorage | null>(null)

  useEffect(() => {
    if (accessToken) {
      try {
        const storageInstance = new GoogleDriveStorage(accessToken)
        setStorage(storageInstance)
      } catch (error) {
        console.error('Error initializing GoogleDriveStorage:', error)
      }
    } else {
      console.warn('No access token available.')
    }
  }, [accessToken])

  const memoizedStorage = storage

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
    storage
  }
}

export default useGoogleDrive
