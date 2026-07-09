import { useState, useRef, useEffect } from 'react'
import { Menu, Zap, Flame, Gauge, Moon, Sun, LogOut, Download, Upload, Sparkles, Bell, Award, Play, Mic, Flame as FlameIcon, AlertTriangle, WifiOff } from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum.js'
import { useStore } from '../../hooks/useStore.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNotifications } from '../../hooks/useNotifications.js'
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js'

const notifIcons = { award: Award, play: Play, mic: Mic, flame: FlameIcon, 'alert-triangle': AlertTriangle }

const themeIcons = { light: <Moon size={16} />, dark: <Sun size={16} /> }

export default function TopBar({ nav, onMenu, onCoachToggle }) {
  const { state, masteryPct, exportData, importData } = useStore()
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuth()
  const notifications = useNotifications()
  const online = useOnlineStatus()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const fileRef = useRef(null)
  const popRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (popRef.current && !popRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    const h = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false) }
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
    <header className="topbar">
      <button className="topbar-menu-toggle" onClick={onMenu} aria-label="Open menu"
        style={{ border: 'none', background: 'var(--surface-2)', borderRadius: 10, width: 36, height: 36, display: 'grid', placeItems: 'center', color: 'var(--ink)', cursor: 'pointer' }}>
        <Menu size={18} />
      </button>
      <div style={{ fontWeight: 600, color: 'var(--ink-2)', fontSize: '.85rem', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{crumb}</div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
        {!online && (
          <div title="You are offline. Progress still saves locally."
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px', borderRadius: 999, background: 'var(--amber-wash)', color: 'var(--amber)', fontSize: '.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            <WifiOff size={12} /> Offline
          </div>
        )}
        <Chip icon={<Zap size={13} />} color="var(--primary)" bg="var(--primary-wash)"><span className="tnum">{state.xp}</span> XP</Chip>
        <Chip icon={<Flame size={13} />} color="var(--amber)" bg="var(--amber-wash)"><span className="tnum">{state.streak || 0}</span></Chip>
        <Chip icon={<Gauge size={13} />} color="var(--green)" bg="var(--green-wash)" hideSm><span className="tnum">{masteryPct()}%</span></Chip>
        <IconBtn onClick={onCoachToggle} title="Ask the AI coach"><Sparkles size={16} /></IconBtn>
        <div ref={notifRef} style={{ position: 'relative' }}>
          <IconBtn onClick={() => setNotifOpen((o) => !o)} title="Notifications" aria-haspopup="true" aria-expanded={notifOpen}><Bell size={16} />
            {notifications.length > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: 'var(--bad)' }} />}
          </IconBtn>
           {notifOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 40, width: 280,
              background: 'var(--surface)',
              border: '1px solid var(--line)', borderRadius: 14, boxShadow: 'var(--sh-lg)', padding: 8, zIndex: 50,
              maxHeight: 360, overflowY: 'auto'
            }}>
              <div style={{ padding: '6px 8px 10px', borderBottom: '1px solid var(--line)', marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: '.85rem' }}>Notifications</div>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '20px 8px', textAlign: 'center', color: 'var(--ink-3)', fontSize: '.8rem' }}>No new notifications</div>
              ) : (
                notifications.map((n) => {
                  const NIcon = notifIcons[n.icon] || Bell
                  return (
                    <div key={n.id} style={{ display: 'flex', gap: 10, padding: '8px 8px', borderRadius: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', flex: 'none', color: 'var(--primary)' }}>
                        <NIcon size={14} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '.8rem', lineHeight: 1.3 }}>{n.title}</div>
                        <div style={{ fontSize: '.72rem', color: 'var(--ink-3)', lineHeight: 1.3 }}>{n.desc}</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
        <IconBtn onClick={toggle} title={`${theme === 'light' ? 'Switch to dark' : 'Switch to light'} theme`}>{themeIcons[theme] || <Moon size={16} />}</IconBtn>

        <div style={{ position: 'relative' }} ref={popRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="User menu" aria-haspopup="true" aria-expanded={menuOpen}
            style={{ width: 34, height: 34, borderRadius: 9, border: 'none', background: user?.avatar?.startsWith?.('http') ? 'transparent' : 'linear-gradient(135deg,#6D4CFF,#8B5CF6)', color: '#fff', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(109,76,255,0.3)', transition: 'all .2s', overflow: 'hidden', padding: 0 }}>
            {user?.avatar?.startsWith?.('http') ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.avatar || 'U')}
          </button>
          {menuOpen && (
            <div role="menu" style={{
              position: 'absolute', right: 0, top: 44, width: 200,
              background: 'var(--surface)',
              border: '1px solid var(--line)', borderRadius: 14, boxShadow: 'var(--sh-lg)', padding: 6, zIndex: 50
            }}>
              <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--line)', marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: '.85rem' }}>{user?.name}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--ink-3)' }}>{user?.email || 'Guest session'}</div>
              </div>
              <MenuItem icon={<Download size={14} />} onClick={doExport}>Export progress</MenuItem>
              <MenuItem icon={<Upload size={14} />} onClick={() => fileRef.current?.click()}>Import progress</MenuItem>
              <MenuItem icon={<LogOut size={14} />} onClick={logout} danger>Sign out</MenuItem>
              <input ref={fileRef} type="file" accept="application/json" onChange={doImport} style={{ display: 'none' }} />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function Chip({ icon, children, hideSm, color, bg }) {
  return (
    <div className={hideSm ? 'hide-mobile' : ''}
      style={{
        display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 999,
        background: bg || 'var(--surface-2)', fontWeight: 600, fontSize: '.78rem',
        color: color || 'var(--ink-2)',
        transition: 'all .15s', whiteSpace: 'nowrap'
      }}>
      {icon} {children}
    </div>
  )
}

function IconBtn({ children, onClick, title }) {
  return (
    <button onClick={onClick} title={title} aria-label={title}
      style={{
        width: 34, height: 34, borderRadius: 9, border: 'none', background: 'transparent',
        display: 'grid', placeItems: 'center', color: 'var(--ink-2)', cursor: 'pointer', transition: 'all .15s'
      }}>
      {children}
    </button>
  )
}

function MenuItem({ icon, children, onClick, danger }) {
  return (
    <button onClick={onClick} role="menuitem"
      style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', border: 'none', background: 'transparent', color: danger ? 'var(--bad)' : 'var(--ink-2)', fontSize: '.84rem', fontWeight: 600, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', transition: 'all .15s' }}>
      {icon} {children}
    </button>
  )
}
