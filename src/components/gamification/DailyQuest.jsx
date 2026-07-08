import { motion } from 'framer-motion'
import { Target, Sparkles } from 'lucide-react'
import { useStore } from '../../hooks/useStore.jsx'

export default function DailyQuest() {
  const { state, masteryPct } = useStore()
  const doneToday = state.lastActive === new Date().toISOString().slice(0, 10)
  const screensDone = state.completed.length
  const target = 1
  const progress = Math.min(screensDone / target, 1)

  return (
    <div className="card" style={{ padding: 18, background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Target size={15} color="var(--primary)" />
        <span style={{ fontWeight: 700, fontSize: '.8rem', color: 'var(--ink-2)' }}>Daily goal</span>
        {doneToday && <span className="pill pill-done" style={{ marginLeft: 'auto' }}><Sparkles size={10} /> Done</span>}
      </div>
      <div className="heading" style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 2 }}>
        {doneToday ? 'Great work!' : 'Complete 1 screen'}
      </div>
      <div style={{ fontSize: '.8rem', color: 'var(--ink-3)', marginBottom: 12 }}>
        {doneToday ? 'Come back tomorrow.' : `${screensDone} / ${target} today`}
      </div>
      <div className="progress-track" style={{ height: 5, borderRadius: 3 }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }}
          className="progress-fill" style={{ borderRadius: 3, background: 'var(--primary)' }} />
      </div>
      <div style={{ marginTop: 10, fontSize: '.74rem', color: 'var(--ink-3)', fontWeight: 600 }}>
        {masteryPct()}% mastery · {state.badges.length} badges
      </div>
    </div>
  )
}
