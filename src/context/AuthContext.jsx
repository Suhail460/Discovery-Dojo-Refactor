/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInAnonymously
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config.js'

const AuthContext = createContext(null)

function normalizeUser(firebaseUser) {
  if (!firebaseUser) return null
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Explorer',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || (firebaseUser.displayName || 'U').charAt(0).toUpperCase(),
    provider: firebaseUser.isAnonymous ? 'guest' : firebaseUser.providerData?.[0]?.providerId || 'email',
    createdAt: firebaseUser.metadata?.createdAt || Date.now(),
    photoURL: firebaseUser.photoURL
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

async function ensureUserDocument(user) {
  if (!user || user.isAnonymous) return
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    await updateDoc(ref, { lastLogin: serverTimestamp() })
  } else {
    await setDoc(ref, {
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      provider: user.providerData?.[0]?.providerId || 'email',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      completedLessons: [],
      completedQuizzes: [],
      settings: { theme: 'system', notifications: true }
    })
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
    if (providerId === 'google') {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      const result = await signInWithPopup(auth, provider)
      await ensureUserDocument(result.user)
      setUser(normalizeUser(result.user))
      return result.user
    }
    throw new Error(`Provider "${providerId}" is not configured yet.`)
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
      loginWithProvider, loginWithEmail, signup, loginAsGuest, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
