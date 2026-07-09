import { useAuth } from '../context/AuthContext.jsx'

const STORAGE_KEY = 'dojo_guest_usage'

function getUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: null, interview: 0, generator: 0 }
    return JSON.parse(raw)
  } catch {
    return { date: null, interview: 0, generator: 0 }
  }
}

function saveUsage(usage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage))
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function useGuestLimits() {
  const { user } = useAuth()
  const isGuest = user?.provider === 'guest'

  function getRemaining(type) {
    if (!isGuest) return Infinity
    const usage = getUsage()
    if (usage.date !== today()) return 3
    return Math.max(0, 3 - (usage[type] || 0))
  }

  function consumeOne(type) {
    if (!isGuest) return true
    const usage = getUsage()
    if (usage.date !== today()) {
      saveUsage({ date: today(), [type]: 1 })
      return true
    }
    if ((usage[type] || 0) >= 3) return false
    saveUsage({ ...usage, [type]: (usage[type] || 0) + 1 })
    return true
  }

  return { isGuest, getRemaining, consumeOne }
}
