import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StudyProvider } from './context/StudyContext.tsx'

import ErrorBoundary from './components/ErrorBoundary.tsx'

import { AuthProvider } from './context/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <StudyProvider>
          <App />
        </StudyProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
