import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleRedirect } from '../tools/auth'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    handleRedirect({ navigate })
  }, [navigate])

  return <div>Processing login...</div>
}

export default AuthCallback
