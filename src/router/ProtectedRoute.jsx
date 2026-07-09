import { useAuth } from '../context/AuthContext.jsx'
import LoginScreen from '../pages/LoginScreen.jsx'

export default function ProtectedRoute({ children }) {
  const { ready, isAuthed } = useAuth()

  if (!ready) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--surface-3)', borderTopColor: 'var(--primary)', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--ink-3)', fontSize: '.9rem' }}>Loading your session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthed) return <LoginScreen />

  return children
}
