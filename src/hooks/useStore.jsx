/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { CURRICULUM } from '../data/curriculum.js'
import { BADGES, ACHIEVEMENTS } from '../data/gamedata.js'
import { syncProgressToFirestore, loadProgressFromFirestore } from '../services/userService.js'
import { trackBadgeEarned } from '../services/analyticsService.js'

const StateContext = createContext(null)
const ActionsContext = createContext(null)

const DEFAULT = {
  xp: 0, completed: [], quizScores: {}, quizWins: 0, reflections: {}, confidence: {},
  interviews: [], generated: 0, capstone: {}, capstoneDone: false,
  streak: 0, lastActive: null, weak: [], strong: [], badges: [], bookmarks: [],
  resumePosition: null, learningTime: 0, dailyLog: {}, achievements: []
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
  const syncTimer = useRef(null)
  const sessionStart = useRef(null)

  useEffect(() => {
    if (!uid) { setState(DEFAULT); return }
    const load = async () => {
      let loaded = false
      if (uid !== 'local_guest') {
        const fireData = await loadProgressFromFirestore(uid)
        if (fireData) {
          setState((prev) => ({ ...prev, ...fireData, completed: fireData.completedLessons || prev.completed }))
          loaded = true
        }
      }
      if (!loaded) {
        try {
          const raw = localStorage.getItem(keyFor(uid))
          if (raw) {
            setState({ ...DEFAULT, ...JSON.parse(raw) })
            loaded = true
          } else if (uid !== 'local_guest') {
            const guestRaw = localStorage.getItem(GUEST_KEY)
            if (guestRaw) {
              localStorage.setItem(keyFor(uid), guestRaw)
              localStorage.removeItem(GUEST_KEY)
              try { localStorage.removeItem('dojo_progress_anon') } catch { /* ignore */ }
              setState({ ...DEFAULT, ...JSON.parse(guestRaw) })
              loaded = true
            }
          }
        } catch { /* ignore */ }
      }
      if (!loaded) setState(DEFAULT)
      sessionStart.current = Date.now()
    }
    load()
    return () => {
      if (sessionStart.current) {
        const elapsed = Math.round((Date.now() - sessionStart.current) / 1000)
        if (elapsed > 10) {
          setState((s) => ({ ...s, learningTime: (s.learningTime || 0) + elapsed }))
        }
      }
    }
  }, [uid])

  useEffect(() => {
    if (!uid) return
    clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      localStorage.setItem(keyFor(uid), JSON.stringify(state))
      if (uid !== 'local_guest') {
        syncProgressToFirestore(uid, state)
      }
    }, 800)
    return () => clearTimeout(syncTimer.current)
  }, [state, uid])

  const update = useCallback((fn) => setState((s) => {
    const next = typeof fn === 'function' ? fn({ ...s }) : { ...s, ...fn }
    return next
  }), [])

  const screenId = useCallback((lvl, idx) => `${lvl}.${idx}`, [])
  const levelScreens = useCallback((lvl) => CURRICULUM.find((l) => l.id === lvl)?.screens.length || 0, [])
  const todayStr = useCallback(() => new Date().toISOString().slice(0, 10), [])

  const bumpStreak = useCallback(() => {
    setState((s) => {
      const t = todayStr()
      if (s.lastActive === t) return s
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const streak = s.lastActive === y ? (s.streak || 0) + 1 : 1
      const dl = { ...(s.dailyLog || {}), [t]: (s.dailyLog?.[t] || 0) + 1 }
      const dailyDone = dl[t] >= 3
      if (dailyDone && !s.achievements?.includes?.('daily_goal')) {
        return { ...s, streak, lastActive: t, dailyLog: dl, achievements: [...(s.achievements || []), 'daily_goal'] }
      }
      return { ...s, streak, lastActive: t, dailyLog: dl }
    })
  }, [todayStr])

  const addXP = useCallback((n) => setState((s) => ({ ...s, xp: s.xp + n })), [])

  const saveResumePosition = useCallback((level, screen) => {
    setState((s) => ({ ...s, resumePosition: { level, screen, timestamp: Date.now() } }))
  }, [])

  const checkBadges = useCallback(() => {
    setState((s) => {
      const sRef = { ...s }
      const lvlDone = (l) => sRef.completed.filter((c) => c.startsWith(`${l}.`)).length === (CURRICULUM.find((x) => x.id === l)?.screens.length || 0)
      const maxUn = (() => { let m = 1; for (let i = 1; i < CURRICULUM.length; i++) { if (lvlDone(i)) m = i + 1; else break } return m })()
      const earned = [...s.badges]
      const ctx = { ...s, levelDone: lvlDone, maxUnlocked: () => maxUn }
      BADGES.forEach((b) => { if (!earned.includes(b.id) && b.check(ctx)) earned.push(b.id) })
      const newBadges = earned.filter((b) => !s.badges.includes(b))
      newBadges.forEach((b) => {
        const bd = BADGES.find((x) => x.id === b)
        if (bd) trackBadgeEarned(b, bd.name)
      })
      const aEarned = [...(s.achievements || [])]
      const aCtx = { xp: s.xp, completed: s.completed.length, interviews: s.interviews.length, quizzes: Object.keys(s.quizScores || {}).length, badges: earned, capstoneDone: s.capstoneDone, streak: s.streak || 0 }
      ACHIEVEMENTS.forEach((a) => { if (!aEarned.includes(a.id) && a.check(aCtx)) aEarned.push(a.id) })
      return earned.length === s.badges.length && aEarned.length === (s.achievements || []).length
        ? s : { ...s, badges: earned, achievements: aEarned }
    })
  }, [])

  const importData = useCallback((json) => {
    try { setState({ ...DEFAULT, ...JSON.parse(json) }); return true } catch { return false }
  }, [])
  const reset = useCallback(() => setState(DEFAULT), [])

  const actions = useMemo(() => ({
    update, addXP, bumpStreak, checkBadges, saveResumePosition,
    screenId, levelScreens, todayStr, exportData: () => JSON.stringify(stateRef.current, null, 2),
    importData, reset
  }), [update, addXP, bumpStreak, checkBadges, saveResumePosition, screenId, levelScreens, todayStr, importData, reset])

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
    const dailyScreens = () => {
      const t = todayStr()
      return stateRef.current.dailyLog?.[t] || 0
    }
    const formatTime = (seconds) => {
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      if (h > 0) return `${h}h ${m}m`
      return `${m}m`
    }
    return { state, levelDoneCount, levelDone, maxUnlocked, isUnlocked, masteryPct, totalScreens, dailyScreens, formatTime }
  }, [state, levelScreens, screenId, todayStr])

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
