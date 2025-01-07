import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'
import Resume from './pages/resume'
import ImportPage from './pages/importPage'
import Error404 from './pages/error404'
import LandingPage from './pages/allskillscoun-org'
import './styles/App.css'
import { fetchVCs } from './redux/slices/vc'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './redux/store'

const App = () => {
  const dispatch: AppDispatch = useDispatch()

  // Fetch VCs when the app loads
  useEffect(() => {
    dispatch(fetchVCs())
  }, [dispatch])
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/resume/new' element={<Resume />} />
        <Route path='/resume/import' element={<ImportPage />} />
        <Route path='/landing' element={<LandingPage />} />
        <Route path='*' element={<Error404 />} />
      </Routes>
    </Router>
  )
}

export default App
