import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config.js'

const GUEST_SESSION_KEY = 'dojo_guest_session'

export const GUEST_USER = {
  id: 'local_guest',
  uid: 'local_guest',
  name: 'Guest',
  email: '',
  avatar: 'G',
  photoURL: '',
  provider: 'guest',
  createdAt: Date.now()
}

export const DEFAULT_USER_DOC = {
  xp: 0,
  level: 1,
  streak: 0,
  badges: [],
  completedLessons: [],
  completedQuizzes: [],
  settings: { theme: 'system', notifications: true },
  onboarding: { complete: false, step: 0 }
}

export function normalizeUser(firebaseUser) {
  if (!firebaseUser) return null
  const displayName = firebaseUser.displayName || ''
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    name: displayName || firebaseUser.email?.split('@')[0] || 'Explorer',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || displayName.charAt(0).toUpperCase() || 'U',
    photoURL: firebaseUser.photoURL || '',
    provider: firebaseUser.providerData?.[0]?.providerId || 'email',
    createdAt: firebaseUser.metadata?.createdAt || Date.now()
  }
}

export async function ensureUserDocument(firebaseUser) {
  if (!firebaseUser) return
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
    await updateDoc(ref, { lastLogin: serverTimestamp() }).catch(() => {})
  } else {
    await setDoc(ref, { ...base, ...DEFAULT_USER_DOC, createdAt: serverTimestamp(), lastLogin: serverTimestamp() }).catch(() => {})
  }
}

export async function mergeGuestProgress(oldUserId, newUid) {
  if (!oldUserId) return
  let guestData = null
  try {
    const raw = localStorage.getItem(`dojo_progress_${oldUserId}`)
    if (raw) guestData = JSON.parse(raw)
  } catch { /* ignore */ }
  if (!guestData) return
  try {
    const ref = doc(db, 'users', newUid)
    await updateDoc(ref, {
      xp: guestData.xp || 0,
      streak: guestData.streak || 0,
      badges: guestData.badges || [],
      completedLessons: guestData.completedLessons || [],
      completedQuizzes: guestData.completedQuizzes || []
    })
  } catch { /* ignore */ }
}

export function hasGuestSession() {
  try {
    return !!localStorage.getItem(GUEST_SESSION_KEY)
  } catch {
    return false
  }
}

export function setGuestSession() {
  try {
    localStorage.setItem(GUEST_SESSION_KEY, '1')
  } catch { /* ignore */ }
}

export function clearGuestSession() {
  try {
    localStorage.removeItem(GUEST_SESSION_KEY)
  } catch { /* ignore */ }
}

export async function getUserDocument(uid) {
  if (!uid) return null
  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data() : null
  } catch {
    return null
  }
}
