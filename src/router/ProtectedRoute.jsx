import { useAuth } from '../context/AuthContext.jsx'
import LoginScreen from '../pages/LoginScreen.jsx'

export default function ProtectedRoute({ children }) {
  const { ready, isAuthed } = useAuth()

  if (!ready) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }} role="status" aria-label="Loading session">
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }}>
            <circle cx="12" cy="12" r="10" stroke="var(--line)" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p style={{ color: 'var(--ink-3)', fontSize: '.9rem', fontWeight: 500 }}>Restoring your session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthed) return <LoginScreen />

  return children
}
