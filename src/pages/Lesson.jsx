import { useState, useEffect, useRef, useCallback } from 'react'
import { Layers, Signal, Clock, Hash, Target, Lightbulb, GitBranch, Building2, CornerDownRight, AlertTriangle, XCircle, Pencil, Brain, Save, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { CURRICULUM } from '../data/curriculum.js'
import { useStore } from '../hooks/useStore.jsx'
import Mermaid from '../components/diagrams/Mermaid.jsx'
import SEO from '../components/common/SEO.jsx'
import Quiz from '../components/quiz/Quiz.jsx'
import { useNavigation } from '../hooks/useNavigation.js'
import { useToast } from '../context/ToastContext.jsx'

const DIFF = ['', 'Beginner', 'Intermediate', 'Advanced']
const CONF = ['Shaky', 'Getting it', 'Solid', 'Could teach it']

export default function Lesson() {
  const { toast } = useToast()
  const nav = useNavigation(toast)
  const store = useStore()
  const { state, update, addXP, bumpStreak, checkBadges, screenId, levelDone } = store
  const lvl = CURRICULUM.find((x) => x.id === nav.current.level)
  const n = lvl.screens.length
  const idx = Math.min(nav.current.screen || 0, n - 1)
  const sc = lvl.screens[idx]
  const sid = screenId(lvl.id, idx)
  const done = state.completed.includes(sid)
  const contentRef = useRef(null)
  const [readPct, setReadPct] = useState(0)
  const [reflect, setReflect] = useState(state.reflections[sid] || '')

  useEffect(() => { setReflect(state.reflections[sid] || ''); window.scrollTo(0, 0) }, [sid, state])

  const handleScroll = useCallback(() => {
    if (!contentRef.current) return
    const { top, height } = contentRef.current.getBoundingClientRect()
    const winH = window.innerHeight
    const total = height + top
    const scrolled = winH - top
    const pct = Math.min(Math.max(Math.round((scrolled / total) * 100), 0), 100)
    setReadPct(pct)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  function onQuizResult(ok) {
    update((s) => {
      s.quizScores = { ...s.quizScores, [sid]: ok ? 1 : 0 }
      if (ok) { s.quizWins = (s.quizWins || 0) + 1; s.xp += 15; if (!s.strong.includes(lvl.title)) s.strong = [...s.strong, lvl.title] }
      else { s.xp += 5; if (!s.weak.includes(lvl.title)) s.weak = [...s.weak, lvl.title] }
      return s
    })
    bumpStreak(); setTimeout(checkBadges, 50)
    toast(ok ? '+15 XP · nailed it' : '+5 XP · keep going', ok ? 'party-popper' : 'lightbulb')
  }

  function setConfidence(v) { update((s) => ({ ...s, confidence: { ...s.confidence, [sid]: v } })) }
  function saveReflection() {
    update((s) => ({ ...s, reflections: { ...s.reflections, [sid]: reflect } }))
    if (reflect.trim()) { addXP(5); toast('Reflection saved to your memory.', 'brain') }
  }

  function complete() {
    const isLast = idx === n - 1
    update((s) => {
      const ns = { ...s, reflections: { ...s.reflections, [sid]: reflect } }
      if (!ns.completed.includes(sid)) { ns.completed = [...ns.completed, sid]; ns.xp += 20 }
      return ns
    })
    bumpStreak(); setTimeout(checkBadges, 50)
    if (isLast) {
      setTimeout(() => {
        if (levelDone(lvl.id)) {
          const next = lvl.id + 1
          toast(next <= 15 ? `Level ${lvl.id} complete! Level ${next} unlocked.` : 'All 15 levels done. Discovery Master!', 'award')
          nav.go('home')
        }
      }, 60)
    } else nav.gotoScreen(idx + 1)
  }

  return (
    <div className="fade-in" ref={contentRef} style={{ maxWidth: 780, margin: '0 auto', position: 'relative' }}>
      <SEO title={`Level ${lvl.id}: ${sc.title}`} description={sc.lead} />

      {/* Reading progress bar */}
      <div style={{ position: 'fixed', top: 'var(--topbar-h, 56px)', left: 0, right: 0, height: 3, zIndex: 25, background: 'var(--line-soft)' }}>
        <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, var(--plum), var(--accent))', borderRadius: '0 3px 3px 0' }} animate={{ width: readPct + '%' }} transition={{ duration: 0.1 }} />
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <span className="pill pill-lvl"><Layers size={11} /> Level {lvl.id} · {lvl.title}</span>
          <span className={'pill pill-d' + (sc.diff || lvl.diff)}><Signal size={11} /> {DIFF[sc.diff || lvl.diff]}</span>
          <span className="pill pill-time"><Clock size={11} /> ~{sc.time || 6} min</span>
          <span className="pill pill-time"><Hash size={11} /> {idx + 1} of {n}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem,3.6vw,2.2rem)', marginBottom: 10, letterSpacing: '-.02em' }}>{sc.title}</h1>
        {sc.lead && <p className="font-serif-q" style={{ fontSize: '1.08rem', color: 'var(--ink-2)', maxWidth: '68ch', lineHeight: 1.6 }}>{sc.lead}</p>}
        <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
          {lvl.screens.map((_, i) => {
            const d = state.completed.includes(screenId(lvl.id, i))
            return <span key={i} style={{ height: 4, flex: 1, borderRadius: 4, background: i === idx ? 'var(--accent)' : d ? 'var(--plum-2)' : 'var(--line-soft)' }} />
          })}
        </div>
      </div>

      {/* Objectives */}
      {sc.objectives && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ margin: '28px 0', padding: 20, borderRadius: 18, background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--plum)' }}>
            <Target size={16} />
            <span style={{ fontWeight: 700, fontSize: '.82rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>What you&apos;ll learn</span>
          </div>
          <ul className="prose-q" style={{ margin: 0 }}>{sc.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
        </motion.div>
      )}

      {/* Prose content */}
      {sc.prose && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ margin: '32px 0' }}>
          <div className="prose-q" style={{ fontSize: '1.02rem', maxWidth: '70ch', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: sc.prose }} />
        </motion.div>
      )}

      {/* Analogy callout */}
      {sc.analogy && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ margin: '32px 0' }}>
          <div style={{ borderRadius: 20, padding: 24, background: 'var(--plum-wash)', border: '1px solid var(--plum-2)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--plum)', color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}><Lightbulb size={20} /></div>
            <div>
              <h4 style={{ color: 'var(--plum)', marginBottom: 6, fontSize: '1rem' }}>{sc.analogy.title}</h4>
              <p className="font-serif-q" style={{ margin: 0, fontSize: '1.02rem', lineHeight: 1.6, color: 'var(--ink)' }}>{sc.analogy.body}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mermaid diagram */}
      {sc.mermaid && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '32px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <GitBranch size={16} color="var(--plum)" />
            <span style={{ fontWeight: 700, fontSize: '.82rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>Visual</span>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <Mermaid code={sc.mermaid.code} caption={sc.mermaid.cap} />
          </div>
        </motion.div>
      )}

      {/* Launch CTA */}
      {sc.launch && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '32px 0' }}>
          <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap', background: 'var(--plum-wash)' }}>
            <div>
              <h4 style={{ marginBottom: 4, fontSize: '1rem' }}>Hands-on practice</h4>
              <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: '.88rem' }}>This lesson unlocks a live interactive tool.</p>
            </div>
            <button className="btn btn-plum btn-sm" onClick={() => nav.go(sc.launch.view)}>{sc.launch.label || 'Open tool'}</button>
          </div>
        </motion.div>
      )}

      {/* Examples */}
      {sc.example && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '32px 0' }}>
          <div style={{ borderRadius: 20, padding: 24, background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
            <h4 style={{ fontSize: '.82rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Building2 size={15} /> Real-world examples</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {sc.example.items.map((e, i) => <li key={i} style={{ display: 'flex', gap: 10, fontSize: '.95rem', lineHeight: 1.6 }}><CornerDownRight size={16} color="var(--ink-3)" style={{ flex: 'none', marginTop: 3 }} /><span dangerouslySetInnerHTML={{ __html: e }} /></li>)}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Mistakes */}
      {sc.mistakes && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '32px 0' }}>
          <div style={{ borderRadius: 20, padding: 24, background: 'var(--bad-wash)', border: '1px solid var(--bad)' }}>
            <h4 style={{ fontSize: '.82rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--bad)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={15} /> Common mistakes</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {sc.mistakes.map((m, i) => <li key={i} style={{ display: 'flex', gap: 10, fontSize: '.95rem', lineHeight: 1.6 }}><XCircle size={16} color="var(--bad)" style={{ flex: 'none', marginTop: 3 }} /><span>{m}</span></li>)}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Quiz */}
      {sc.quiz && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '32px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Pencil size={16} color="var(--plum)" />
            <span style={{ fontWeight: 700, fontSize: '.82rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>Interactive exercise & quiz</span>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <Quiz key={sid} quiz={sc.quiz} onResult={onQuizResult} />
          </div>
        </motion.div>
      )}

      {/* Reflection */}
      {sc.reflection && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '32px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Brain size={16} color="var(--plum)" />
            <span style={{ fontWeight: 700, fontSize: '.82rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>Reflection & confidence</span>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: '1.02rem', fontWeight: 600, marginBottom: 16, lineHeight: 1.5 }}>{sc.reflection}</div>
            <textarea className="input" style={{ minHeight: 90, resize: 'vertical', fontSize: '.92rem' }} value={reflect} onChange={(e) => setReflect(e.target.value)} placeholder="Write your reflection. Only you see this; it saves to your memory." />
            <div style={{ marginTop: 12, fontSize: '.78rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>How confident do you feel?</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {CONF.map((t, i) => {
                const sel = state.confidence[sid] === i
                return <button key={i} onClick={() => setConfidence(i)} style={{ padding: '8px 14px', borderRadius: 999, border: '1.5px solid ' + (sel ? 'var(--plum)' : 'var(--line)'), background: sel ? 'var(--plum)' : 'var(--surface)', color: sel ? '#fff' : 'var(--ink-2)', fontWeight: 600, fontSize: '.85rem', cursor: 'pointer', transition: 'all .15s' }}>{t}</button>
              })}
            </div>
            <div style={{ marginTop: 14 }}><button className="btn btn-ghost btn-sm" onClick={saveReflection}><Save size={15} /> Save reflection</button></div>
          </div>
        </motion.div>
      )}

      {/* Navigation footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--line)', marginBottom: 40 }}>
        <button className="btn btn-ghost btn-sm" disabled={idx === 0} onClick={() => nav.gotoScreen(idx - 1)}><ChevronLeft size={16} /> Back</button>
        <div style={{ flex: 1 }} />
        {done && <span className="pill pill-d1"><Check size={12} /> Completed</span>}
        <button className="btn btn-primary" onClick={complete}>{idx === n - 1 ? 'Finish level' : 'Continue'} <ChevronRight size={16} /></button>
      </div>
    </div>
  )
}
