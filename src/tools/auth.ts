import { NavigateFunction } from 'react-router-dom'
import { setLocalStorage } from './cookie'

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
  // State parameter is a standard OAuth parameter used to maintain state between the request and callback
  const state = from ? encodeURIComponent(from) : ''

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&prompt=consent&state=${state}`

  window.location.href = authUrl
}

export const handleRedirect = ({ navigate }: { navigate: NavigateFunction }) => {
  const hash = window.location.hash
  if (!hash) {
    console.error('No token found in the URL')
    navigate('/login')
    return
  }

  const params = new URLSearchParams(hash.substring(1))
  const token = params.get('access_token')
  if (!token) {
    console.error('No access token found')
    navigate('/login')
    return
  }

  // Get the state parameter from the URL - this contains our return path
  const state = params.get('state')
  const returnPath = state ? decodeURIComponent(state) : '/'
  console.log(':  Return path from state parameter:', returnPath)

  setLocalStorage('auth', token)

  // Fetch user info if needed
  fetchUserInfo(token)
    .then(() => {
      // Navigate to the original path after successful login
      console.log(':  Navigating to', returnPath)
      navigate(returnPath, { replace: true })
    })
    .catch(error => {
      console.error('Error fetching user info:', error)

      // Still navigate to the original path even if user info fetch fails
      navigate(returnPath, { replace: true })
    })
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
  }
}
