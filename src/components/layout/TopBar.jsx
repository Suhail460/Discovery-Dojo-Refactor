import { useState, useRef, useEffect } from 'react'
import { Menu, Zap, Flame, Gauge, Moon, Sun, LogOut, Download, Upload, Sparkles } from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum.js'
import { useStore } from '../../hooks/useStore.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function TopBar({ nav, onMenu, onCoachToggle }) {
  const { state, masteryPct, exportData, importData } = useStore()
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const fileRef = useRef(null)
  const popRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (popRef.current && !popRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  const crumbs = { home: 'Dashboard', interview: 'Interview Simulator', generator: 'Exercise Generator', challenges: 'Discovery Challenges', capstone: 'Capstone Project', badges: 'Skill Tree & Badges' }
  let crumb = crumbs[nav.current.view] || ''
  if (nav.current.view === 'level') { const l = CURRICULUM.find((x) => x.id === nav.current.level); crumb = `Level ${l.id} · ${l.title}` }

  function doExport() {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'discovery-dojo-progress.json'; a.click()
    URL.revokeObjectURL(url); setMenuOpen(false)
  }
  function doImport(e) {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = () => { importData(r.result); setMenuOpen(false) }; r.readAsText(f)
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', alignItems: 'center', gap: 16, padding: '12px clamp(16px,4vw,40px)', background: theme === 'dark' ? 'oklch(0.165 0.014 300 / 0.82)' : 'oklch(0.982 0.006 40 / 0.82)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)' }}>
      <button className="menu-toggle" onClick={onMenu} style={{ border: '1px solid var(--line)', background: 'var(--surface)', borderRadius: 10, width: 40, height: 40, display: 'none', placeItems: 'center', color: 'var(--ink)', cursor: 'pointer' }}><Menu size={20} /></button>
      <div style={{ fontWeight: 600, color: 'var(--ink-2)', fontSize: '.9rem', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{crumb}</div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Chip icon={<Zap size={15} />} color="var(--plum)">{state.xp} XP</Chip>
        <Chip icon={<Flame size={15} />} color="var(--accent)">{state.streak || 0}</Chip>
        <Chip icon={<Gauge size={15} />} color="var(--gold-ink)" hideSm>{masteryPct()}%</Chip>
        <IconBtn onClick={onCoachToggle} title="Ask the AI coach"><Sparkles size={18} /></IconBtn>
        <IconBtn onClick={toggle} title="Toggle theme">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</IconBtn>

        <div style={{ position: 'relative' }} ref={popRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ width: 40, height: 40, borderRadius: 999, border: 'none', background: 'linear-gradient(145deg,var(--plum),var(--accent))', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{user?.avatar || 'U'}</button>
          {menuOpen && (
            <div style={{ position: 'absolute', right: 0, top: 48, width: 220, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, boxShadow: 'var(--sh-lg)', padding: 8, zIndex: 50 }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--line)', marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{user?.name}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--ink-3)' }}>{user?.email || 'Guest session'}</div>
              </div>
              <MenuItem icon={<Download size={16} />} onClick={doExport}>Export progress</MenuItem>
              <MenuItem icon={<Upload size={16} />} onClick={() => fileRef.current?.click()}>Import progress</MenuItem>
              <MenuItem icon={<LogOut size={16} />} onClick={logout} danger>Sign out</MenuItem>
              <input ref={fileRef} type="file" accept="application/json" onChange={doImport} style={{ display: 'none' }} />
            </div>
          )}
        </div>
      </div>

      <style>{`@media (max-width:1000px){ .menu-toggle{ display:grid !important } }`}</style>
    </header>
  )
}

function Chip({ icon, color, children, hideSm }) {
  return <div className={hideSm ? 'chip-hide-sm' : ''} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--line)', fontWeight: 700, fontSize: '.82rem', color }}>{icon} <span className="tnum">{children}</span></div>
}
function IconBtn({ children, onClick, title }) {
  return <button onClick={onClick} title={title} style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface)', display: 'grid', placeItems: 'center', color: 'var(--ink-2)', cursor: 'pointer' }}>{children}</button>
}
function MenuItem({ icon, children, onClick, danger }) {
  return <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', border: 'none', background: 'transparent', color: danger ? 'var(--bad)' : 'var(--ink-2)', fontSize: '.88rem', fontWeight: 600, padding: '9px 10px', borderRadius: 8, cursor: 'pointer' }}>{icon} {children}</button>
}
