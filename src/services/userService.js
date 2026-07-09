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
  lastActive: null,
  badges: [],
  completedLessons: [],
  completedLevels: [],
  completedQuizzes: [],
  quizScores: {},
  quizWins: 0,
  weak: [],
  strong: [],
  reflections: {},
  confidence: {},
  interviews: [],
  generated: 0,
  capstone: {},
  capstoneDone: false,
  bookmarks: [],
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

const PROGRESS_FIELDS = [
  'xp', 'streak', 'lastActive', 'badges', 'completedLessons', 'completedLevels',
  'completedQuizzes', 'quizScores', 'quizWins', 'weak', 'strong', 'reflections',
  'confidence', 'interviews', 'generated', 'capstone', 'capstoneDone', 'bookmarks'
]

export async function syncProgressToFirestore(uid, progressState) {
  if (!uid || uid === 'local_guest') return
  try {
    const ref = doc(db, 'users', uid)
    const data = { lastSync: serverTimestamp() }
    for (const field of PROGRESS_FIELDS) {
      if (progressState[field] !== undefined) {
        data[field] = progressState[field]
      }
    }
    await updateDoc(ref, data)
  } catch { /* silent fail - local state is always preserved */ }
}

export async function loadProgressFromFirestore(uid) {
  if (!uid || uid === 'local_guest') return null
  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    const data = snap.data()
    const progress = {}
    for (const field of PROGRESS_FIELDS) {
      if (data[field] !== undefined) progress[field] = data[field]
    }
    return progress
  } catch {
    return null
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
    await updateDoc(ref, { ...DEFAULT_USER_DOC, ...guestData })
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

export async function addBookmark(uid, bookmark) {
  if (!uid || uid === 'local_guest') return
  try {
    const ref = doc(db, 'users', uid)
    await updateDoc(ref, { bookmarks: bookmark })
  } catch { /* ignore */ }
}
