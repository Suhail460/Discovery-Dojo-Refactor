import { motion } from 'framer-motion'
import { Play, Mic, Zap, CheckCircle2, Flame, Award, Lock, Check, Signal, BookOpen, Dices, Swords, ArrowRight } from 'lucide-react'
import { CURRICULUM } from '../data/curriculum.js'
import { BADGES } from '../data/gamedata.js'
import { useStore } from '../hooks/useStore.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import SEO from '../components/common/SEO.jsx'
import { useNavigation } from '../hooks/useNavigation.js'
import { useToast } from '../context/ToastContext.jsx'

const DIFF = ['', 'Beginner', 'Intermediate', 'Advanced']

const QUICK_ACTIONS = [
  { icon: Mic, label: 'Interview Sim', desc: 'Practice customer interviews', action: 'interview' },
  { icon: Dices, label: 'Generator', desc: 'Random discovery scenarios', action: 'generator' },
  { icon: Swords, label: 'Challenges', desc: 'Quick-fire skill drills', action: 'challenges' },
  { icon: Award, label: 'Badges', desc: 'Track your milestones', action: 'badges' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const itemAnim = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

export default function Dashboard() {
  const { toast } = useToast()
  const nav = useNavigation(toast)
  const { state, masteryPct, levelDone, levelDoneCount, levelScreens, isUnlocked, maxUnlocked } = useStore()
  const { user } = useAuth()
  const mu = maxUnlocked()
  const doneLevels = CURRICULUM.filter((l) => levelDone(l.id)).length
  const first = state.completed.length === 0
  const nextName = CURRICULUM.find((l) => l.id === mu)?.title

  return (
    <div className="fade-in" style={{ maxWidth: 1180, margin: '0 auto' }}>
      <SEO title="Dashboard" description="Track your product discovery learning progress, XP, streak, and badges." />
      <div style={{ borderRadius: 30, padding: 'clamp(28px,5vw,52px)', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--plum) 0%, var(--accent) 120%)', color: '#fff', marginBottom: 32, boxShadow: 'var(--sh-lg)' }}
        role="banner" aria-label="Welcome banner">
        <div style={{ position: 'absolute', right: -80, top: -80, width: 340, height: 340, borderRadius: '50%', background: 'oklch(1 0 0 / 0.10)' }} />
        <div style={{ position: 'absolute', right: -40, bottom: -40, width: 200, height: 200, borderRadius: '50%', background: 'oklch(1 0 0 / 0.06)' }} />
        <div style={{ position: 'relative', maxWidth: 640 }}>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#fff', fontSize: 'clamp(2rem,5vw,3.1rem)', marginBottom: 12 }}>
            {first ? 'Master Product Discovery, for real.' : `Welcome back, ${user?.name?.split(' ')[0] || 'friend'}.`}
          </motion.h1>
          <p style={{ fontSize: '1.14rem', color: 'oklch(1 0 0 / 0.9)', fontFamily: '"Newsreader", Georgia, serif', marginBottom: 24 }}>
            {first ? "Fifteen levels, a live interview simulator, endless scenarios, and an AI coach. Learn to decide what to build, by building the skill." : `You're ${masteryPct()}% of the way to mastery with a ${state.streak || 0}-day streak. Next up: Level ${mu}, ${nextName}.`}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: '#fff', color: 'var(--accent-ink)' }} onClick={() => nav.openLevel(mu)} aria-label={first ? 'Start Level 1' : `Continue Level ${mu}`}><Play size={17} /> {first ? 'Start Level 1' : 'Continue Level ' + mu}</button>
            <button className="btn btn-ghost" style={{ borderColor: 'oklch(1 0 0 / 0.45)', color: '#fff' }} onClick={() => nav.go('interview')} aria-label="Try the interview simulator"><Mic size={17} /> Try the interview sim</button>
          </div>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16, marginBottom: 32 }}>
        <motion.div variants={itemAnim}><Metric icon={<Zap size={15} />} k="Total XP" v={state.xp} s="Earn XP for screens and quizzes" color="var(--plum)" /></motion.div>
        <motion.div variants={itemAnim}><Metric icon={<CheckCircle2 size={15} />} k="Levels done" v={`${doneLevels}/15`} s={`${masteryPct()}% overall mastery`} color="var(--ok)" /></motion.div>
        <motion.div variants={itemAnim}><Metric icon={<Flame size={15} />} k="Day streak" v={state.streak || 0} s="Do one screen a day to grow it" color="var(--accent)" /></motion.div>
        <motion.div variants={itemAnim}><Metric icon={<Award size={15} />} k="Badges" v={`${state.badges.length}/${BADGES.length}`} s={`${state.interviews.length} interviews · ${state.quizWins} quizzes aced`} color="var(--gold-ink)" /></motion.div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Your learning path</h2>
          <p style={{ color: 'var(--ink-3)', marginBottom: 24 }}>Levels unlock in order. Each screen carries a lesson, a diagram, an exercise, a quiz, and a reflection.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }} role="list" aria-label="Curriculum levels">
            {CURRICULUM.map((l, idx) => {
              const unlocked = isUnlocked(l.id), done = levelDone(l.id), current = l.id === mu && !done
              const pct = Math.round((levelDoneCount(l.id) / levelScreens(l.id)) * 100)
              return (
                <motion.div key={l.id} variants={itemAnim} initial="hidden" animate="show" transition={{ delay: idx * 0.03 }}
                  onClick={() => unlocked && nav.openLevel(l.id)} role="listitem"
                  aria-label={`Level ${l.id}: ${l.title}${done ? ' Completed' : unlocked ? ` ${pct}% done` : ' Locked'}`}
                  tabIndex={unlocked ? 0 : -1} onKeyDown={(e) => e.key === 'Enter' && unlocked && nav.openLevel(l.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 22, background: 'var(--surface)', border: '1px solid var(--line)', opacity: unlocked ? 1 : 0.55, cursor: unlocked ? 'pointer' : 'default', transition: 'all 0.2s var(--ease-out)' }}
                  onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.borderColor = 'var(--plum-2)'; e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = 'var(--sh-md)' } }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, flex: 'none', display: 'grid', placeItems: 'center', fontSize: '1.4rem', background: done ? 'var(--ok)' : current ? 'linear-gradient(145deg,var(--plum),var(--accent))' : 'var(--surface-3)', color: done || current ? '#fff' : 'var(--ink-2)', border: done || current ? 'none' : '1px solid var(--line)' }}>
                    {done ? <Check size={22} /> : l.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '1.06rem', marginBottom: 3 }}>Level {l.id}: {l.title}</h4>
                    <p style={{ margin: 0, fontSize: '.86rem', color: 'var(--ink-3)' }}>{l.subtitle}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      <span className={'pill pill-d' + l.diff}><Signal size={13} /> {DIFF[l.diff]}</span>
                      <span className="pill pill-time"><BookOpen size={13} /> {l.screens.length} screens</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flex: 'none' }}>
                    {unlocked
                      ? <><div style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: '.9rem', color: 'var(--plum)' }}>{pct}%</div>
                        <div style={{ width: 110, height: 6, background: 'var(--line-soft)', borderRadius: 6, marginTop: 6, overflow: 'hidden' }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Level ${l.id} progress`}><div style={{ height: '100%', width: pct + '%', background: 'var(--plum-2)', borderRadius: 6, transition: 'width 0.5s var(--ease-out)' }} /></div></>
                      : <Lock size={20} color="var(--ink-3)" aria-label="Locked" />}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <aside aria-label="Quick actions">
          <h3 style={{ fontSize: '1.06rem', marginBottom: 16 }}>Quick actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {QUICK_ACTIONS.map((qa) => (
              <button key={qa.action} onClick={() => nav.go(qa.action)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left', border: '1px solid var(--line)', background: 'var(--surface)', padding: '14px 16px', borderRadius: 18, cursor: 'pointer', transition: 'all 0.2s var(--ease-out)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--plum-2)'; e.currentTarget.style.boxShadow = 'var(--sh-md)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--plum-wash)', display: 'grid', placeItems: 'center', color: 'var(--plum)', flex: 'none' }}><qa.icon size={20} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--ink)' }}>{qa.label}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--ink-3)' }}>{qa.desc}</div>
                </div>
                <ArrowRight size={16} color="var(--ink-3)" style={{ flex: 'none' }} />
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 20, borderRadius: 18, background: 'var(--gold-wash)', border: '1px solid var(--gold)' }}>
            <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: 4 }}>Pro tip</div>
            <p style={{ margin: 0, fontSize: '.82rem', color: 'var(--ink-2)' }}>Complete all levels and the capstone to earn the Practitioner badge — proof you can run a full discovery from end to end.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Metric({ icon, k, v, s, color }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ fontSize: '.74rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>{icon} {k}</div>
      <div className="tnum" style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: '2.3rem', lineHeight: 1, margin: '12px 0 4px', color }}>{v}</div>
      <div style={{ fontSize: '.84rem', color: 'var(--ink-3)' }}>{s}</div>
    </div>
  )
}
