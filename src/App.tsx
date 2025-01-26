// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './redux/store'
import { fetchUserResumes, fetchVCs } from './redux/slices/vc'
import Layout from './components/Layout'
import Login from './pages/login'
import Home from './pages/home'
import Resume from './pages/resume'
import ImportPage from './pages/importPage'
import Error404 from './pages/error404'
import LandingPage from './pages/allskillscoun-org'
import './styles/App.css'
import MyResumes from './components/MyResumes.tsx'
import { onAuthStateChanged } from 'firebase/auth'
import { removeCookie, setCookie } from './tools'
import { auth } from './config/firebase' // Import your Firebase config

const App = () => {
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchVCs())
    dispatch(fetchUserResumes())
  }, [dispatch])

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        const accessToken = await user.getIdToken()
        setCookie('accessToken', accessToken, { expires: 1 }) // Expires in 1 day
      } else {
        removeCookie('accessToken')
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/resume/new' element={<Resume />} />
          <Route path='/resume/import' element={<ImportPage />} />
          <Route path='/myresumes' element={<MyResumes />} />
          <Route path='*' element={<Error404 />} />
        </Route>
        {/* Landing page outside of Layout */}
        <Route path='/' element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App
