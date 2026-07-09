/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { CURRICULUM } from '../data/curriculum.js'
import { BADGES } from '../data/gamedata.js'

/* ============================================================================
   PROGRESS STORE
   Split into StateContext (triggers re-renders) and ActionsContext (stable).
   Components that only call actions (e.g. InterviewSim) can use useActions()
   to avoid re-rendering when state changes.
   ============================================================================ */

const StateContext = createContext(null)
const ActionsContext = createContext(null)

const DEFAULT = {
  xp: 0, completed: [], quizScores: {}, quizWins: 0, reflections: {}, confidence: {},
  interviews: [], generated: 0, capstone: {}, capstoneDone: false,
  streak: 0, lastActive: null, weak: [], strong: [], badges: []
}

const GUEST_KEY = 'dojo_progress_local_guest'
const keyFor = (uid) => `dojo_progress_${uid || 'anon'}`
const totalScreens = CURRICULUM.reduce((a, l) => a + l.screens.length, 0)

export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.id
  const [state, setState] = useState(DEFAULT)
  const stateRef = useRef(state)
  stateRef.current = state

  const persistRef = useRef(null)

  useEffect(() => {
    if (!uid) { setState(DEFAULT); return }
    try {
      const raw = localStorage.getItem(keyFor(uid))
      if (raw) {
        setState({ ...DEFAULT, ...JSON.parse(raw) })
      } else if (uid !== 'local_guest') {
        const guestRaw = localStorage.getItem(GUEST_KEY)
        if (guestRaw) {
          localStorage.setItem(keyFor(uid), guestRaw)
          localStorage.removeItem(GUEST_KEY)
          try { localStorage.removeItem('dojo_progress_anon') } catch { /* ignore */ }
          setState({ ...DEFAULT, ...JSON.parse(guestRaw) })
        } else {
          setState(DEFAULT)
        }
      } else {
        setState(DEFAULT)
      }
    } catch { setState(DEFAULT) }
  }, [uid])

  useEffect(() => {
    if (!uid) return
    clearTimeout(persistRef.current)
    persistRef.current = setTimeout(() => {
      localStorage.setItem(keyFor(uid), JSON.stringify(state))
    }, 500)
    return () => clearTimeout(persistRef.current)
  }, [state, uid])

  const update = useCallback((fn) => setState((s) => {
    const next = typeof fn === 'function' ? fn({ ...s }) : { ...s, ...fn }
    return next
  }), [])

  const screenId = useCallback((lvl, idx) => `${lvl}.${idx}`, [])
  const levelScreens = useCallback((lvl) => CURRICULUM.find((l) => l.id === lvl).screens.length, [])
  const todayStr = useCallback(() => new Date().toISOString().slice(0, 10), [])

  const bumpStreak = useCallback(() => {
    setState((s) => {
      const t = todayStr()
      if (s.lastActive === t) return s
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const streak = s.lastActive === y ? (s.streak || 0) + 1 : 1
      return { ...s, streak, lastActive: t }
    })
  }, [todayStr])

  const addXP = useCallback((n) => setState((s) => ({ ...s, xp: s.xp + n })), [])

  const checkBadges = useCallback(() => {
    setState((s) => {
      const sRef = { ...s }
      const lvlDone = (l) => sRef.completed.filter((c) => c.startsWith(`${l}.`)).length === (CURRICULUM.find((x) => x.id === l)?.screens.length || 0)
      const maxUn = (() => { let m = 1; for (let i = 1; i < CURRICULUM.length; i++) { if (lvlDone(i)) m = i + 1; else break } return m })()
      const earned = [...s.badges]
      const ctx = { ...s, levelDone: lvlDone, maxUnlocked: () => maxUn }
      BADGES.forEach((b) => { if (!earned.includes(b.id) && b.check(ctx)) earned.push(b.id) })
      return earned.length === s.badges.length ? s : { ...s, badges: earned }
    })
  }, [])

  const importData = useCallback((json) => {
    try { setState({ ...DEFAULT, ...JSON.parse(json) }); return true } catch { return false }
  }, [])
  const reset = useCallback(() => setState(DEFAULT), [])

  const actions = useMemo(() => ({
    update, addXP, bumpStreak, checkBadges,
    screenId, levelScreens, todayStr, exportData: () => JSON.stringify(stateRef.current, null, 2),
    importData, reset
  }), [update, addXP, bumpStreak, checkBadges, screenId, levelScreens, todayStr, importData, reset])

  const stateValue = useMemo(() => {
    const levelDoneCount = (lvl, s) => {
      const st = s || stateRef.current
      let c = 0
      for (let i = 0; i < levelScreens(lvl); i++) if (st.completed.includes(screenId(lvl, i))) c++
      return c
    }
    const levelDone = (lvl, s) => levelDoneCount(lvl, s) === levelScreens(lvl)
    const maxUnlocked = (s) => {
      const st = s || stateRef.current
      let m = 1
      for (let i = 1; i < CURRICULUM.length; i++) { if (levelDone(i, st)) m = i + 1; else break }
      return m
    }
    const isUnlocked = (lvl, s) => lvl <= maxUnlocked(s)
    const masteryPct = (s) => {
      const st = s || stateRef.current
      return Math.round((st.completed.length / totalScreens) * 100)
    }
    return { state, levelDoneCount, levelDone, maxUnlocked, isUnlocked, masteryPct, totalScreens }
  }, [state, levelScreens, screenId])

  return (
    <StateContext.Provider value={stateValue}>
      <ActionsContext.Provider value={actions}>
        {children}
      </ActionsContext.Provider>
    </StateContext.Provider>
  )
}

export const useStore = () => ({
  ...useContext(StateContext),
  ...useContext(ActionsContext)
})

export const useStoreState = () => useContext(StateContext)

export const useStoreActions = () => useContext(ActionsContext)