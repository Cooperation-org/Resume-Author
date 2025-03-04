import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Auth0Provider } from '@auth0/auth0-react'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain='dev-z2863ou7zzmrmnxc.us.auth0.com'
        clientId='PbToefw6udJDXLf0Eyf1sX3u0oqE5Dzq'
        authorizationParams={{
          redirect_uri: `${window.location.origin}/resume/import`
        }}
      >
        <App />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
