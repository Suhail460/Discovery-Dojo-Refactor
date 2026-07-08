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
    <div style={{ padding: 20, borderRadius: 22, background: 'linear-gradient(135deg, var(--surface) 0%, var(--plum-wash) 100%)', border: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Target size={16} color="var(--plum)" />
        <span style={{ fontWeight: 700, fontSize: '.82rem', color: 'var(--ink-2)' }}>Daily goal</span>
        {doneToday && <span className="pill pill-d1" style={{ marginLeft: 'auto' }}><Sparkles size={11} /> Done today</span>}
      </div>
      <div style={{ fontWeight: 700, fontSize: '1.5rem', fontFamily: '"Bricolage Grotesque"', marginBottom: 4 }}>
        {doneToday ? 'Great work!' : 'Complete 1 screen'}
      </div>
      <div style={{ fontSize: '.82rem', color: 'var(--ink-3)', marginBottom: 14 }}>
        {doneToday ? 'Come back tomorrow for another.' : `${screensDone} / ${target} today`}
      </div>
      <div style={{ height: 6, borderRadius: 6, background: 'var(--line-soft)', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }}
          style={{ height: '100%', borderRadius: 6, background: 'var(--plum-2)' }} />
      </div>
      <div style={{ marginTop: 12, fontSize: '.76rem', color: 'var(--ink-3)', fontWeight: 600 }}>
        {masteryPct()}% overall mastery · {state.badges.length} badges earned
      </div>
    </div>
  )
}
