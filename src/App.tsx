// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './redux/store'
import { fetchVCs } from './redux/slices/vc'
import Layout from './components/Layout'
import Login from './pages/login'
import Home from './pages/home'
import Resume from './pages/resume'
import ImportPage from './pages/importPage'
import Error404 from './pages/error404'
import LandingPage from './pages/allskillscoun-org'
import './styles/App.css'
import AuthCallback from './components/AuthCallback'
import LoginWithWallet from './pages/loginSteps'
import MyResumes from './components/MyResumes.tsx'
import { fetchUserResumes } from './redux/slices/myresumes'

const App = () => {
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchVCs())
    dispatch(fetchUserResumes())
  }, [dispatch])

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/resume/new' element={<Resume />} />
          <Route path='/resume/import' element={<ImportPage />} />
          <Route path='/auth/callback' element={<AuthCallback />} />
          <Route path='/myresumes' element={<MyResumes />} />
          <Route path='*' element={<Error404 />} />
        </Route>
        {/* Landing page outside of Layout */}
        <Route path='/login' element={<Login />} />
        <Route path='/login/Wallet' element={<LoginWithWallet />} />
        <Route path='/' element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App
