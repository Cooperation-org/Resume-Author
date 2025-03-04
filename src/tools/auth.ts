import { NavigateFunction } from 'react-router-dom'
import { setLocalStorage } from './cookie'
import { setAuth } from '../redux/slices/auth'
import { store } from '../redux/store'

export const login = async (from?: string) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI
  const scope =
    'openid profile email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata'
  console.log(':  login  scope', scope)
  console.log(':  login  from path', from)

  if (!clientId || !redirectUri) {
    throw new Error('Missing environment variables for Google login')
  }

  // Encode the return path in the state parameter
  const state = from ? encodeURIComponent(from) : ''

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&prompt=consent&access_type=offline&state=${state}`

  window.location.href = authUrl
}

export const handleRedirect = async ({ navigate }: { navigate: NavigateFunction }) => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const state = params.get('state')
  const returnPath = state ? decodeURIComponent(state) : '/'

  if (!code) {
    console.error('No authorization code found')
    navigate('/')
    return
  }

  try {
    const tokenResponse = await exchangeCodeForTokens(code)
    const { access_token, refresh_token } = tokenResponse

    if (!access_token || !refresh_token) {
      throw new Error('Failed to retrieve access token or refresh token')
    }

    // First dispatch the auth state
    store.dispatch(setAuth({ accessToken: access_token }))

    // Then set localStorage
    setLocalStorage('auth', access_token)
    setLocalStorage('refresh_token', refresh_token)

    // Fetch user info
    await fetchUserInfo(access_token)

    // Add a small delay before navigation to ensure state is updated
    setTimeout(() => {
      navigate(returnPath, { replace: true })
    }, 100)
  } catch (error) {
    console.error('Error during token exchange or user info fetch:', error)
    navigate('/')
  }
}

const exchangeCodeForTokens = async (code: string) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
  const clientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing environment variables for token exchange')
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens')
  }

  return response.json()
}

const fetchUserInfo = async (token: string) => {
  try {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch user info')
    }

    const userInfo = await response.json()

    // Save user info in localStorage
    setLocalStorage('user_info', JSON.stringify(userInfo))
    console.log('User info saved in localStorage:', userInfo)
  } catch (error) {
    console.error('Error fetching user info:', error)
    throw error // Re-throw the error to handle it in the calling function
  }
}

const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID || ''
const client_secret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || ''

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id,
        client_secret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    })

    const data = await response.json()
    const newAccessToken = data.access_token
    console.log('🚀 ~ refreshAccessToken ~ newAccessToken:', newAccessToken)

    // Update the access token in Firestore
    localStorage.setItem('auth', newAccessToken)

    return newAccessToken
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw error
  }
}
