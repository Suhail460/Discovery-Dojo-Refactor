import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import AppRouter from './router/AppRouter.jsx'
import './styles/index.css'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProgressProvider } from './hooks/useStore.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <ToastProvider>
            <AppRouter />
            <Analytics />
          </ToastProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
)
