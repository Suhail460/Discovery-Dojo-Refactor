import { motion } from 'framer-motion'
import { LayoutDashboard, Mic, Dices, Swords, Award } from 'lucide-react'

const ITEMS = [
  { view: 'home', label: 'Learn', icon: LayoutDashboard },
  { view: 'interview', label: 'Interview', icon: Mic },
  { view: 'generator', label: 'Practice', icon: Dices },
  { view: 'challenges', label: 'Drills', icon: Swords },
  { view: 'badges', label: 'Progress', icon: Award },
]

export default function BottomNav({ nav, view }) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {ITEMS.map(({ view: v, label, icon: Icon }) => {
        const active = view === v
        return (
          <button key={v} onClick={() => nav.go(v)}
            aria-label={label} aria-current={active ? 'page' : undefined}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 3, border: 'none', background: 'transparent', color: active ? 'var(--plum)' : 'var(--ink-3)',
              cursor: 'pointer', padding: '6px 0', fontSize: '.64rem', fontWeight: active ? 700 : 600,
              fontFamily: 'inherit', letterSpacing: '.02em', transition: 'color .15s', minHeight: 44,
              position: 'relative', WebkitTapHighlightColor: 'transparent'
            }}>
            <div style={{ position: 'relative' }}>
              <Icon size={active ? 22 : 20} strokeWidth={active ? 2 : 1.5} />
              {active && (
                <motion.div layoutId="nav-indicator"
                  style={{ position: 'absolute', top: -4, left: '50%', x: '-50%', width: 4, height: 4, borderRadius: '50%', background: 'var(--plum)' }} />
              )}
            </div>
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
