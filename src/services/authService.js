import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth'
import { auth } from '../firebase/config.js'
import { friendlyError } from '../utils/firebaseErrors.js'

function getProvider(providerId) {
  switch (providerId) {
    case 'google': {
      const p = new GoogleAuthProvider()
      p.setCustomParameters({ prompt: 'select_account' })
      return p
    }
    case 'github':
      return new GithubAuthProvider()
    default:
      throw new Error(`Provider "${providerId}" is not supported.`)
  }
}

export async function loginWithProvider(providerId) {
  const provider = getProvider(providerId)
  const result = await signInWithPopup(auth, provider).catch((e) => {
    throw new Error(friendlyError(e))
  })
  return result.user
}

export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password).catch((e) => {
    throw new Error(friendlyError(e))
  })
  return result.user
}

export async function signup(name, email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password).catch((e) => {
    throw new Error(friendlyError(e))
  })
  if (name) {
    await updateProfile(result.user, { displayName: name }).catch(() => {})
  }
  return result.user
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email).catch((e) => {
    throw new Error(friendlyError(e))
  })
}

export async function logout() {
  await signOut(auth)
}
