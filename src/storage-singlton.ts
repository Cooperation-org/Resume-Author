// storage-singleton.ts
import { GoogleDriveStorage, Resume, ResumeVC } from '@cooperation/vc-storage'

// Singleton class to maintain storage instances
class StorageService {
  private static instance: StorageService
  private storage: GoogleDriveStorage | null = null
  private resumeManager: Resume | null = null
  private resumeVC: ResumeVC | null = null
  private token: string | null = null

  private constructor() {}

  // Static method to get the singleton instance
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  // Initialize or update with token
  public initialize(accessToken: string): void {
    // Only initialize if token is different or instances don't exist
    if (this.token !== accessToken || !this.storage || !this.resumeManager) {
      console.log('Initializing storage service with new token')
      this.token = accessToken
      this.storage = new GoogleDriveStorage(accessToken)
      this.resumeManager = new Resume(this.storage)
      this.resumeVC = new ResumeVC()
    }
  }

  // Getters
  public getStorage(): GoogleDriveStorage {
    if (!this.storage) {
      throw new Error('Storage not initialized. Call initialize() first.')
    }
    return this.storage
  }

  public getResumeManager(): Resume {
    if (!this.resumeManager) {
      throw new Error('Resume manager not initialized. Call initialize() first.')
    }
    return this.resumeManager
  }

  public getResumeVC(): ResumeVC {
    if (!this.resumeVC) {
      throw new Error('ResumeVC not initialized. Call initialize() first.')
    }
    return this.resumeVC
  }

  // Check if initialized
  public isInitialized(): boolean {
    return !!this.storage && !!this.resumeManager
  }
}

export default StorageService
