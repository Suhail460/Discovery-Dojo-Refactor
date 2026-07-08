import { motion } from 'framer-motion'
import { Play, Mic, Zap, CheckCircle2, Flame, Award, Lock, Check, Signal, BookOpen } from 'lucide-react'
import { CURRICULUM } from '../data/curriculum.js'
import { BADGES } from '../data/gamedata.js'
import { useStore } from '../hooks/useStore.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigation } from '../hooks/useNavigation.js'
import { useToast } from '../context/ToastContext.jsx'

const DIFF = ['', 'Beginner', 'Intermediate', 'Advanced']

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
      {/* Hero */}
      <div style={{ borderRadius: 30, padding: 'clamp(28px,5vw,52px)', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--plum) 0%, var(--accent) 120%)', color: '#fff', marginBottom: 32, boxShadow: 'var(--sh-lg)' }}>
        <div style={{ position: 'absolute', right: -80, top: -80, width: 340, height: 340, borderRadius: '50%', background: 'oklch(1 0 0 / 0.10)' }} />
        <div style={{ position: 'relative', maxWidth: 640 }}>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#fff', fontSize: 'clamp(2rem,5vw,3.1rem)', marginBottom: 12 }}>
            {first ? 'Master Product Discovery, for real.' : `Welcome back, ${user?.name?.split(' ')[0] || 'friend'}.`}
          </motion.h1>
          <p style={{ fontSize: '1.14rem', color: 'oklch(1 0 0 / 0.9)', fontFamily: '"Newsreader", Georgia, serif', marginBottom: 24 }}>
            {first ? "Fifteen levels, a live interview simulator, endless scenarios, and an AI coach. Learn to decide what to build, by building the skill." : `You're ${masteryPct()}% of the way to mastery with a ${state.streak || 0}-day streak. Next up: Level ${mu}, ${nextName}.`}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: '#fff', color: 'var(--accent-ink)' }} onClick={() => nav.openLevel(mu)}><Play size={17} /> {first ? 'Start Level 1' : 'Continue Level ' + mu}</button>
            <button className="btn btn-ghost" style={{ borderColor: 'oklch(1 0 0 / 0.45)', color: '#fff' }} onClick={() => nav.go('interview')}><Mic size={17} /> Try the interview sim</button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16, marginBottom: 32 }}>
        <Metric icon={<Zap size={15} />} k="Total XP" v={state.xp} s="Earn XP for screens and quizzes" color="var(--plum)" />
        <Metric icon={<CheckCircle2 size={15} />} k="Levels done" v={`${doneLevels}/15`} s={`${masteryPct()}% overall mastery`} color="var(--ok)" />
        <Metric icon={<Flame size={15} />} k="Day streak" v={state.streak || 0} s="Do one screen a day to grow it" color="var(--accent)" />
        <Metric icon={<Award size={15} />} k="Badges" v={`${state.badges.length}/${BADGES.length}`} s={`${state.interviews.length} interviews · ${state.quizWins} quizzes aced`} color="var(--gold-ink)" />
      </div>

      {/* Path */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Your learning path</h2>
      <p style={{ color: 'var(--ink-3)', marginBottom: 24 }}>Levels unlock in order. Each screen carries a lesson, a diagram, an exercise, a quiz, and a reflection.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {CURRICULUM.map((l) => {
          const unlocked = isUnlocked(l.id), done = levelDone(l.id), current = l.id === mu && !done
          const pct = Math.round((levelDoneCount(l.id) / levelScreens(l.id)) * 100)
          return (
            <div key={l.id} onClick={() => unlocked && nav.openLevel(l.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 22, background: 'var(--surface)', border: '1px solid var(--line)', opacity: unlocked ? 1 : .55, cursor: unlocked ? 'pointer' : 'default', transition: 'all .2s' }}
              onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.borderColor = 'var(--plum-2)'; e.currentTarget.style.transform = 'translateX(4px)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'none' }}>
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
                    <div style={{ width: 110, height: 6, background: 'var(--line-soft)', borderRadius: 6, marginTop: 6, overflow: 'hidden' }}><div style={{ height: '100%', width: pct + '%', background: 'var(--plum-2)', borderRadius: 6 }} /></div></>
                  : <Lock size={20} color="var(--ink-3)" />}
              </div>
            </div>
          )
        })}
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
