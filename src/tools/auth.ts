import { NavigateFunction } from 'react-router-dom'
import { setLocalStorage, setCookie } from '.'

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
  // Get the hash fragment from the URL
  const hash = window.location.hash
  if (!hash) {
    console.error('No token found in the URL')
    return
  }

  const params = new URLSearchParams(hash.substring(1)) // Remove the '#' and parse
  const token = params.get('access_token')
  if (!token) {
    console.error('No access token found')
    return
  }

  // Save the token in cookies
  setCookie('accessToken', token, {
    secure: true,
    sameSite: 'strict',
    expires: 7
  })
  setLocalStorage('auth', token)

  // Optionally, fetch user info using the token
  fetchUserInfo(token)

  if (navigate) {
    navigate('/resume/new')
  }
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
