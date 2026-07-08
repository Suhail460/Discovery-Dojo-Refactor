import { useState } from 'react'
import * as Icons from 'lucide-react'
import { Flag, Save, Award, Check } from 'lucide-react'
import { CAP_STAGES } from '../data/gamedata.js'
import { useStore } from '../hooks/useStore.jsx'
import { toPascal } from '../utils/helpers.js'

export default function Capstone({ nav, toast }) {
  const { state, update, checkBadges } = useStore()
  const [draft, setDraft] = useState(() => ({ ...state.capstone }))
  const [report, setReport] = useState(null)

  const filled = CAP_STAGES.filter((s) => (draft[s.id] || '').trim()).length
  const pct = Math.round((filled / CAP_STAGES.length) * 100)
  const complete = filled === CAP_STAGES.length

  function saveAll() { update((s) => ({ ...s, capstone: { ...draft } })); toast('Capstone progress saved.', 'save') }

  function finish() {
    update((s) => ({ ...s, capstone: { ...draft }, capstoneDone: true, xp: s.xp + (s.capstoneDone ? 0 : 150) }))
    setTimeout(checkBadges, 60)
    const c = draft, wc = (t) => (t || '').trim().split(/\s+/).filter(Boolean).length
    const notes = []
    if (/would you|do you like/i.test(c.interview || '')) notes.push('Your interview insight hints at hypothetical questions. Re-check you mined past behavior, not opinions.')
    if (!/kill|stop|below|under|fail/i.test(c.experiment || '')) notes.push("Your experiment may be missing a clear kill criterion. A test you can't fail isn't a test.")
    else notes.push('Good: your experiment includes a kill criterion, which most people skip.')
    if (/dashboard|button|integration|feature|build/i.test(c.opportunities || '')) notes.push("Some opportunity statements may be solutions in disguise. Re-phrase as customer needs ('I can't...', 'I'm afraid...').")
    else notes.push('Your opportunities read like genuine needs, not features. Nicely done.')
    if (wc(c.roadmap) < 15) notes.push('Your roadmap is thin. Spell out sequence and the STOP condition explicitly.')
    else notes.push('Your roadmap has real sequencing and a stop condition. Mature product thinking.')
    if (/vanity|retention|activation|behavior/i.test(c.analyze || '')) notes.push("You're thinking in behavior-linked metrics, not vanity. Strong.")
    notes.push('Overall: you ran the full arc from idea to roadmap with evidence at each step. That is the whole game.')
    setReport(notes)
    toast('Capstone complete! Practitioner badge earned.', 'award')
    setTimeout(() => document.getElementById('cap-report')?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <span className="pill pill-lvl"><Flag size={13} /> Level 15 · Capstone</span>
          <span className="pill pill-time"><Save size={13} /> Saves to your account</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.7rem,3.6vw,2.5rem)', marginBottom: 12 }}>Capstone: run a full discovery</h1>
        <p className="font-serif-q" style={{ fontSize: '1.12rem', color: 'var(--ink-2)', maxWidth: '68ch' }}>Nine stages, one real idea of your choosing. Finish all nine to unlock your feedback report and the Practitioner badge.</p>
        <div style={{ display: 'flex', gap: 5, marginTop: 20 }}>
          {CAP_STAGES.map((s) => <span key={s.id} style={{ height: 5, flex: 1, borderRadius: 5, background: (draft[s.id] || '').trim() ? 'var(--plum-2)' : 'var(--line-soft)' }} />)}
        </div>
          <p style={{ marginTop: 10, color: 'var(--ink-3)', fontSize: '.88rem' }}>{filled} of {CAP_STAGES.length} stages complete · {pct}%</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {CAP_STAGES.map((s, i) => {
          const Icon = Icons[toPascal(s.icon)] || Flag
          const isFilled = (draft[s.id] || '').trim()
          return (
            <div key={s.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
                <Icon size={16} /> Stage {i + 1}: {s.label} {isFilled && <span className="pill pill-d1" style={{ marginLeft: 8 }}><Check size={12} /> done</span>}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>{s.prompt}</div>
              {s.link && <button className="btn btn-plum btn-sm" style={{ marginBottom: 12 }} onClick={() => nav.go(s.link)}>Open the simulator</button>}
              <textarea className="input" style={{ minHeight: 90, resize: 'vertical' }} value={draft[s.id] || ''} placeholder={s.ph}
                onChange={(e) => setDraft({ ...draft, [s.id]: e.target.value })} onBlur={saveAll} />
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
        <button className="btn btn-ghost" onClick={saveAll}><Save size={16} /> Save progress</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" disabled={!complete} onClick={finish}><Award size={16} /> {complete ? 'Get my feedback report' : 'Complete all stages to finish'}</button>
      </div>

      {report && (
        <div id="cap-report" className="card fade-in" style={{ padding: 24, marginTop: 24 }}>
          <h3 style={{ fontFamily: '"Bricolage Grotesque"', fontSize: '1.4rem', marginBottom: 6 }}>🏁 Capstone feedback report</h3>
          <p style={{ color: 'var(--ink-3)', marginBottom: 16 }}>You completed a full discovery project. Here&apos;s what your coach sees.</p>
          <ul className="prose-q">{report.map((n, i) => <li key={i}>{n}</li>)}</ul>
          <div style={{ marginTop: 16, padding: 16, background: 'var(--ok-wash)', borderRadius: 14, fontWeight: 600, color: 'var(--ink)' }}>Practitioner badge earned. You&apos;ve gone from absolute beginner to running a complete, evidence-driven discovery. Now go do it for real.</div>
        </div>
      )}
    </div>
  )
}
