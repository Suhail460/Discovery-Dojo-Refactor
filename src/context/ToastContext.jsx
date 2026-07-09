/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, PartyPopper, Lightbulb, RotateCcw, Save, Award, Flag, ClipboardList, Check, Zap, Bell } from 'lucide-react'

const TOAST_ICONS = { sparkles: Sparkles, 'party-popper': PartyPopper, lightbulb: Lightbulb, 'rotate-ccw': RotateCcw, save: Save, award: Award, flag: Flag, 'clipboard-list': ClipboardList, check: Check, zap: Zap, bell: Bell }

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
      <div role="status" aria-live="polite" aria-atomic="true" style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 80, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', pointerEvents: 'none' }}>
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = TOAST_ICONS[t.icon] || Sparkles
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '12px 20px', borderRadius: 14, fontWeight: 600, fontSize: '.9rem', boxShadow: 'var(--sh-lg)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={18} color="var(--primary)" /> {t.msg}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
