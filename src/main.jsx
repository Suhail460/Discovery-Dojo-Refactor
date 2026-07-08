import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './router/AppRouter.jsx'
import './styles/index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProgressProvider } from './hooks/useStore.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
