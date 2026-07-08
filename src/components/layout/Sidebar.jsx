import { Compass, LayoutDashboard, Mic, Dices, Swords, Flag, Award, Lock, Check, RotateCcw, X } from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum.js'
import { useStore } from '../../hooks/useStore.jsx'

const NAV = [
  { view: 'home', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'interview', label: 'Interview Simulator', icon: Mic },
  { view: 'generator', label: 'Exercise Generator', icon: Dices },
  { view: 'challenges', label: 'Discovery Challenges', icon: Swords },
  { view: 'capstone', label: 'Capstone Project', icon: Flag },
  { view: 'badges', label: 'Skill Tree & Badges', icon: Award }
]

export default function Sidebar({ nav, open, onClose, onReset }) {
  const { view, level } = nav.current
  const { levelDoneCount, levelScreens, levelDone, isUnlocked } = useStore()

  return (
    <>
      <div onClick={onClose} className="sb-overlay" aria-hidden="true"
        style={{ position: 'fixed', inset: 0, background: 'oklch(0 0 0 / 0.4)', backdropFilter: 'blur(4px)', zIndex: 39, display: open ? 'block' : 'none' }} />
      <aside className="sidebar" role="navigation" aria-label="Navigation sidebar"
        style={{
          background: 'var(--surface)', borderRight: '1px solid var(--line)', padding: '24px 16px',
          display: 'flex', flexDirection: 'column', gap: 16, zIndex: 40, overflowY: 'auto',
          position: 'fixed', left: 0, top: 0, width: 300, height: '100dvh',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .35s var(--ease-out)',
          boxShadow: 'var(--sh-lg)',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', marginBottom: 8 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(145deg,var(--accent),var(--plum))', display: 'grid', placeItems: 'center', color: '#fff', boxShadow: 'var(--sh-md)', transform: 'rotate(-4deg)' }}><Compass size={22} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: '1.12rem', lineHeight: 1 }}>Discovery Dojo</div>
            <div style={{ fontSize: '.7rem', color: 'var(--ink-3)', letterSpacing: '.04em', textTransform: 'uppercase', marginTop: 3 }}>Product Discovery Mastery</div>
          </div>
          <button onClick={onClose} className="hide-desktop" aria-label="Close sidebar"
            style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface)', display: 'grid', placeItems: 'center', color: 'var(--ink-2)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div>
          <GroupLabel>Practice</GroupLabel>
          {NAV.map((n) => (
            <NavBtn key={n.view} active={view === n.view} icon={n.icon} label={n.label} onClick={() => { nav.go(n.view); onClose() }} />
          ))}
        </div>

        <div>
          <GroupLabel>Learning Path</GroupLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {CURRICULUM.map((l) => {
              const unlocked = isUnlocked(l.id), done = levelDone(l.id)
              const active = view === 'level' && level === l.id
              const pct = Math.round((levelDoneCount(l.id) / levelScreens(l.id)) * 100)
              return (
                <button key={l.id} disabled={!unlocked} onClick={() => { nav.openLevel(l.id); onClose() }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', border: 'none', background: active ? 'var(--plum-wash)' : 'transparent', padding: '8px 12px', borderRadius: 8, cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : .5, transition: 'all .18s' }}>
                  <span style={{ width: 26, height: 26, borderRadius: 8, flex: 'none', display: 'grid', placeItems: 'center', fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: '.78rem', background: done ? 'var(--ok)' : active ? 'var(--plum)' : 'var(--surface-3)', color: done || active ? '#fff' : 'var(--ink-2)', border: done || active ? 'none' : '1px solid var(--line)' }}>
                    {done ? <Check size={14} /> : l.id}
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: active ? 'var(--plum)' : 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</span>
                    <span style={{ display: 'block', height: 3, borderRadius: 3, background: 'var(--line-soft)', marginTop: 4, overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: pct + '%', background: 'var(--plum-2)', borderRadius: 3, transition: 'width .5s' }} />
                    </span>
                  </span>
                  {!unlocked && <Lock size={14} color="var(--ink-3)" style={{ flex: 'none' }} />}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginTop: 'auto', padding: '0 8px' }}>
          <button onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', border: 'none', background: 'transparent', color: 'var(--ink-3)', fontSize: '.8rem', fontWeight: 600, padding: '9px 12px', borderRadius: 8, cursor: 'pointer' }}>
            <RotateCcw size={16} /> Reset progress
          </button>
        </div>
      </aside>
    </>
  )
}

function GroupLabel({ children }) {
  return <div style={{ fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 700, padding: '0 8px', marginBottom: 6 }}>{children}</div>
}
function NavBtn({ active, icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', border: 'none', background: active ? 'var(--accent-wash)' : 'transparent', color: active ? 'var(--accent-ink)' : 'var(--ink-2)', fontSize: '.92rem', fontWeight: 600, padding: '9px 12px', borderRadius: 8, cursor: 'pointer', transition: 'all .18s' }}>
      <Icon size={18} color={active ? 'var(--accent)' : 'var(--ink-3)'} /> {label}
    </button>
  )
}
