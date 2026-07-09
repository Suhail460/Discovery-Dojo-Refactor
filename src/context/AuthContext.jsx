/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  signInAnonymously
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config.js'

const AuthContext = createContext(null)

function normalizeUser(firebaseUser) {
  if (!firebaseUser) return null
  const displayName = firebaseUser.displayName || ''
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    name: displayName || firebaseUser.email?.split('@')[0] || 'Explorer',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || displayName.charAt(0).toUpperCase() || 'U',
    photoURL: firebaseUser.photoURL || '',
    provider: firebaseUser.isAnonymous ? 'guest' : firebaseUser.providerData?.[0]?.providerId || 'email',
    createdAt: firebaseUser.metadata?.createdAt || Date.now()
  }
}

const FIREBASE_ERRORS = {
  'auth/popup-closed-by-user': 'Sign-in cancelled. Try again.',
  'auth/cancelled-popup-request': 'Sign-in cancelled. Try again.',
  'auth/popup-blocked': 'Popup was blocked. Allow popups and try again.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/wrong-password': 'Wrong password. Try again.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/email-already-in-use': 'An account with that email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase Console.'
}

function friendlyError(error) {
  if (error?.code && FIREBASE_ERRORS[error.code]) return FIREBASE_ERRORS[error.code]
  if (error?.message) return error.message
  return 'Something went wrong. Please try again.'
}

const DEFAULT_DOC = {
  xp: 0,
  level: 1,
  streak: 0,
  badges: [],
  completedLessons: [],
  completedQuizzes: [],
  settings: { theme: 'system', notifications: true },
  onboarding: { complete: false, step: 0 }
}

async function ensureUserDocument(firebaseUser) {
  if (!firebaseUser || firebaseUser.isAnonymous) return
  const ref = doc(db, 'users', firebaseUser.uid)
  const snap = await getDoc(ref)
  const base = {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || '',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || '',
    provider: firebaseUser.providerData?.[0]?.providerId || 'email',
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  }
  if (snap.exists()) {
    await updateDoc(ref, { lastLogin: serverTimestamp() })
  } else {
    await setDoc(ref, { ...base, ...DEFAULT_DOC, createdAt: serverTimestamp(), lastLogin: serverTimestamp() })
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await ensureUserDocument(firebaseUser)
        setUser(normalizeUser(firebaseUser))
      } else {
        setUser(null)
      }
      setReady(true)
    })
    return unsub
  }, [])

  async function loginWithProvider(providerId) {
    let provider
    switch (providerId) {
      case 'google':
        provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        break
      case 'github':
        provider = new GithubAuthProvider()
        break
      case 'apple':
        provider = new OAuthProvider('apple.com')
        break
      default:
        throw new Error(`Provider "${providerId}" is not supported.`)
    }
    const result = await signInWithPopup(auth, provider)
    await ensureUserDocument(result.user)
    setUser(normalizeUser(result.user))
    return result.user
  }

  async function loginWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password).catch((e) => {
      throw new Error(friendlyError(e))
    })
    await ensureUserDocument(result.user)
    setUser(normalizeUser(result.user))
    return result.user
  }

  async function signup(name, email, password) {
    const result = await createUserWithEmailAndPassword(auth, email, password).catch((e) => {
      throw new Error(friendlyError(e))
    })
    if (name) {
      await updateProfile(result.user, { displayName: name })
    }
    await ensureUserDocument(result.user)
    const updated = { ...result.user, displayName: result.user.displayName || name }
    setUser(normalizeUser(updated))
    return result.user
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email).catch((e) => {
      throw new Error(friendlyError(e))
    })
  }

  async function loginAsGuest() {
    const result = await signInAnonymously(auth)
    setUser(normalizeUser(result.user))
    return result.user
  }

  async function logout() {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, ready, isAuthed: !!user,
      loginWithProvider, loginWithEmail, signup, resetPassword, loginAsGuest, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
