import { createContext, useContext, useEffect, useState } from 'react'

/* ============================================================================
   AUTH CONTROL LAYER
   ----------------------------------------------------------------------------
   This is the single place you control login. Out of the box it runs in
   "demo" mode: accounts live in the browser (localStorage), no server needed,
   so Google / GitHub / email buttons all work immediately for local use.

   To switch on REAL authentication (real Google/GitHub sign-in), you set
   ONE variable below (AUTH_MODE) and drop in a provider. See README.md
   section "Controlling login" for copy-paste steps for Firebase / Clerk /
   Supabase. The rest of the app never changes: it only calls the functions
   this context exposes (loginWithProvider, loginWithEmail, signup, logout).
   ============================================================================ */

// 'demo'  -> local browser accounts (default, zero setup)
// 'firebase' | 'clerk' | 'supabase' -> real auth (see README to enable)
export const AUTH_MODE = 'demo'

const AuthContext = createContext(null)
const SESSION_KEY = 'dojo_session'
const USERS_KEY = 'dojo_users'

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {} } catch { return {} }
}
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)) }

function makeUser({ name, email, provider }) {
  return {
    id: (email || name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now().toString(36),
    name: name || (email ? email.split('@')[0] : 'Explorer'),
    email: email || '',
    provider: provider || 'email',
    avatar: (name || email || 'U').trim().charAt(0).toUpperCase(),
    createdAt: Date.now()
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // Restore session on load.
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY))
      if (s) setUser(s)
    } catch { /* ignore */ }
    setReady(true)
  }, [])

  function persist(u) {
    setUser(u)
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u))
    else localStorage.removeItem(SESSION_KEY)
  }

  /* ---- DEMO-MODE implementations ---------------------------------------
     Replace the bodies of these three with your provider's SDK calls when
     you flip AUTH_MODE. The signatures stay identical. -------------------- */

  // Social sign-in (Google, GitHub, etc.). In demo mode we fabricate an
  // account so the flow is fully clickable without any keys.
  async function loginWithProvider(provider) {
    if (AUTH_MODE !== 'demo') {
      // e.g. firebase: return signInWithPopup(auth, new GoogleAuthProvider())
      throw new Error(`Wire up ${provider} in AuthContext for AUTH_MODE="${AUTH_MODE}"`)
    }
    const nameByProvider = { google: 'Google User', github: 'GitHub User', apple: 'Apple User' }
    const u = makeUser({ name: nameByProvider[provider] || 'User', email: `${provider}.user@demo.local`, provider })
    const users = loadUsers(); users[u.email] = u; saveUsers(users)
    persist(u)
    return u
  }

  async function loginWithEmail(email, password) {
    if (AUTH_MODE !== 'demo') {
      // e.g. firebase: return signInWithEmailAndPassword(auth, email, password)
      throw new Error('Wire up email login for your provider in AuthContext')
    }
    const users = loadUsers()
    const rec = users[email.toLowerCase()]
    if (!rec) throw new Error('No account with that email. Try signing up.')
    if (rec.password && rec.password !== password) throw new Error('Wrong password.')
    const { password: _pw, ...safe } = rec
    persist(safe)
    return safe
  }

  async function signup(name, email, password) {
    if (AUTH_MODE !== 'demo') {
      // e.g. firebase: return createUserWithEmailAndPassword(auth, email, password)
      throw new Error('Wire up signup for your provider in AuthContext')
    }
    const users = loadUsers()
    if (users[email.toLowerCase()]) throw new Error('An account with that email already exists.')
    const u = makeUser({ name, email, provider: 'email' })
    users[email.toLowerCase()] = { ...u, password }
    saveUsers(users)
    persist(u)
    return u
  }

  // Explore without an account. Progress still saves locally under "guest".
  async function loginAsGuest() {
    persist(makeUser({ name: 'Guest', email: '', provider: 'guest' }))
  }

  function logout() { persist(null) }

  return (
    <AuthContext.Provider value={{
      user, ready, isAuthed: !!user,
      loginWithProvider, loginWithEmail, signup, loginAsGuest, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
