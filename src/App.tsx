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
import MyResumes from './components/MyResumes.tsx'
import { fetchUserResumes } from './redux/slices/myresumes'
import { WalletStorage } from '@did-coop/wallet-attached-storage/dist'
const App = () => {
  const dispatch: AppDispatch = useDispatch()

  const testingWalletStorage = async () => {
    const { Ed25519Signer } = await import('@did.coop/did-key-ed25519')

    const appDidSigner = await Ed25519Signer.generate()
    console.log('🚀 ~ testingWalletStorage ~ appDidSigner:', appDidSigner)

    const space = await WalletStorage.provisionSpace({
      url: 'https://data.pub',
      signer: appDidSigner
    })
    console.log(space)
  }
  useEffect(() => {
    testingWalletStorage()
  }, [])
  useEffect(() => {
    dispatch(fetchVCs())
    dispatch(fetchUserResumes())
  }, [dispatch])

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
