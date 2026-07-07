import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { CURRICULUM } from '../data/curriculum.js'
import { BADGES } from '../data/gamedata.js'

/* ============================================================================
   PROGRESS STORE
   Per-user progress persisted to localStorage. Keyed by user id so multiple
   accounts on one machine stay separate. Swap the load/save internals for a
   database call later (e.g. Supabase row per user) without touching the UI.
   ============================================================================ */

const StoreContext = createContext(null)

const DEFAULT = {
  xp: 0, completed: [], quizScores: {}, quizWins: 0, reflections: {}, confidence: {},
  interviews: [], generated: 0, capstone: {}, capstoneDone: false,
  streak: 0, lastActive: null, weak: [], strong: [], badges: []
}

const keyFor = (uid) => `dojo_progress_${uid || 'anon'}`

export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.id
  const [state, setState] = useState(DEFAULT)

  // Load whenever the user changes.
  useEffect(() => {
    if (!uid) { setState(DEFAULT); return }
    try {
      const raw = localStorage.getItem(keyFor(uid))
      setState(raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT)
    } catch { setState(DEFAULT) }
  }, [uid])

  // Persist on change.
  useEffect(() => {
    if (uid) localStorage.setItem(keyFor(uid), JSON.stringify(state))
  }, [state, uid])

  const update = useCallback((fn) => setState((s) => {
    const next = typeof fn === 'function' ? fn({ ...s }) : { ...s, ...fn }
    return next
  }), [])

  /* ---- helpers ---- */
  const totalScreens = CURRICULUM.reduce((a, l) => a + l.screens.length, 0)
  const screenId = (lvl, idx) => `${lvl}.${idx}`
  const levelScreens = (lvl) => CURRICULUM.find((l) => l.id === lvl).screens.length
  const levelDoneCount = (lvl, s = state) => {
    let c = 0
    for (let i = 0; i < levelScreens(lvl); i++) if (s.completed.includes(screenId(lvl, i))) c++
    return c
  }
  const levelDone = (lvl, s = state) => levelDoneCount(lvl, s) === levelScreens(lvl)
  const maxUnlocked = (s = state) => {
    let m = 1
    for (let i = 1; i < CURRICULUM.length; i++) { if (levelDone(i, s)) m = i + 1; else break }
    return m
  }
  const isUnlocked = (lvl, s = state) => lvl <= maxUnlocked(s)
  const masteryPct = () => Math.round((state.completed.length / totalScreens) * 100)

  const todayStr = () => new Date().toISOString().slice(0, 10)

  const bumpStreak = useCallback(() => {
    setState((s) => {
      const t = todayStr()
      if (s.lastActive === t) return s
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const streak = s.lastActive === y ? (s.streak || 0) + 1 : 1
      return { ...s, streak, lastActive: t }
    })
  }, [])

  const addXP = useCallback((n) => setState((s) => ({ ...s, xp: s.xp + n })), [])

  const checkBadges = useCallback(() => {
    setState((s) => {
      const earned = [...s.badges]
      const ctx = { ...s, levelDone: (l) => levelDone(l, s), maxUnlocked: () => maxUnlocked(s) }
      BADGES.forEach((b) => { if (!earned.includes(b.id) && b.check(ctx)) earned.push(b.id) })
      return earned.length === s.badges.length ? s : { ...s, badges: earned }
    })
  }, [])

  const exportData = () => JSON.stringify(state, null, 2)
  const importData = (json) => {
    try { setState({ ...DEFAULT, ...JSON.parse(json) }); return true } catch { return false }
  }
  const reset = () => setState(DEFAULT)

  const value = {
    state, update, addXP, bumpStreak, checkBadges,
    screenId, levelScreens, levelDoneCount, levelDone, maxUnlocked, isUnlocked,
    masteryPct, totalScreens, todayStr, exportData, importData, reset
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
