import { useMemo } from 'react'
import { useStore } from './useStore.jsx'
import { CURRICULUM } from '../data/curriculum.js'
import { BADGES } from '../data/gamedata.js'

export function useNotifications() {
  const { state, levelDone, isUnlocked } = useStore()

  return useMemo(() => {
    const items = []
    const nextBadge = BADGES.find((b) => !state.badges.includes(b.id))
    if (nextBadge) {
      items.push({ id: 'next-badge', icon: 'award', title: 'Next badge available', desc: nextBadge.name })
    }
    const nextLevel = CURRICULUM.find((l) => !levelDone(l.id) && isUnlocked(l.id))
    if (nextLevel && state.completed.length > 0) {
      const pct = Math.round((state.completed.length / CURRICULUM.reduce((a, l) => a + l.screens.length, 0)) * 100)
      items.push({ id: 'continue', icon: 'play', title: `Level ${nextLevel.id}: ${nextLevel.title}`, desc: `${pct}% complete` })
    }
    if (state.interviews.length > 0) {
      items.push({ id: 'interviews', icon: 'mic', title: 'Practice interviews', desc: `${state.interviews.length} completed` })
    }
    if (state.streak >= 2) {
      items.push({ id: 'streak', icon: 'flame', title: `${state.streak}-day streak`, desc: 'Keep it going!' })
    }
    if (state.weak.length > 0) {
      items.push({ id: 'weak', icon: 'alert-triangle', title: 'Topics to revisit', desc: `${state.weak.length} weak areas` })
    }
    return items
  }, [state, levelDone, isUnlocked])
}
