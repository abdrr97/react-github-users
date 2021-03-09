import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { GithubProvider } from './context/context'
import { Auth0Provider } from '@auth0/auth0-react'
// dev-abdrr97.eu.auth0.com
// QTSJ02KQkywwcWVfw1xAWtUH6gSzqp5y
// save to .env variables
ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain='dev-abdrr97.eu.auth0.com'
      clientId='QTSJ02KQkywwcWVfw1xAWtUH6gSzqp5y'
      redirectUri={window.location.origin}
    >
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
