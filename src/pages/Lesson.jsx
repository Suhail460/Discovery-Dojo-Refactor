import { useState, useEffect } from 'react'
import { Layers, Signal, Clock, Hash, Target, Lightbulb, GitBranch, Building2, CornerDownRight, AlertTriangle, XCircle, Pencil, Brain, Save, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { CURRICULUM } from '../data/curriculum.js'
import { useStore } from '../hooks/useStore.jsx'
import Mermaid from '../components/diagrams/Mermaid.jsx'
import Quiz from '../components/quiz/Quiz.jsx'

const DIFF = ['', 'Beginner', 'Intermediate', 'Advanced']
const CONF = ['Shaky', 'Getting it', 'Solid', 'Could teach it']

export default function Lesson({ nav, toast }) {
  const store = useStore()
  const { state, update, addXP, bumpStreak, checkBadges, screenId, levelDone } = store
  const lvl = CURRICULUM.find((x) => x.id === nav.current.level)
  const n = lvl.screens.length
  const idx = Math.min(nav.current.screen || 0, n - 1)
  const sc = lvl.screens[idx]
  const sid = screenId(lvl.id, idx)
  const done = state.completed.includes(sid)

  const [reflect, setReflect] = useState(state.reflections[sid] || '')
  useEffect(() => { setReflect(state.reflections[sid] || ''); window.scrollTo(0, 0) }, [sid])

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
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Head */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          <span className="pill pill-lvl"><Layers size={13} /> Level {lvl.id} · {lvl.title}</span>
          <span className={'pill pill-d' + (sc.diff || lvl.diff)}><Signal size={13} /> {DIFF[sc.diff || lvl.diff]}</span>
          <span className="pill pill-time"><Clock size={13} /> ~{sc.time || 6} min</span>
          <span className="pill pill-time"><Hash size={13} /> {idx + 1} of {n}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.7rem,3.6vw,2.5rem)', marginBottom: 12 }}>{sc.title}</h1>
        {sc.lead && <p className="font-serif-q" style={{ fontSize: '1.12rem', color: 'var(--ink-2)', maxWidth: '68ch' }}>{sc.lead}</p>}
        <div style={{ display: 'flex', gap: 5, marginTop: 16 }}>
          {lvl.screens.map((_, i) => {
            const d = state.completed.includes(screenId(lvl.id, i))
            return <span key={i} style={{ height: 5, flex: 1, borderRadius: 5, background: i === idx ? 'var(--accent)' : d ? 'var(--plum-2)' : 'var(--line-soft)' }} />
          })}
        </div>
      </div>

      {sc.objectives && <Block icon={<Target size={16} />} label="You'll be able to"><ul className="prose-q">{sc.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul></Block>}
      {sc.prose && <div style={{ margin: '32px 0' }}><div className="prose-q" style={{ fontSize: '1.04rem', maxWidth: '70ch' }} dangerouslySetInnerHTML={{ __html: sc.prose }} /></div>}

      {sc.analogy && (
        <div style={{ margin: '32px 0' }}>
          <div style={{ background: 'var(--plum-wash)', borderRadius: 22, padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--plum)', color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}><Lightbulb size={20} /></div>
            <div><h4 style={{ color: 'var(--plum)', marginBottom: 6, fontSize: '1.02rem' }}>{sc.analogy.title}</h4><p className="font-serif-q" style={{ margin: 0, fontSize: '1.06rem' }}>{sc.analogy.body}</p></div>
          </div>
        </div>
      )}

      {sc.mermaid && <Block icon={<GitBranch size={16} />} label="Visual"><Mermaid code={sc.mermaid.code} caption={sc.mermaid.cap} /></Block>}

      {sc.launch && (
        <div style={{ margin: '32px 0' }}>
          <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div><h4 style={{ marginBottom: 4 }}>Hands-on practice</h4><p style={{ margin: 0, color: 'var(--ink-3)' }}>This lesson unlocks a live interactive tool.</p></div>
            <button className="btn btn-plum" onClick={() => nav.go(sc.launch.view)}>{sc.launch.label}</button>
          </div>
        </div>
      )}

      {sc.example && (
        <div style={{ margin: '32px 0' }}>
          <div style={{ background: 'var(--surface-2)', borderRadius: 22, padding: 24 }}>
            <h4 style={{ fontSize: '.82rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Building2 size={15} /> Real-world examples</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {sc.example.items.map((e, i) => <li key={i} style={{ display: 'flex', gap: 10, fontSize: '.95rem' }}><CornerDownRight size={16} color="var(--ink-3)" style={{ flex: 'none', marginTop: 3 }} /><span dangerouslySetInnerHTML={{ __html: e }} /></li>)}
            </ul>
          </div>
        </div>
      )}

      {sc.mistakes && (
        <div style={{ margin: '32px 0' }}>
          <div style={{ background: 'var(--bad-wash)', borderRadius: 22, padding: 24 }}>
            <h4 style={{ fontSize: '.82rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--bad)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={15} /> Common mistakes</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {sc.mistakes.map((m, i) => <li key={i} style={{ display: 'flex', gap: 10, fontSize: '.95rem' }}><XCircle size={16} color="var(--bad)" style={{ flex: 'none', marginTop: 3 }} /><span>{m}</span></li>)}
            </ul>
          </div>
        </div>
      )}

      {sc.quiz && <Block icon={<Pencil size={16} />} label="Interactive exercise & quiz"><div className="card" style={{ padding: 24 }}><Quiz key={sid} quiz={sc.quiz} onResult={onQuizResult} /></div></Block>}

      {sc.reflection && (
        <Block icon={<Brain size={16} />} label="Reflection & confidence">
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: '1.08rem', fontWeight: 600, marginBottom: 16 }}>{sc.reflection}</div>
            <textarea className="input" style={{ minHeight: 96, resize: 'vertical' }} value={reflect} onChange={(e) => setReflect(e.target.value)} placeholder="Write your reflection. Only you see this; it saves to your memory." />
            <div style={{ marginTop: 12, fontSize: '.82rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>How confident do you feel?</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {CONF.map((t, i) => {
                const sel = state.confidence[sid] === i
                return <button key={i} onClick={() => setConfidence(i)} style={{ padding: '8px 14px', borderRadius: 999, border: '1.5px solid ' + (sel ? 'var(--plum)' : 'var(--line)'), background: sel ? 'var(--plum)' : 'var(--surface)', color: sel ? '#fff' : 'var(--ink-2)', fontWeight: 600, fontSize: '.85rem', cursor: 'pointer' }}>{t}</button>
              })}
            </div>
            <div style={{ marginTop: 14 }}><button className="btn btn-ghost btn-sm" onClick={saveReflection}><Save size={15} /> Save reflection</button></div>
          </div>
        </Block>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
        <button className="btn btn-ghost" disabled={idx === 0} onClick={() => nav.gotoScreen(idx - 1)}><ArrowLeft size={16} /> Back</button>
        <div style={{ flex: 1 }} />
        {done && <span className="pill pill-d1"><Check size={13} /> Completed</span>}
        <button className="btn btn-primary" onClick={complete}>{idx === n - 1 ? 'Finish level' : 'Complete & continue'} <ArrowRight size={16} /></button>
      </div>
    </div>
  )
}

function Block({ icon, label, children }) {
  return (
    <div style={{ margin: '32px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>{icon} {label}</div>
      {children}
    </div>
  )
}
