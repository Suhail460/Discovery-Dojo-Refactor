import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, X, Mail, User, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

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

export default function UpgradeModal({ open, onClose }) {
  const { user, loginWithProvider, signup } = useAuth()
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)
  const [emailMode, setEmailMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')

  const strength = useMemo(() => passwordStrength(pw), [pw])

  useEffect(() => {
    if (user && user.provider !== 'guest' && open) onClose()
  }, [user, open, onClose])

  useEffect(() => {
    if (!open) { setEmailMode(false); setErr(''); setName(''); setEmail(''); setPw('') }
  }, [open])

  async function run(fn, successMsg) {
    setErr(''); setBusy(true)
    try {
      await fn()
      if (successMsg) toast(successMsg, 'party-popper')
    } catch (e) {
      setErr(e.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  function handleEmailSignup(e) {
    e.preventDefault()
    run(() => signup(name || email.split('@')[0], email, pw), 'Account created!')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'grid', placeItems: 'center', background: 'oklch(0 0 0 / 0.5)', backdropFilter: 'blur(4px)', padding: 24 }}
          onClick={onClose}>
          <motion.div initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }} transition={{ duration: 0.2 }}
            style={{ background: 'var(--surface)', borderRadius: 20, padding: 40, maxWidth: 400, width: '100%', position: 'relative', boxShadow: '0 24px 80px oklch(0 0 0 / 0.25)' }}
            onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={emailMode ? 'Sign up with email' : 'Unlock premium'}>

            <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'var(--surface-2)', borderRadius: 8, width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--ink-3)' }}>
              <X size={16} />
            </button>

            {!emailMode ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--primary-wash)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--primary)' }}>
                    <Compass size={26} />
                  </div>
                  <h2 style={{ fontSize: '1.35rem', marginBottom: 6 }}>Unlock Premium</h2>
                  <p style={{ color: 'var(--ink-3)', fontSize: '.88rem', lineHeight: 1.5 }}>
                    Create a free account to unlock AI Coach, Challenges, Badges, Capstone, and all 15 levels.
                  </p>
                </div>

                <div style={{ display: 'grid', gap: 10 }}>
                  <button onClick={() => run(() => loginWithProvider('google'), 'Signed in with Google!')} disabled={busy} className="social-btn">
                    <GoogleIcon /> Continue with Google
                  </button>
                  <button onClick={() => run(() => loginWithProvider('github'), 'Signed in with GitHub!')} disabled={busy} className="social-btn">
                    <GithubIcon /> Continue with GitHub
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0', color: 'var(--ink-3)', fontSize: '.8rem' }} role="separator" aria-orientation="horizontal">
                    <div style={{ flex: 1, height: 1, background: 'var(--line)' }} /> OR <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                  </div>
                  <button onClick={() => setEmailMode(true)} disabled={busy} className="social-btn">
                    <Mail size={16} /> Sign up with Email
                  </button>
                  <button onClick={onClose} className="btn-ghost-link" style={{ marginTop: 4, textAlign: 'center', justifyContent: 'center' }}>
                    Continue Later
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setEmailMode(false)} className="btn-ghost-link" style={{ marginBottom: 16 }}>
                  <ArrowLeft size={14} /> Back
                </button>
                <h2 style={{ fontSize: '1.2rem', marginBottom: 6 }}>Sign up with Email</h2>
                <p style={{ color: 'var(--ink-3)', fontSize: '.85rem', marginBottom: 20 }}>Create your free account.</p>
                <form onSubmit={handleEmailSignup} style={{ display: 'grid', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)', pointerEvents: 'none' }} aria-hidden="true"><User size={16} /></span>
                    <input className="input" style={{ paddingLeft: 40 }} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Your name" autoComplete="name" />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)', pointerEvents: 'none' }} aria-hidden="true"><Mail size={16} /></span>
                    <input className="input" style={{ paddingLeft: 40 }} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required aria-label="Email address" autoComplete="email" />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)', pointerEvents: 'none' }} aria-hidden="true"><Lock size={16} /></span>
                    <input className="input" style={{ paddingLeft: 40, paddingRight: 40 }} type={showPw ? 'text' : 'password'} placeholder="Create a password" value={pw} onChange={(e) => setPw(e.target.value)} required aria-label="Create a password" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Hide password' : 'Show password'} tabIndex={0} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: 'var(--ink-3)', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 4 }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {pw.length > 0 && (
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

                  {err && (
                    <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--bad)', fontSize: '.85rem', background: 'var(--bad-wash)', padding: '9px 12px', borderRadius: 10 }}>
                      <AlertCircle size={15} aria-hidden="true" /> {err}
                    </div>
                  )}

                  <button className="btn btn-primary" type="submit" disabled={busy} style={{ marginTop: 4, position: 'relative' }}>
                    <span style={{ visibility: busy ? 'hidden' : 'visible', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      Create account <ArrowRight size={16} />
                    </span>
                    {busy && (
                      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Loader2 size={18} style={{ animation: 'spin 0.7s linear infinite' }} />
                      </span>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const GoogleIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>)
const GithubIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1C5.92 1 1 5.92 1 12c0 4.86 3.15 8.98 7.52 10.43.55.1.75-.24.75-.53v-1.86c-3.06.67-3.7-1.47-3.7-1.47-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.7-1.47-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.91 0 0 .92-.3 3.02 1.13a10.5 10.5 0 015.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.51.22 2.63.11 2.91.7.77 1.13 1.75 1.13 2.95 0 4.22-2.58 5.15-5.03 5.42.4.34.75 1 .75 2.02v3c0 .29.2.64.76.53A11 11 0 0023 12c0-6.08-4.92-11-11-11z"/></svg>)
