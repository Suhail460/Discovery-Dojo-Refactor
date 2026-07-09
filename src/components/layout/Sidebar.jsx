import { useState } from 'react'
import { ChevronDown, LayoutDashboard, Mic, ClipboardList, Swords, Flag, Award, Lock, Check, X, ArrowRight, Rocket, Sparkles } from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum.js'
import { useStore } from '../../hooks/useStore.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import UpgradeModal from '../common/UpgradeModal.jsx'

const NAV = [
  { view: 'home', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'interview', label: 'Interview Simulator', icon: Mic },
  { view: 'generator', label: 'Exercise Generator', icon: ClipboardList },
  { view: 'challenges', label: 'Discovery Challenges', icon: Swords, premium: true },
  { view: 'capstone', label: 'Capstone Project', icon: Flag, premium: true },
  { view: 'badges', label: 'Skill Tree & Badges', icon: Award, premium: true },
]

export default function Sidebar({ nav, open, onClose, onReset: _onReset }) {
  const { view, level } = nav.current
  const { levelDone, isUnlocked, maxUnlocked } = useStore()
  const { user } = useAuth()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [pathOpen, setPathOpen] = useState(true)
  const mu = maxUnlocked()

  const isAvatarUrl = user?.avatar?.startsWith?.('http')
  const avatarLetter = isAvatarUrl ? '' : (user?.avatar || (user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U'))

  return (
    <>
      {open && <div onClick={onClose} className="sb-overlay" aria-hidden="true" />}
      <aside className={'sidebar' + (open ? ' open' : '')} role="dialog" aria-modal={open ? 'true' : undefined} aria-label="Navigation sidebar">
        {/* ═══ BRAND ═══ */}
        <div className="sb-brand">
          <div className="sb-brand-icon">
            <Rocket size={26} />
          </div>
          <div className="sb-brand-text">
            <div className="sb-brand-name">Discovery Dojo</div>
            <div className="sb-brand-sub">Product Discovery Mastery</div>
          </div>
          <button onClick={onClose} className="sb-close-btn" aria-label="Close sidebar">
            <X size={16} />
          </button>
        </div>

        {/* ═══ SCROLLABLE MIDDLE ═══ */}
        <div className="sb-scroll">
          {/* ─── PRACTICE ─── */}
          <div className="sb-section" role="group" aria-label="Practice modules">
            <div className="sb-section-header" id="sb-practice-heading">Practice</div>
            {NAV.map((n) => {
              const active = view === n.view
              const guestLocked = n.premium && user?.provider === 'guest'
              return (
                <button key={n.view}
                  onClick={() => { nav.go(n.view); onClose() }}
                  className={'sb-nav-item' + (active ? ' active' : '')}>
                  <span className="sb-nav-icon"><n.icon size={20} /></span>
                  <span style={{ flex: 1 }}>{n.label}</span>
                  {guestLocked && <Lock size={12} className="sb-lesson-lock" />}
                </button>
              )
            })}
          </div>

          {/* ─── LEARNING PATH ─── */}
          <div className="sb-section" role="group" aria-label="Learning path levels">
            <button className="sb-collapse-btn" onClick={() => setPathOpen(!pathOpen)} aria-expanded={pathOpen}>
              <span className="sb-section-header" style={{ margin: 0 }}>Learning Path</span>
              <ChevronDown size={14} style={{
                color: '#C4C8D0',
                transform: pathOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.3s'
              }} />
            </button>
            {pathOpen && (
              <div className="sb-lessons">
                {CURRICULUM.map((l) => {
                  const unlocked = isUnlocked(l.id), done = levelDone(l.id)
                  const active = view === 'level' && level === l.id
                  const isCurrent = l.id === mu && !done
                  return (
                    <button key={l.id} disabled={!unlocked}
                      onClick={() => { nav.openLevel(l.id); onClose() }}
                      className={'sb-lesson-item' + (active ? ' active' : '') + (isCurrent ? ' current-lesson' : '')}>
                      <span className={'sb-lesson-num' + (done ? ' done' : '') + (!unlocked ? ' locked' : '')}>
                        {done ? <Check size={12} /> : l.id}
                      </span>
                      <span className="sb-lesson-info">
                        <span className={'sb-lesson-title' + (done ? ' done' : '') + (!unlocked ? ' locked' : '')}>
                          {l.title}
                        </span>
                      </span>
                      {!unlocked && <Lock size={12} className="sb-lesson-lock" />}
                    </button>
                  )
                })}
                <button className="sb-view-all" onClick={() => nav.go('home')}>
                  View all levels <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* ─── GO PRO ─── */}
          <div className="sb-go-pro">
            <div className="sb-go-pro-icon"><Sparkles size={22} /></div>
            <div className="sb-go-pro-badge">Pro</div>
            <div className="sb-go-pro-title">Unlock Pro</div>
            <div className="sb-go-pro-sub">
              AI Coach &middot; Interview Packs &middot; Certificates
            </div>
            <button className="sb-go-pro-btn" onClick={() => setShowUpgrade(true)}>
              Upgrade Now <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* ═══ PROFILE ═══ */}
        <div className="sb-profile" onClick={() => {}}>
          <div className="sb-profile-avatar" style={isAvatarUrl ? { overflow: 'hidden', padding: 0 } : {}}>
            {isAvatarUrl ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : avatarLetter}
          </div>
          <div className="sb-profile-info">
            <div className="sb-profile-name">{user?.name || 'Guest'}</div>
            <div className="sb-profile-role">Product Discovery</div>
          </div>
          <ChevronDown size={16} className="sb-profile-arrow" />
        </div>
        <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      </aside>
    </>
  )
}
