import { NavigateFunction } from 'react-router-dom'
import { setLocalStorage, setCookie } from './cookie'

export const login = async () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI
  const scope = process.env.REACT_APP_GOOGLE_SCOPE

  if (!clientId || !redirectUri || !scope) {
    throw new Error('Missing environment variables for Google login')
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&prompt=consent`

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

  // Save the token in cookies
  setCookie('auth_token', token, {
    secure: true,
    sameSite: 'strict',
    expires: 7
  })

  setLocalStorage('auth', token)

  // Fetch user info if needed
  fetchUserInfo(token)
    .then(() => {
      // Navigate to home page after successful login
      navigate('/', { replace: true })
    })
    .catch(error => {
      console.error('Error fetching user info:', error)
      // Still navigate to home page even if user info fetch fails
      navigate('/', { replace: true })
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
