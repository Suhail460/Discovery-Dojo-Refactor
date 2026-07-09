import { useCallback, useMemo } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useStore } from '../hooks/useStore.jsx'

const VIEW_MAP = {
  '/': 'home',
  '/interview': 'interview',
  '/generator': 'generator',
  '/challenges': 'challenges',
  '/capstone': 'capstone',
  '/badges': 'badges'
}

export function useNavigation(toast) {
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const store = useStore()

  const current = useMemo(() => {
    const path = location.pathname
    if (path.startsWith('/level/')) return { view: 'level', level: Number(params.id), screen: Number(params.screen) || 0 }
    return { view: VIEW_MAP[path] || 'home', level: null, screen: 0 }
  }, [location.pathname, params.id, params.screen])

  const go = useCallback((view) => {
    const path = view === 'home' ? '/' : `/${view}`
    navigate(path)
    window.scrollTo(0, 0)
  }, [navigate])

  const openLevel = useCallback((lvl, screenIdx) => {
    if (!store.isUnlocked(lvl)) { toast?.('Finish the previous level to unlock this.', 'lock'); return }
    let idx
    if (screenIdx !== undefined && screenIdx >= 0 && !store.state.completed.includes(store.screenId(lvl, screenIdx))) {
      idx = screenIdx
    } else {
      idx = 0; const n = store.levelScreens(lvl)
      for (let i = 0; i < n; i++) { if (!store.state.completed.includes(store.screenId(lvl, i))) { idx = i; break } if (i === n - 1) idx = i }
    }
    navigate(`/level/${lvl}/${idx}`); window.scrollTo(0, 0)
  }, [navigate, store, toast])

  const gotoScreen = useCallback((idx) => {
    navigate(`/level/${current.level}/${idx}`)
  }, [navigate, current.level])

  return useMemo(() => ({ current, go, openLevel, gotoScreen }), [current, go, openLevel, gotoScreen])
}
