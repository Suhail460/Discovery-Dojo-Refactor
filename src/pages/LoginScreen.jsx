import { useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

/* Full-screen auth gate. Social buttons + email/password + guest.
   All wired to AuthContext so swapping in a real provider needs zero
   changes here. */
export default function LoginScreen() {
  const { loginWithProvider, loginWithEmail, signup, loginAsGuest } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function run(fn) {
    setErr(''); setBusy(true)
    try { await fn() } catch (e) { setErr(e.message || 'Something went wrong') } finally { setBusy(false) }
  }
  const submit = (e) => {
    e.preventDefault()
    if (mode === 'login') run(() => loginWithEmail(email, pw))
    else run(() => signup(name, email, pw))
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 1fr' }} className="login-root">
      {/* Left: brand panel */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(32px,5vw,64px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', background: 'linear-gradient(150deg, var(--plum) 0%, var(--accent) 130%)' }} className="login-brand">
        <div style={{ position: 'absolute', right: -90, top: -90, width: 360, height: 360, borderRadius: '50%', background: 'oklch(1 0 0 / 0.10)' }} />
        <div style={{ position: 'absolute', right: 40, bottom: -140, width: 300, height: 300, borderRadius: '50%', background: 'oklch(1 0 0 / 0.08)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: 'oklch(1 0 0 / 0.16)', display: 'grid', placeItems: 'center', transform: 'rotate(-4deg)' }}><Compass size={24} /></div>
          <div style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: '1.2rem' }}>Discovery Dojo</div>
        </div>
        <div style={{ position: 'relative', maxWidth: 460 }}>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
            style={{ color: '#fff', fontSize: 'clamp(2rem,3.6vw,2.9rem)', marginBottom: 16 }}>
            Learn to decide what to build.
          </motion.h1>
          <p style={{ fontFamily: '"Newsreader", Georgia, serif', fontSize: '1.15rem', color: 'oklch(1 0 0 / 0.9)', lineHeight: 1.5 }}>
            Fifteen levels, a live customer-interview simulator, endless generated scenarios, and an AI coach who won't just hand you the answer.
          </p>
          <div style={{ marginTop: 28, display: 'flex', gap: 22, flexWrap: 'wrap', fontSize: '.9rem', fontWeight: 600 }}>
            <span>🎤 Interview sim</span><span>🌳 Solution trees</span><span>🏁 Capstone project</span>
          </div>
        </div>
        <div style={{ position: 'relative', fontSize: '.8rem', color: 'oklch(1 0 0 / 0.7)' }}>Your progress saves to this browser, per account.</div>
      </div>

      {/* Right: auth form */}
      <div style={{ display: 'grid', placeItems: 'center', padding: 'clamp(24px,4vw,48px)' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 6 }}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p style={{ color: 'var(--ink-3)', marginBottom: 24, fontSize: '.95rem' }}>
            {mode === 'login' ? 'Sign in to pick up where you left off.' : 'Start your discovery journey in seconds.'}
          </p>

          <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
            <SocialBtn onClick={() => run(() => loginWithProvider('google'))} disabled={busy} label="Continue with Google" icon={<GoogleIcon />} />
            <SocialBtn onClick={() => run(() => loginWithProvider('github'))} disabled={busy} label="Continue with GitHub" icon={<GithubIcon />} />
            <SocialBtn onClick={() => run(() => loginWithProvider('apple'))} disabled={busy} label="Continue with Apple" icon={<AppleIcon />} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0', color: 'var(--ink-3)', fontSize: '.8rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} /> OR <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>

          <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
            {mode === 'signup' && (
              <Field icon={<User size={16} />}><input className="input" style={{ paddingLeft: 40 }} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required /></Field>
            )}
            <Field icon={<Mail size={16} />}><input className="input" style={{ paddingLeft: 40 }} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
            <Field icon={<Lock size={16} />}><input className="input" style={{ paddingLeft: 40 }} type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} required /></Field>

            {err && <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--bad)', fontSize: '.85rem', background: 'var(--bad-wash)', padding: '9px 12px', borderRadius: 10 }}><AlertCircle size={15} /> {err}</div>}

            <button className="btn btn-primary" type="submit" disabled={busy} style={{ marginTop: 4 }}>
              {busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: 18, fontSize: '.9rem', color: 'var(--ink-3)', textAlign: 'center' }}>
            {mode === 'login' ? "New here? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErr('') }}
              style={{ background: 'none', border: 'none', color: 'var(--accent-ink)', fontWeight: 700, cursor: 'pointer' }}>
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </div>

          <button onClick={() => run(loginAsGuest)} disabled={busy}
            style={{ width: '100%', marginTop: 20, background: 'none', border: 'none', color: 'var(--ink-3)', fontSize: '.88rem', cursor: 'pointer', textDecoration: 'underline' }}>
            Explore as guest
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px){
          .login-root{ grid-template-columns: 1fr !important }
          .login-brand{ display: none !important }
        }
      `}</style>
    </div>
  )
}

function Field({ icon, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)', pointerEvents: 'none' }}>{icon}</span>
      {children}
    </div>
  )
}
function SocialBtn({ onClick, disabled, label, icon }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '11px 16px', borderRadius: 14, border: '1.5px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontWeight: 600, fontSize: '.92rem', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .16s' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink-3)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)' }}>
      {icon} {label}
    </button>
  )
}
const GoogleIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>)
const GithubIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1C5.92 1 1 5.92 1 12c0 4.86 3.15 8.98 7.52 10.43.55.1.75-.24.75-.53v-1.86c-3.06.67-3.7-1.47-3.7-1.47-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.7-1.47-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.91 0 0 .92-.3 3.02 1.13a10.5 10.5 0 015.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.51.22 2.63.11 2.91.7.77 1.13 1.75 1.13 2.95 0 4.22-2.58 5.15-5.03 5.42.4.34.75 1 .75 2.02v3c0 .29.2.64.76.53A11 11 0 0023 12c0-6.08-4.92-11-11-11z"/></svg>)
const AppleIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.54c-.02-2.05 1.68-3.03 1.75-3.08-.95-1.4-2.44-1.59-2.97-1.61-1.26-.13-2.47.74-3.11.74-.64 0-1.63-.72-2.68-.7-1.38.02-2.65.8-3.36 2.03-1.43 2.49-.37 6.17 1.03 8.19.68.99 1.49 2.1 2.55 2.06 1.02-.04 1.41-.66 2.65-.66 1.24 0 1.58.66 2.66.64 1.1-.02 1.79-1 2.47-1.99.78-1.14 1.1-2.25 1.11-2.31-.02-.01-2.13-.82-2.15-3.24zM15.1 6.24c.56-.68.94-1.62.83-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.98 1.56-.85 2.48.9.07 1.83-.46 2.39-1.14z"/></svg>)
