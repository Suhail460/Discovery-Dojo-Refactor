import { motion } from 'framer-motion'
import { Play, Mic, Zap, CheckCircle2, Award, Lock, Check, Signal, BookOpen, Dices, Swords, ArrowRight, Sparkles, TrendingUp, Target } from 'lucide-react'
import { CURRICULUM } from '../data/curriculum.js'
import { BADGES } from '../data/gamedata.js'
import { useStore } from '../hooks/useStore.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import SEO from '../components/common/SEO.jsx'
import { useNavigation } from '../hooks/useNavigation.js'
import { useToast } from '../context/ToastContext.jsx'
import { XpRing, StreakBadge, DailyQuest } from '../components/gamification/index.js'

const DIFF = ['', 'Beginner', 'Intermediate', 'Advanced']

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

export default function Dashboard() {
  const { toast } = useToast()
  const nav = useNavigation(toast)
  const { state, masteryPct, levelDone, levelDoneCount, levelScreens, isUnlocked, maxUnlocked } = useStore()
  const { user } = useAuth()
  const mu = maxUnlocked()
  const doneLevels = CURRICULUM.filter((l) => levelDone(l.id)).length
  const first = state.completed.length === 0

  const recentBadges = BADGES.filter((b) => state.badges.includes(b.id)).slice(-3)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 960, margin: '0 auto' }}>
      <SEO title="Dashboard" description="Track your product discovery learning progress, XP, streak, and badges." />

      {/* Hero section */}
      <motion.div variants={fadeUp} style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
        <XpRing xp={state.xp} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', marginBottom: 8 }}>
            {first ? 'Welcome to the Dojo' : `Hey ${user?.name?.split(' ')[0] || 'friend'}!`}
          </motion.h1>
          <p style={{ fontSize: '1rem', color: 'var(--ink-2)', fontFamily: '"Newsreader", Georgia, serif', marginBottom: 16, maxWidth: 560 }}>
            {first ? "Master product discovery through interactive levels, live simulations, and an AI coach. Start anywhere." : `You're ${masteryPct()}% through the curriculum. ${doneLevels} levels done, ${state.interviews.length} interviews completed.`}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => nav.openLevel(mu)}><Play size={17} /> {first ? 'Start your journey' : 'Continue learning'}</button>
            <button className="btn btn-ghost" onClick={() => nav.go('interview')}><Mic size={17} /> Practice interview</button>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
        <StreakBadge streak={state.streak || 0} />
        <div className="card" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={18} color="var(--plum)" />
          <div><div className="tnum" style={{ fontWeight: 800, fontSize: '1rem', fontFamily: '"Bricolage Grotesque"' }}>{state.xp} XP</div><div style={{ fontSize: '.64rem', color: 'var(--ink-3)', fontWeight: 600 }}>Total earned</div></div>
        </div>
        <div className="card" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={18} color="var(--ok)" />
          <div><div className="tnum" style={{ fontWeight: 800, fontSize: '1rem', fontFamily: '"Bricolage Grotesque"' }}>{doneLevels}/15</div><div style={{ fontSize: '.64rem', color: 'var(--ink-3)', fontWeight: 600 }}>Levels completed</div></div>
        </div>
        <div className="card" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Award size={18} color="var(--gold-ink)" />
          <div><div className="tnum" style={{ fontWeight: 800, fontSize: '1rem', fontFamily: '"Bricolage Grotesque"' }}>{state.badges.length}/{BADGES.length}</div><div style={{ fontSize: '.64rem', color: 'var(--ink-3)', fontWeight: 600 }}>Badges earned</div></div>
        </div>
      </motion.div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, alignItems: 'start' }}>
        <div>
          {/* Continue learning */}
          <motion.div variants={fadeUp}>
            <SectionTitle icon={<Target size={16} />} title="Your learning path" subtitle="Levels unlock in order. Complete all screens in a level to advance." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }} role="list" aria-label="Curriculum levels">
              {CURRICULUM.map((l, idx) => {
                const unlocked = isUnlocked(l.id), done = levelDone(l.id), current = l.id === mu && !done
                const pct = Math.round((levelDoneCount(l.id) / levelScreens(l.id)) * 100)
                return (
                  <motion.div key={l.id} variants={fadeUp} transition={{ delay: idx * 0.02 }}
                    onClick={() => unlocked && nav.openLevel(l.id)} role="listitem"
                    aria-label={`Level ${l.id}: ${l.title}${done ? ' Completed' : unlocked ? ` ${pct}% done` : ' Locked'}`}
                    tabIndex={unlocked ? 0 : -1} onKeyDown={(e) => e.key === 'Enter' && unlocked && nav.openLevel(l.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 20, background: done ? 'var(--ok-wash)' : current ? 'var(--plum-wash)' : 'var(--surface)', border: '1px solid ' + (current ? 'var(--plum-2)' : 'var(--line)'), opacity: unlocked ? 1 : 0.5, cursor: unlocked ? 'pointer' : 'default', transition: 'all 0.2s var(--ease-out)' }}
                    onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.borderColor = 'var(--plum-2)'; e.currentTarget.style.boxShadow = 'var(--sh-md)' } }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = current ? 'var(--plum-2)' : 'var(--line)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, flex: 'none', display: 'grid', placeItems: 'center', fontSize: '1.2rem', background: done ? 'var(--ok)' : current ? 'var(--plum)' : 'var(--surface-3)', color: done || current ? '#fff' : 'var(--ink-2)' }}>
                      {done ? <Check size={20} /> : l.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '.95rem', marginBottom: 2 }}>Level {l.id}: {l.title}</h4>
                      <p style={{ margin: 0, fontSize: '.8rem', color: 'var(--ink-3)' }}>{l.subtitle}</p>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                        <span className={'pill pill-d' + l.diff}><Signal size={11} /> {DIFF[l.diff]}</span>
                        <span className="pill pill-time"><BookOpen size={11} /> {l.screens.length} screens</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flex: 'none' }}>
                      {unlocked
                        ? <><div className="tnum" style={{ fontWeight: 700, fontSize: '.85rem', color: done ? 'var(--ok)' : 'var(--plum)' }}>{done ? 'Done' : pct + '%'}</div>
                          <div style={{ width: 80, height: 5, background: 'var(--line-soft)', borderRadius: 5, marginTop: 6, overflow: 'hidden' }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div style={{ height: '100%', width: pct + '%', background: done ? 'var(--ok)' : 'var(--plum-2)', borderRadius: 5, transition: 'width 0.5s var(--ease-out)' }} /></div></>
                        : <Lock size={18} color="var(--ink-3)" />}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div variants={fadeUp}>
            <DailyQuest />
          </motion.div>

          <motion.div variants={fadeUp}>
            <SectionTitle icon={<Sparkles size={14} />} title="Quick actions" subtitle="" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: Mic, label: 'Interview Sim', desc: 'Practice with personas', action: 'interview' },
                { icon: Dices, label: 'Generator', desc: 'Random scenarios', action: 'generator' },
                { icon: Swords, label: 'Challenges', desc: 'Quick drills', action: 'challenges' },
              ].map((qa) => (
                <button key={qa.action} onClick={() => nav.go(qa.action)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', border: '1px solid var(--line)', background: 'var(--surface)', padding: '12px 14px', borderRadius: 16, cursor: 'pointer', transition: 'all 0.15s var(--ease-out)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--plum-2)'; e.currentTarget.style.boxShadow = 'var(--sh-md)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--plum-wash)', display: 'grid', placeItems: 'center', color: 'var(--plum)', flex: 'none' }}><qa.icon size={18} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '.85rem', color: 'var(--ink)' }}>{qa.label}</div>
                    <div style={{ fontSize: '.74rem', color: 'var(--ink-3)' }}>{qa.desc}</div>
                  </div>
                  <ArrowRight size={14} color="var(--ink-3)" style={{ flex: 'none' }} />
                </button>
              ))}
            </div>
          </motion.div>

          {recentBadges.length > 0 && (
            <motion.div variants={fadeUp}>
              <SectionTitle icon={<Award size={14} />} title="Recent badges" subtitle="" />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {recentBadges.map((b) => (
                  <div key={b.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                    <span style={{ fontSize: '1.5rem' }}>{b.em}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '.82rem' }}>{b.name}</div>
                      <div style={{ fontSize: '.7rem', color: 'var(--ink-3)' }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} style={{ padding: 18, borderRadius: 20, background: 'linear-gradient(135deg, var(--gold-wash) 0%, var(--surface) 100%)', border: '1px solid var(--gold)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <TrendingUp size={16} color="var(--gold-ink)" />
              <span style={{ fontWeight: 700, fontSize: '.82rem', color: 'var(--gold-ink)' }}>Pro tip</span>
            </div>
            <p style={{ margin: 0, fontSize: '.8rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
              The best discovery PMs spend 80% of their time on the problem, 20% on the solution. The interview simulator is where that muscle grows fastest.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <span style={{ color: 'var(--plum)' }}>{icon}</span>
      <h2 style={{ fontSize: '1.2rem' }}>{title}</h2>
      {subtitle && <span style={{ fontSize: '.78rem', color: 'var(--ink-3)', marginLeft: 4 }}>· {subtitle}</span>}
    </div>
  )
}
