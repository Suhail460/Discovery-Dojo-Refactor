import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { toPascal } from '../utils/helpers.js'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, icon = 'sparkles') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg, icon }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 80, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', pointerEvents: 'none' }}>
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = Icons[toPascal(t.icon)] || Sparkles
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '12px 20px', borderRadius: 14, fontWeight: 600, fontSize: '.9rem', boxShadow: 'var(--sh-lg)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={18} color="var(--gold)" /> {t.msg}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
