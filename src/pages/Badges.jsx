import { Award, CheckCircle2, RotateCcw, ThumbsUp, AlertCircle } from 'lucide-react'
import { CURRICULUM } from '../data/curriculum.js'
import { BADGES } from '../data/gamedata.js'
import SEO from '../components/common/SEO.jsx'
import { useStore } from '../hooks/useStore.jsx'
import { useNavigation } from '../hooks/useNavigation.js'
import { useToast } from '../context/ToastContext.jsx'

export default function Badges() {
  const { toast } = useToast()
  const nav = useNavigation(toast)
  const { state, levelDone, levelDoneCount, levelScreens, isUnlocked } = useStore()
  const got = state.badges.length
  const weak = [...new Set(state.weak)], strong = [...new Set(state.strong)]

  return (
    <div className="fade-in" style={{ maxWidth: 1180, margin: '0 auto' }}>
      <SEO title="Skill Tree & Badges" description="Track your badges, strengths, and weak topics across all 15 levels of product discovery." />
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}><span className="pill pill-lvl"><Award size={13} /> Progress</span></div>
        <h1 style={{ fontSize: 'clamp(1.7rem,3.6vw,2.5rem)', marginBottom: 12 }}>Skill tree &amp; badges</h1>
        <p className="font-serif-q" style={{ fontSize: '1.12rem', color: 'var(--ink-2)', maxWidth: '68ch' }}>{got} of {BADGES.length} badges earned. Your weak spots feed back into what the coach nudges you toward.</p>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Skill tree</h2>
      <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>Each level is a skill. Filled means mastered, dim means still locked.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14, marginBottom: 40 }}>
        {CURRICULUM.map((l) => {
          const unlocked = isUnlocked(l.id), done = levelDone(l.id)
          const pct = Math.round((levelDoneCount(l.id) / levelScreens(l.id)) * 100)
          return (
            <div key={l.id} onClick={() => unlocked && nav.openLevel(l.id)} className="card" style={{ padding: 24, textAlign: 'center', opacity: unlocked ? 1 : .45, cursor: unlocked ? 'pointer' : 'default', position: 'relative' }}>
              {done && <span style={{ position: 'absolute', top: 10, right: 10, color: 'var(--ok)' }}><CheckCircle2 size={18} /></span>}
              <div style={{ fontSize: '2.4rem', lineHeight: 1, marginBottom: 10, filter: unlocked ? 'none' : 'grayscale(1)' }}>{l.emoji}</div>
              <h5 style={{ fontSize: '.92rem', marginBottom: 4 }}>{l.title}</h5>
              <p style={{ fontSize: '.76rem', color: 'var(--ink-3)', margin: 0 }}>{done ? 'Mastered' : unlocked ? pct + '% done' : 'Locked'}</p>
              {unlocked && !done && <div style={{ width: '100%', height: 6, background: 'var(--line-soft)', borderRadius: 6, marginTop: 8, overflow: 'hidden' }}><div style={{ height: '100%', width: pct + '%', background: 'var(--plum-2)' }} /></div>}
            </div>
          )
        })}
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Badges</h2>
      <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>Milestones across lessons, interviews, quizzes, and the capstone.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 16 }}>
        {BADGES.map((b) => {
          const has = state.badges.includes(b.id)
          return (
            <div key={b.id} className="card" style={{ padding: 24, textAlign: 'center', opacity: has ? 1 : .45, position: 'relative' }}>
              {has && <span style={{ position: 'absolute', top: 10, right: 10, color: 'var(--ok)' }}><CheckCircle2 size={18} /></span>}
              <div style={{ fontSize: '2.4rem', lineHeight: 1, marginBottom: 10, filter: has ? 'none' : 'grayscale(1)' }}>{b.em}</div>
              <h5 style={{ fontSize: '.92rem', marginBottom: 4 }}>{b.name}</h5>
              <p style={{ fontSize: '.76rem', color: 'var(--ink-3)', margin: 0 }}>{b.desc}</p>
            </div>
          )
        })}
      </div>

      {weak.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}><AlertCircle size={16} /> Topics to revisit</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>{weak.map((w) => <span key={w} className="pill pill-d3"><RotateCcw size={13} /> {w}</span>)}</div>
        </div>
      )}
      {strong.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}><ThumbsUp size={16} /> Your strengths</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>{strong.map((w) => <span key={w} className="pill pill-d1"><CheckCircle2 size={13} /> {w}</span>)}</div>
        </div>
      )}
    </div>
  )
}
