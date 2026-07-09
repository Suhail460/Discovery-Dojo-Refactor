import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Play, Mic, Zap, CheckCircle2, Award, Lock, Check, Signal, BookOpen, Dices, Swords, ArrowRight, Sparkles, TrendingUp, Target, Clock, Star, Flag, BarChart3, Edit3 } from 'lucide-react'
import { CURRICULUM } from '../data/curriculum.js'
import { BADGES } from '../data/gamedata.js'
import { useStore } from '../hooks/useStore.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import SEO from '../components/common/SEO.jsx'
import { useNavigation } from '../hooks/useNavigation.js'
import { useToast } from '../context/ToastContext.jsx'
import UpgradeModal from '../components/common/UpgradeModal.jsx'

const DIFF = ['', 'Beginner', 'Intermediate', 'Advanced']

function AnimatedNumber({ value, style }) {
  const spring = useSpring(0, { stiffness: 60, damping: 18 })
  const display = useTransform(spring, (v) => Math.round(v))
  useEffect(() => { spring.set(value) }, [value, spring])
  return <motion.span style={style}>{display}</motion.span>
}

export default function Dashboard() {
  const { toast } = useToast()
  const nav = useNavigation(toast)
  const { state, masteryPct, levelDone, levelDoneCount, levelScreens, isUnlocked, maxUnlocked } = useStore()
  const { user } = useAuth()
  const mu = maxUnlocked()
  const doneLevels = CURRICULUM.filter((l) => levelDone(l.id)).length
  const first = state.completed.length === 0
  const nextLevel = CURRICULUM.find((l) => !levelDone(l.id) && isUnlocked(l.id))
  const streakVal = state.streak || 0

  const QUICK = [
    { icon: Mic, label: 'Interview Sim', desc: 'Practice with personas', action: 'interview' },
    { icon: Dices, label: 'Generator', desc: 'Random scenarios', action: 'generator' },
    { icon: Swords, label: 'Challenges', desc: 'Quick drills', action: 'challenges' },
  ]

  const stats = [
    { icon: <Zap size={19} />, value: state.xp, label: 'Total XP', color: 'var(--primary)', bg: 'var(--primary-wash)', progress: Math.min(state.xp / 500, 1), delta: `+${Math.round(state.xp * 0.1)}` },
    { icon: <CheckCircle2 size={19} />, value: doneLevels, label: 'Levels done', color: 'var(--green)', bg: 'var(--green-wash)', progress: doneLevels / 15, suffix: '/15', delta: `+${Math.max(doneLevels - 1, 0)}` },
    { icon: <Award size={19} />, value: state.badges.length, label: 'Badges', color: 'var(--blue)', bg: 'var(--blue-wash)', progress: state.badges.length / BADGES.length, suffix: `/${BADGES.length}`, delta: `+${Math.max(state.badges.length - 1, 0)}` },
    { icon: <TrendingUp size={19} />, value: masteryPct(), label: 'Mastery', color: 'var(--amber)', bg: 'var(--amber-wash)', progress: masteryPct() / 100, suffix: '%', delta: `+${Math.max(Math.round(masteryPct() * 0.12), 1)}%` },
  ]

  const isGuest = user?.provider === 'guest'
  const [showUpgrade, setShowUpgrade] = useState(false)

  return (
    <div className="dash">
      <SEO title="Dashboard" description="Your product discovery learning hub." />

      {isGuest && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20, padding: '16px 20px', borderRadius: 16, background: 'linear-gradient(135deg,var(--primary-wash),var(--blue-wash))', border: '1px solid color-mix(in srgb, var(--primary) 30%, var(--line))', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary)', display: 'grid', placeItems: 'center', color: '#fff', flex: 'none' }}><Sparkles size={20} /></div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: 2 }}>{`You're`} exploring as a guest</div>
            <div style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.4 }}>Unlock AI Coach, Challenges, Badges, Capstone, and all 15 levels by creating a free account.</div>
          </div>
          <button className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '.85rem', flex: 'none' }} onClick={() => setShowUpgrade(true)}>
            Create free account <ArrowRight size={15} />
          </button>
        </motion.div>
      )}

      {/* ═══════ HERO ROW ═══════ */}
      <div className="dash-hero-row">
        {/* ─── HERO (70%) ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="dash-hero">
          <div className="dash-hero-bg">
            <div className="dash-hero-blur dash-hero-blur-1" />
            <div className="dash-hero-blur dash-hero-blur-2" />
            <div className="dash-hero-blur dash-hero-blur-3" />
            <div className="dash-hero-blur dash-hero-blur-4" />
            <div className="dash-hero-blur dash-hero-blur-5" />
            {/* Sparkle accents */}
            {[20,65,85].map((p) => (
              <div key={p} style={{
                position: 'absolute', width: 4, height: 4, borderRadius: '50%',
                background: 'color-mix(in srgb, var(--primary) 30%, transparent)', top: `${p%3*30+8}%`, left: `${p}%`,
                filter: 'blur(1px)',
              }} />
            ))}
          </div>
          <div className="dash-hero-left">
            <div className="dash-hero-greeting">
              {first ? 'Welcome to the Dojo \u2728' : `Welcome back, ${user?.name?.split(' ')[0] || 'friend'} \uD83D\uDC4B`}
            </div>
            <p className="dash-hero-sub">
              {first
                ? 'Master product discovery through hands-on levels, live interview simulations, and AI coaching.'
                : `${doneLevels} levels mastered \u00B7 ${masteryPct()}% complete \u00B7 ${state.interviews.length} interviews`}
            </p>
            <div className="dash-hero-chips">
              <div className="dash-chip dash-chip-xp">
                <Zap size={13} /> <AnimatedNumber value={state.xp} /> XP today
              </div>
              <div className="dash-chip dash-chip-green">
                <TrendingUp size={13} /> +{Math.round(masteryPct() * 0.15) || 1}% this week
              </div>
              {streakVal >= 2 && (
                <div className="dash-chip dash-chip-amber">
                  <Flame size={13} /> {streakVal} day streak
                </div>
              )}
            </div>
            <div className="dash-hero-actions">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem', minHeight: 50 }}
                onClick={() => nav.openLevel(mu)}>
                <Play size={18} /> {first ? 'Begin your journey' : 'Continue learning'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="btn btn-secondary" onClick={() => nav.go('interview')}>
                <Mic size={16} /> Practice interview
              </motion.button>
            </div>
          </div>
          <div className="dash-hero-right">
            {/* 3D-style illustration with floating cards */}
            <motion.div animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="dash-hero-float dash-hero-float-1"
              style={{ filter: 'drop-shadow(0 8px 24px color-mix(in srgb, var(--primary) 30%, transparent))' }}>
              <FloatingCard icon={<Target size={18} />} value={`${masteryPct()}%`} label="Mastery" color="var(--primary)" bg="var(--primary-wash)" />
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="dash-hero-float dash-hero-float-2"
              style={{ filter: 'drop-shadow(0 8px 24px color-mix(in srgb, var(--amber) 30%, transparent))' }}>
              <FloatingCard icon={<Flame size={18} />} value={`${streakVal}`} label="Day streak" color="var(--amber)" bg="var(--amber-wash)" />
            </motion.div>
            <motion.div animate={{ y: [0, -6, 0], rotate: [0, -1, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="dash-hero-float dash-hero-float-3"
              style={{ filter: 'drop-shadow(0 8px 24px color-mix(in srgb, var(--green) 30%, transparent))' }}>
              <FloatingCard icon={<Award size={18} />} value={`${state.xp}`} label="Total XP" color="var(--green)" bg="var(--green-wash)" />
            </motion.div>
          </div>
        </motion.div>

        {/* ─── DAILY GOAL (30%) ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <DailyGoalCard state={state} masteryPct={masteryPct()} streakVal={streakVal} />
        </motion.div>
      </div>

      {/* ═══════ STATS ROW ═══════ */}
      <motion.div className="dash-stats-row" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
        {stats.map((s, i) => (
          <motion.div key={i} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
            <div className="dash-stat">
              <div className="dash-stat-row">
                <div className="dash-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div className="dash-stat-body">
                  <div className="dash-stat-top">
                    <AnimatedNumber value={s.value} style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }} />
                    {s.suffix && <span className="dash-stat-suffix" style={{ color: s.color }}>{s.suffix}</span>}
                  </div>
                  <div className="dash-stat-label">{s.label}</div>
                </div>
              </div>
              <div className="dash-stat-bottom">
                <div className="progress-track" style={{ flex: 1, height: 4, borderRadius: 2 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.progress * 100}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                    className="progress-fill" style={{ background: s.color, borderRadius: 2 }} />
                </div>
                <span className="dash-stat-delta" style={{ color: 'var(--ok)' }}>{s.delta} this week</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══════ MAIN CONTENT + RIGHT COLUMN ═══════ */}
      <div className="dash-content">
        {/* ─── MAIN (70%) ─── */}
        <div className="dash-main">
          {/* CONTINUE LEARNING */}
          {nextLevel && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.45 }}>
              <div className="dash-section-title"><Play size={15} /> Continue learning</div>
              <div className="card dash-continue-card" onClick={() => nav.openLevel(nextLevel.id)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && nav.openLevel(nextLevel.id)} role="button" aria-label={`Continue Level ${nextLevel.id}: ${nextLevel.title}`}>
                <div className="dash-continue-left">
                  <div className="dash-continue-icon">{nextLevel.emoji}</div>
                  <div className="dash-continue-body">
                    <h3 className="dash-continue-title">Level {nextLevel.id}: {nextLevel.title}</h3>
                    <p className="dash-continue-sub">{nextLevel.subtitle}</p>
                    <div className="dash-continue-meta">
                      <span className={`pill pill-${nextLevel.diff === 1 ? 'easy' : nextLevel.diff === 2 ? 'medium' : 'hard'}`}>
                        <Signal size={10} /> {DIFF[nextLevel.diff]}
                      </span>
                      <span className="pill pill-time"><BookOpen size={10} /> {nextLevel.screens.length} lessons</span>
                      <span className="pill pill-time"><Clock size={10} /> ~{nextLevel.screens.length * 8} min</span>
                      <span className="pill pill-level"><Star size={10} /> +{nextLevel.screens.length * 15} XP</span>
                    </div>
                    <div className="dash-continue-bar-row">
                      <div className="progress-track" style={{ flex: 1, height: 6, borderRadius: 3 }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(levelDoneCount(nextLevel.id) / levelScreens(nextLevel.id)) * 100}%` }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                          className="progress-fill" style={{ borderRadius: 3 }} />
                      </div>
                      <div className="dash-continue-pct">
                        <span>{Math.round((levelDoneCount(nextLevel.id) / levelScreens(nextLevel.id)) * 100)}%</span>
                        <small>Next: screen {levelDoneCount(nextLevel.id) + 1} of {levelScreens(nextLevel.id)}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dash-continue-right">
                  <CircularProgress value={levelDoneCount(nextLevel.id)} max={levelScreens(nextLevel.id)} size={80} stroke={6} />
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="btn btn-primary dash-continue-btn"
                    onClick={(e) => { e.stopPropagation(); nav.openLevel(nextLevel.id) }}>
                    <Play size={16} /> Continue
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* LEARNING PATH */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.45 }}>
            <div className="dash-section-title"><Target size={15} /> Learning path</div>
            <div className="dash-timeline" role="list">
              {CURRICULUM.map((l, idx) => {
                const unlocked = isUnlocked(l.id), done = levelDone(l.id), current = l.id === mu && !done
                const pct = Math.round((levelDoneCount(l.id) / levelScreens(l.id)) * 100)
                const alt = idx % 2 !== 0
                return (
                  <div key={l.id} className="dash-timeline-item" role="listitem">
                    <div className="dash-timeline-connector">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + idx * 0.04, type: 'spring' }}
                        className={`dash-timeline-dot ${done ? 'done' : current ? 'active' : ''}`}>
                        {done ? <Check size={12} /> : l.id}
                      </motion.div>
                      {idx < CURRICULUM.length - 1 && <div className="dash-timeline-line" />}
                    </div>
                    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + idx * 0.04, duration: 0.35 }}
                      onClick={() => unlocked && nav.openLevel(l.id)}
                      className={`card card-clickable dash-timeline-card ${done ? 'done' : current ? 'current' : ''} ${alt ? 'alt' : ''}`}
                      tabIndex={unlocked ? 0 : -1}
                      onKeyDown={(e) => e.key === 'Enter' && unlocked && nav.openLevel(l.id)}>
                      <div className="dash-timeline-left">
                        <span className="dash-timeline-emoji">{l.emoji}</span>
                        <div className="dash-timeline-info">
                          <div className="dash-timeline-title">
                            Level {l.id}: {l.title}
                            {done && <span className="pill pill-done" style={{ marginLeft: 8, fontSize: '.55rem', padding: '1px 6px' }}>Mastered</span>}
                          </div>
                          <div className="dash-timeline-meta">
                            <span className={`pill pill-${l.diff === 1 ? 'easy' : l.diff === 2 ? 'medium' : 'hard'}`}>
                              <Signal size={8} /> {DIFF[l.diff]}
                            </span>
                            <span className="pill pill-time"><BookOpen size={8} /> {l.screens.length}</span>
                            <span className="pill pill-time"><Clock size={8} /> ~{l.screens.length * 8}m</span>
                          </div>
                        </div>
                      </div>
                      <div className="dash-timeline-right">
                        {unlocked ? (
                          <>
                            <div className="progress-track" style={{ width: 80, height: 5, borderRadius: 3 }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: pct + '%' }}
                                transition={{ duration: 0.8, delay: 0.4 + idx * 0.04 }}
                                className="progress-fill" style={{ borderRadius: 3, background: done ? 'var(--ok)' : 'var(--primary)' }} />
                            </div>
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                              className={`btn ${done ? 'btn-ghost' : current || pct > 0 ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ padding: '6px 14px', fontSize: '.74rem', minHeight: 30, marginTop: 4 }}
                              onClick={(e) => { e.stopPropagation(); unlocked && nav.openLevel(l.id) }}>
                              {done ? 'Review' : pct > 0 ? 'Continue' : 'Start'}
                            </motion.button>
                          </>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <Lock size={14} color="var(--ink-3)" />
                            <span style={{ fontSize: '.6rem', color: 'var(--ink-3)', fontWeight: 600 }}>Locked</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT COLUMN (30%) — ONLY Quick Actions + Weekly Progress ─── */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.45 }} className="dash-sidebar">
          {/* QUICK ACTIONS */}
          <div>
            <div className="dash-sidebar-title"><Sparkles size={12} /> Quick actions</div>
            <div className="dash-qa-list">
              {QUICK.map((qa) => (
                <motion.button key={qa.action} whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}
                  onClick={() => nav.go(qa.action)} className="dash-qa-btn">
                  <div className="dash-qa-icon"><qa.icon size={15} /></div>
                  <div className="dash-qa-text">
                    <div className="dash-qa-label">{qa.label}</div>
                    <div className="dash-qa-desc">{qa.desc}</div>
                  </div>
                  <ArrowRight size={13} color="var(--ink-3)" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* WEEKLY PROGRESS */}
          <div>
            <div className="dash-sidebar-title"><BarChart3 size={12} /> Weekly progress</div>
            <div className="card dash-weekly-card">
              <div className="dash-weekly-bars">
                {['M','T','W','Th','F','Sa','Su'].map((d, i) => {
                  const active = i < Math.min(streakVal, 7)
                  const h = [55, 35, 75, 45, 85, 25, 15]
                  return (
                    <div key={d} className="dash-weekly-col">
                      <motion.div initial={{ height: 0 }} animate={{ height: h[i] + '%' }}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.05 }}
                        className={`dash-weekly-bar ${active ? 'active' : ''}`} />
                      <span className="dash-weekly-lbl">{d}</span>
                    </div>
                  )
                })}
              </div>
              <div className="dash-weekly-note">{streakVal} day streak</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══════ RECOMMENDATIONS ═══════ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.45 }}>
        <div className="dash-section-title"><Star size={15} /> Recommended for you</div>
        <div className="dash-rec-grid">
          {[
            { emoji: CURRICULUM[mu - 1]?.emoji || '\uD83D\uDE80', title: 'Continue Level ' + mu, desc: CURRICULUM[mu - 1]?.title || 'Next lesson', action: () => nav.openLevel(mu) },
            { emoji: <Mic size={18} />, title: 'Practice interview', desc: `${state.interviews.length} completed`, action: () => nav.go('interview') },
            { emoji: <Dices size={18} />, title: 'New scenario', desc: 'Generate an exercise', action: () => nav.go('generator') },
            { emoji: <Swords size={18} />, title: 'Daily challenge', desc: 'Quick-fire drill', action: () => nav.go('challenges') },
            { emoji: <Award size={18} />, title: 'View badges', desc: 'Track achievements', action: () => nav.go('badges') },
            ...(state.capstone && Object.keys(state.capstone).length > 0 ? [{ emoji: <Flag size={18} />, title: 'Resume capstone', desc: 'Continue your project', action: () => nav.go('capstone') }] : []),
          ].map((r, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} className="card card-clickable dash-rec-card" onClick={r.action} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && r.action()} role="button" aria-label={r.title}>
              <div className="dash-rec-emoji">{r.emoji}</div>
              <div className="dash-rec-body">
                <div className="dash-rec-title">{r.title}</div>
                <div className="dash-rec-desc">{r.desc}</div>
              </div>
              <ArrowRight size={13} color="var(--primary)" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  )
}

