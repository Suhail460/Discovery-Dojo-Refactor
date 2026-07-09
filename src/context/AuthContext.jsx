/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config.js'
import * as authService from '../services/authService.js'
import * as userService from '../services/userService.js'
import { trackLogin, trackSignup, trackLogout, trackGuestLogin } from '../services/analyticsService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const userRef = useRef(user)
  userRef.current = user

  useEffect(() => {
    if (userService.hasGuestSession()) {
      setUser({ ...userService.GUEST_USER, createdAt: Date.now() })
      setReady(true)
    }
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        userService.clearGuestSession()
        await userService.ensureUserDocument(firebaseUser)
        setUser(userService.normalizeUser(firebaseUser))
      } else if (!userRef.current || userRef.current.provider !== 'guest') {
        setUser(null)
      }
      setReady(true)
    })
    return unsub
  }, [])

  const handleAuthSuccess = useCallback(async (firebaseUser, fromGuest) => {
    setError(null)
    if (fromGuest) {
      const oldId = userRef.current?.id
      if (oldId) await userService.mergeGuestProgress(oldId, firebaseUser.uid)
    }
    await userService.ensureUserDocument(firebaseUser)
    const normalized = userService.normalizeUser(firebaseUser)
    setUser(normalized)
    return normalized
  }, [])

  const loginWithProvider = useCallback(async (providerId) => {
    const firebaseUser = await authService.loginWithProvider(providerId)
    const wasGuest = userRef.current?.provider === 'guest'
    trackLogin(providerId)
    return handleAuthSuccess(firebaseUser, wasGuest)
  }, [handleAuthSuccess])

  const loginWithEmail = useCallback(async (email, password) => {
    const firebaseUser = await authService.loginWithEmail(email, password)
    const wasGuest = userRef.current?.provider === 'guest'
    trackLogin('email')
    return handleAuthSuccess(firebaseUser, wasGuest)
  }, [handleAuthSuccess])

  const signup = useCallback(async (name, email, password) => {
    const firebaseUser = await authService.signup(name, email, password)
    const wasGuest = userRef.current?.provider === 'guest'
    trackSignup('email')
    return handleAuthSuccess(firebaseUser, wasGuest)
  }, [handleAuthSuccess])

  const resetPassword = useCallback(async (email) => {
    await authService.resetPassword(email)
  }, [])

  const loginAsGuest = useCallback(() => {
    userService.setGuestSession()
    setError(null)
    trackGuestLogin()
    setUser({ ...userService.GUEST_USER, createdAt: Date.now() })
  }, [])

  const logout = useCallback(async () => {
    userService.clearGuestSession()
    await authService.logout()
    trackLogout()
    setUser(null)
    setError(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user, ready, error, isAuthed: !!user,
      loginWithProvider, loginWithEmail, signup, resetPassword, loginAsGuest, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
