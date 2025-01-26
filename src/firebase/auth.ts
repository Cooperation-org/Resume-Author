import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup, signOut, User } from 'firebase/auth'
import { setCookie, setLocalStorage } from '../tools'
import { getAccessToken } from './storage'

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    if (!result.user) {
      throw new Error('No user found')
    }
    setCookie('refresh_token', result.user.refreshToken, {
      secure: true,
      sameSite: 'strict',
      expires: 7
    })
    const accessToken = await getAccessToken(result.user.uid)
    console.log('🚀 ~ signInWithGoogle ~ accessToken:', accessToken)
    if (accessToken) {
      setCookie('access_token', accessToken, {
        secure: true,
        sameSite: 'strict',
        expires: 7
      })
    }
    setLocalStorage('user', JSON.stringify(result.user))

    return result.user
  } catch (error) {
    console.error('Error signing in with Google:', error)
    return null
  }
}

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
