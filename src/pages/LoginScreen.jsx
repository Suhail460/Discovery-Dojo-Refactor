import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Mail, Lock, User, ArrowRight, AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff, Loader2, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

function passwordStrength(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(s, 5)
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong']
const STRENGTH_COLORS = ['', 'var(--bad)', 'var(--amber)', '#60a5fa', 'var(--ok)', 'var(--primary)']

export default function LoginScreen() {
  const { loginWithProvider, loginWithEmail, signup, resetPassword, loginAsGuest } = useAuth()
  const { toast } = useToast()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [success, setSuccess] = useState(false)

  const strength = useMemo(() => passwordStrength(pw), [pw])

  async function run(fn, successMsg) {
    setErr(''); setSuccess(false); setBusy(true)
    try {
      await fn()
      if (successMsg) {
        setSuccess(true)
        toast(successMsg, 'party-popper')
        if (mode !== 'reset') {
          setTimeout(() => setSuccess(false), 1500)
        }
      }
    } catch (e) {
      setErr(e.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (mode === 'login') run(() => loginWithEmail(email, pw), 'Welcome back!')
    else if (mode === 'signup') run(() => signup(name, email, pw), 'Account created!')
    else if (mode === 'reset') {
      run(async () => { await resetPassword(email); setResetSent(true) }, '')
    }
  }

  const btnLabel = mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset email'

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 1fr' }} className="login-root-login-screen">
      <div style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(32px,5vw,64px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', background: 'linear-gradient(150deg, #4F46E5 0%, var(--primary) 130%)' }} className="login-brand">
        <div style={{ position: 'absolute', right: -90, top: -90, width: 360, height: 360, borderRadius: '50%', background: 'oklch(1 0 0 / 0.10)' }} aria-hidden="true" />
        <div style={{ position: 'absolute', right: 40, bottom: -140, width: 300, height: 300, borderRadius: '50%', background: 'oklch(1 0 0 / 0.08)' }} aria-hidden="true" />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: 'oklch(1 0 0 / 0.16)', display: 'grid', placeItems: 'center', transform: 'rotate(-4deg)' }}><Compass size={24} aria-hidden="true" /></div>
          <div style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: '1.2rem' }}>Discovery Dojo</div>
        </div>
        <div style={{ position: 'relative', maxWidth: 460 }}>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
            style={{ color: '#fff', fontSize: 'clamp(2rem,3.6vw,2.9rem)', marginBottom: 16 }}>
            Learn to decide what to build.
          </motion.h1>
          <p style={{ fontFamily: '"Newsreader", Georgia, serif', fontSize: '1.15rem', color: 'oklch(1 0 0 / 0.9)', lineHeight: 1.5 }}>
            Fifteen levels, a live customer-interview simulator, endless generated scenarios, and an AI coach who won&apos;t just hand you the answer.
          </p>
          <div style={{ marginTop: 28, display: 'flex', gap: 22, flexWrap: 'wrap', fontSize: '.9rem', fontWeight: 600 }}>
            <span><MicIcon /> Interview sim</span>
            <span><TreeIcon /> Solution trees</span>
            <span><FlagIcon /> Capstone project</span>
          </div>
        </div>
        <div style={{ position: 'relative', fontSize: '.8rem', color: 'oklch(1 0 0 / 0.7)' }}>Your progress saves to this browser, per account.</div>
      </div>

      <div style={{ display: 'grid', placeItems: 'center', padding: 'clamp(24px,4vw,48px)' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <AnimatePresence mode="wait">
            {success && mode !== 'reset' ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '48px 0' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                  style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--ok-wash)', color: 'var(--ok)', display: 'grid', placeItems: 'center' }}>
                  <CheckCircle size={32} />
                </motion.div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{mode === 'login' ? 'Signed in!' : 'Account created!'}</p>
                <p style={{ color: 'var(--ink-3)', fontSize: '.85rem' }}>Redirecting to dashboard...</p>
              </motion.div>
            ) : (
              <motion.div key={mode} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.15 }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: 6 }}>{mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset password'}</h2>
                <p style={{ color: 'var(--ink-3)', marginBottom: 24, fontSize: '.95rem' }}>
                  {mode === 'login' ? 'Sign in to pick up where you left off.' : mode === 'signup' ? 'Start your discovery journey in seconds.' : "Enter your email and we'll send you a reset link."}
                </p>

                <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
                  <SocialBtn onClick={() => run(() => loginWithProvider('google'), 'Signed in with Google!')} disabled={busy} label="Continue with Google" icon={<GoogleIcon />} />
                  <SocialBtn onClick={() => run(() => loginWithProvider('github'), 'Signed in with GitHub!')} disabled={busy} label="Continue with GitHub" icon={<GithubIcon />} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0', color: 'var(--ink-3)', fontSize: '.8rem' }} role="separator" aria-orientation="horizontal">
                  <div style={{ flex: 1, height: 1, background: 'var(--line)' }} /> OR <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                </div>

                <form onSubmit={submit} style={{ display: 'grid', gap: 12 }} noValidate>
                  {mode === 'signup' && (
                    <Field icon={<User size={16} />}>
                      <input className="input" style={{ paddingLeft: 40 }} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required aria-label="Your name" autoComplete="name" />
                    </Field>
                  )}
                  <Field icon={<Mail size={16} />}>
                    <input className="input" style={{ paddingLeft: 40 }} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required={mode !== 'reset'} aria-label="Email address" autoComplete={mode === 'signup' ? 'email' : 'username'} />
                  </Field>
                  {mode !== 'reset' && (
                    <Field icon={<Lock size={16} />}>
                      <input className="input" style={{ paddingLeft: 40, paddingRight: 40 }} type={showPw ? 'text' : 'password'} placeholder={mode === 'signup' ? 'Create a password' : 'Password'} value={pw} onChange={(e) => setPw(e.target.value)} required aria-label={mode === 'signup' ? 'Create a password' : 'Password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
                      <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Hide password' : 'Show password'} tabIndex={0} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: 'var(--ink-3)', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 4 }}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </Field>
                  )}

                  {mode === 'signup' && pw.length > 0 && (
                    <div style={{ marginTop: -4 }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 3 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? STRENGTH_COLORS[strength] : 'var(--line)' }} />
                        ))}
                      </div>
                      <div style={{ fontSize: '.72rem', color: STRENGTH_COLORS[strength] || 'var(--ink-3)', fontWeight: 600 }}>
                        {STRENGTH_LABELS[strength]}
                      </div>
                    </div>
                  )}

                  {mode === 'login' && (
                    <button type="button" onClick={() => { setMode('reset'); setErr(''); setResetSent(false) }}
                      style={{ border: 'none', background: 'none', color: 'var(--ink-3)', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'right', padding: 0, marginTop: -4 }}>
                      Forgot password?
                    </button>
                  )}

                  {err && (
                    <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--bad)', fontSize: '.85rem', background: 'var(--bad-wash)', padding: '9px 12px', borderRadius: 10 }}>
                      <AlertCircle size={15} aria-hidden="true" /> {err}
                    </div>
                  )}

                  {mode === 'reset' && resetSent && (
                    <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ok)', fontSize: '.85rem', background: 'var(--ok-wash)', padding: '9px 12px', borderRadius: 10 }}>
                      <CheckCircle size={15} aria-hidden="true" /> Reset email sent. Check your inbox.
                    </div>
                  )}

                  <button className="btn btn-primary" type="submit" disabled={busy} style={{ marginTop: 4, position: 'relative' }}>
                    <span style={{ visibility: busy ? 'hidden' : 'visible', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {btnLabel} <ArrowRight size={16} />
                    </span>
                    {busy && (
                      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Loader2 size={18} style={{ animation: 'spin 0.7s linear infinite' }} />
                      </span>
                    )}
                  </button>
                </form>

                <div style={{ marginTop: 18, fontSize: '.9rem', color: 'var(--ink-3)', textAlign: 'center' }}>
                  {mode === 'reset' ? (
                    <button onClick={() => { setMode('login'); setErr(''); setResetSent(false) }}
                      className="btn-ghost-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <ArrowLeft size={14} /> Back to sign in
                    </button>
                  ) : (
                    <>
                      {mode === 'login' ? "New here? " : 'Already have an account? '}
                      <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErr(''); setPw(''); setResetSent(false) }}
                        className="btn-ghost-link">
                        {mode === 'login' ? 'Create one' : 'Sign in'}
                      </button>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 8, fontSize: '.75rem', color: 'var(--ink-3)' }}>
                  <Shield size={12} /> Your data stays private and local.
                </div>

                {mode !== 'reset' && (
                  <button onClick={() => run(loginAsGuest, '')} disabled={busy}
                    className="guest-link" style={{ marginTop: 4 }}>
                    Explore as guest
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Field({ icon, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)', pointerEvents: 'none' }} aria-hidden="true">{icon}</span>
      {children}
    </div>
  )
}

function SocialBtn({ onClick, disabled, label, icon }) {
  return (
    <button onClick={onClick} disabled={disabled} className="social-btn">
      {icon} {label}
    </button>
  )
}

function MicIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }} aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg> }
function TreeIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }} aria-hidden="true"><path d="M12 22V8"/><path d="M12 8 4 14"/><path d="M12 8l8 6"/><circle cx="12" cy="4" r="2"/></svg> }
function FlagIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }} aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> }

const GoogleIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>)
const GithubIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1C5.92 1 1 5.92 1 12c0 4.86 3.15 8.98 7.52 10.43.55.1.75-.24.75-.53v-1.86c-3.06.67-3.7-1.47-3.7-1.47-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.7-1.47-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.91 0 0 .92-.3 3.02 1.13a10.5 10.5 0 015.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.51.22 2.63.11 2.91.7.77 1.13 1.75 1.13 2.95 0 4.22-2.58 5.15-5.03 5.42.4.34.75 1 .75 2.02v3c0 .29.2.64.76.53A11 11 0 0023 12c0-6.08-4.92-11-11-11z"/></svg>)