function FloatingCard({ icon, value, label, color, bg }) {
  return (
    <div className="dash-float-badge">
      <div style={{
        width: 32, height: 32, borderRadius: 9, background: bg,
        display: 'grid', placeItems: 'center', color, flex: 'none'
      }}>{icon}</div>
      <div>
        <div className="tnum" style={{ fontWeight: 800, fontSize: '.84rem', lineHeight: 1.2, color: 'var(--ink)' }}>{value}</div>
        <div style={{ fontSize: '.6rem', color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.03em' }}>{label}</div>
      </div>
    </div>
  )
}

function DailyGoalCard({ state, masteryPct, streakVal }) {
  const doneToday = state.lastActive === new Date().toISOString().slice(0, 10)
  const screensDone = state.completed.length
  const target = Math.max(1, Math.ceil(streakVal / 3) + 1)
  const progress = Math.min(screensDone / target, 1)

  return (
    <div className="dash-goal">
      <div className="dash-goal-header">
        <span className="dash-goal-title">Daily goal</span>
        <button style={{
          border: 'none', background: 'var(--primary-wash)', color: 'var(--primary)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
          fontSize: '.7rem', fontWeight: 700, padding: '5px 10px', borderRadius: 8
        }}>
          <Edit3 size={11} /> Edit
        </button>
      </div>
      <div className="dash-goal-body">
        <CircularProgress value={screensDone} max={target} size={80} stroke={6} />
        <div style={{ textAlign: 'center' }}>
          <div className="heading" style={{ fontSize: doneToday ? '1.1rem' : '1rem', marginBottom: 2 }}>
            {doneToday ? 'Great work! \uD83C\uDF89' : `Complete ${target} screen${target > 1 ? 's' : ''}`}
          </div>
          <div style={{ fontSize: '.78rem', color: 'var(--ink-3)' }}>
            {doneToday ? 'Come back tomorrow.' : `${screensDone} / ${target} today`}
          </div>
          {!doneToday && (
            <div style={{ fontSize: '.72rem', color: 'var(--ink-3)', marginTop: 4 }}>
              <Star size={11} color="var(--amber)" style={{ verticalAlign: 'middle', marginRight: 3 }} />
              +{target * 15} XP if completed
            </div>
          )}
          {doneToday && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="pill pill-done" style={{ marginTop: 6, fontSize: '.65rem' }}>
              +{target * 15} XP earned
            </motion.div>
          )}
        </div>
      </div>
      <div className="dash-goal-bar">
        <div className="progress-track" style={{ height: 6, borderRadius: 3 }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="progress-fill" style={{ borderRadius: 3, background: 'var(--primary)' }} />
        </div>
      </div>
      <div className="dash-goal-footer">
        <span>{masteryPct}% mastery</span>
        <span>{streakVal} day streak</span>
      </div>
    </div>
  )
}

function CircularProgress({ value, max, size = 72, stroke = 6 }) {
  const pct = Math.min(value / max, 1)
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--primary)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span key={Math.round(pct * 100)} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="tnum" style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--primary)' }}>
          {Math.round(pct * 100)}%
        </motion.span>
      </div>
    </div>
  )
}

function Flame({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}
