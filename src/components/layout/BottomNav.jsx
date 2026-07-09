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
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around', maxWidth: 500, margin: '0 auto', position: 'relative' }}>
        {ITEMS.map(({ view: v, label, icon: Icon }) => {
          const active = view === v
          return (
            <button key={v} onClick={() => nav.go(v)}
              aria-label={label} aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 2, border: 'none', background: 'transparent', color: active ? 'var(--primary)' : 'var(--ink-3)',
                cursor: 'pointer', padding: '4px 0', fontSize: '.6rem', fontWeight: active ? 700 : 600,
                fontFamily: 'inherit', letterSpacing: '.02em', transition: 'color .2s var(--ease-out)', minHeight: 40,
                position: 'relative', WebkitTapHighlightColor: 'transparent', width: 50
              }}>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Icon size={active ? 20 : 18} strokeWidth={active ? 2 : 1.5} />
                {active && (
                  <motion.div layoutId="nav-indicator"
                    style={{ width: 16, height: 2, borderRadius: 1, background: 'var(--primary)' }} />
                )}
              </div>
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
