import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'
import { Provider } from 'react-redux'
import { Auth0Provider } from '@auth0/auth0-react'
import store from './redux/store'
import Resume from './pages/resume'
import ImportPage from './pages/importPage'
import Error404 from './pages/error404'
import './styles/App.css'

const App = () => {
  return (
    <Provider store={store}>
      <Auth0Provider
        domain='dev-z2863ou7zzmrmnxc.us.auth0.com'
        clientId='PbToefw6udJDXLf0Eyf1sX3u0oqE5Dzq'
        authorizationParams={{
          redirect_uri: `${window.location.origin}/resume/import`,
        }}
      >
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/resume/new' element={<Resume />} />
            <Route path='/resume/import' element={<ImportPage />} />

            <Route path='*' element={<Error404 />} />
          </Routes>
        </Router>
      </Auth0Provider>
    </Provider>
  )
}

export default App
