import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

export default function StreakBadge({ streak }) {
  return (
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} whileHover={{ scale: 1.05 }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px 8px 12px', borderRadius: 999, background: streak >= 3 ? 'var(--accent-wash)' : 'var(--surface-2)', border: '1px solid ' + (streak >= 3 ? 'var(--accent)' : 'var(--line)') }}>
      <motion.div animate={{ rotate: streak >= 3 ? [0, -10, 10, -5, 0] : 0 }} transition={{ duration: 0.5 }}>
        <Flame size={18} color={streak >= 3 ? 'var(--accent)' : 'var(--ink-3)'} />
      </motion.div>
      <div>
        <div className="tnum" style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: '1rem', lineHeight: 1.2, color: streak >= 3 ? 'var(--accent-ink)' : 'var(--ink-2)' }}>{streak || 0} day{streak !== 1 ? 's' : ''}</div>
        <div style={{ fontSize: '.64rem', color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '.03em' }}>Current streak</div>
      </div>
    </motion.div>
  )
}
