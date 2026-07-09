import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const go = () => setOnline(true)
    const gf = () => setOnline(false)
    window.addEventListener('online', go)
    window.addEventListener('offline', gf)
    return () => {
      window.removeEventListener('online', go)
      window.removeEventListener('offline', gf)
    }
  }, [])

  return online
}
