import { useState, useRef, useEffect } from 'react'
import { Mic, Infinity as Inf, Play, Flag, Send, MessagesSquare, MicOff, RotateCcw, AlertTriangle, Megaphone, Check, MinusCircle, ClipboardList } from 'lucide-react'
import { PERSONA_OPTS } from '../data/gamedata.js'
import { useStore } from '../hooks/useStore.jsx'
import { clamp, pick, cap } from '../utils/helpers.js'
import { useToast } from '../context/ToastContext.jsx'

/* Live customer interview simulator with question analysis + scorecard. */
export default function InterviewSim() {
  const { toast } = useToast()
  const { update, addXP, bumpStreak, checkBadges } = useStore()
  const [persona, setPersona] = useState(null)
  const [active, setActive] = useState(false)
  const [log, setLog] = useState([])
  const [turns, setTurns] = useState(0)
  const [flags, setFlags] = useState(zeroFlags())
  const [score, setScore] = useState(null)
  const [input, setInput] = useState('')
  const [form, setForm] = useState({ name: 'Alex Rivera', age: 34, prof: PERSONA_OPTS.prof[0], industry: PERSONA_OPTS.industry[0], personality: PERSONA_OPTS.personality[0], exp: PERSONA_OPTS.exp[0], pain: 'wastes hours reconciling data across tools', goal: 'look competent and hit deadlines without overtime' })
  const scrollRef = useRef(null)
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [log])

  function start() {
    const p = { ...form, emoji: PERSONA_OPTS.emoji[form.prof] || '🧑' }
    setPersona(p); setActive(true); setScore(null); setTurns(0); setFlags(zeroFlags())
    const greet = p.personality.startsWith('Talkative') ? `Oh hi! Happy to chat. I'm ${p.name}, I work as a ${p.prof.toLowerCase()}. Fair warning, I can ramble.`
      : p.personality.startsWith('Terse') ? `Hi. ${p.name}. I've got about ten minutes, so let's go.`
      : p.personality === 'Skeptical' ? `Hey. ${p.name}. I'll be honest, these are usually a sales pitch in disguise. Prove me wrong.`
      : `Hi, I'm ${p.name}, ${p.prof.toLowerCase()} in ${p.industry.toLowerCase()}. Ask away.`
    setLog([{ who: 'them', text: greet }])
  }

  function ask() {
    const q = input.trim(); if (!q || !active) return
    const a = analyze(q)
    const nf = { ...flags }
    if (a.type === 'lead') nf.lead++; else if (a.type === 'closed') nf.closed++; else if (a.type === 'sol') nf.sol++
    else if (a.type === 'good') { nf.good++; if (a.story) nf.openStory++ }
    if (/\bwhy\b/i.test(q)) nf.why++
    if (/thank|appreciate|makes sense|got it|interesting|tell me more/i.test(q)) nf.rapport++
    setFlags(nf)
    setLog((l) => [...l, { who: 'me', text: q, tag: a.tag }, { who: 'them', text: reply(q, a, persona) }])
    setTurns((t) => t + 1); setInput('')
  }

  function end() {
    setActive(false)
    const n = Math.max(turns, 1)
    const openness = clamp(Math.round((flags.good / n) * 100))
    const nonLeading = clamp(Math.round((1 - flags.lead / n) * 100))
    const nonPitch = clamp(Math.round((1 - flags.sol / n) * 100))
    const depth = clamp(Math.round(((flags.why + flags.openStory) / n) * 100))
    const rapport = clamp(20 + flags.rapport * 20)
    const overall = Math.round(openness * .28 + nonLeading * .24 + nonPitch * .20 + depth * .20 + rapport * .08)
    const insights = []
    if (flags.good) insights.push(`You asked ${flags.good} strong open question${flags.good > 1 ? 's' : ''} that mined real behavior.`)
    if (flags.lead) insights.push(`⚠️ ${flags.lead} leading question${flags.lead > 1 ? 's' : ''}: watch for 'don't you', 'wouldn't you', 'right?'.`)
    if (flags.sol) insights.push(`⚠️ ${flags.sol} solution-pitch${flags.sol > 1 ? 'es' : ''}: you asked about a feature before validating the problem.`)
    if (flags.closed) insights.push(`${flags.closed} closed/yes-no question${flags.closed > 1 ? 's' : ''}. Open them up with 'tell me about...'.`)
    if (flags.why) insights.push(`You dug into 'why' ${flags.why} time${flags.why > 1 ? 's' : ''}. That's where root causes live.`)
    if (turns < 5) insights.push(`Short interview (${turns} questions). Aim for 8+ to get past surface answers.`)
    if (!insights.length) insights.push('Not enough signal to score. Ask more questions next time.')
    const data = { overall, openness, nonLeading, nonPitch, depth, rapport, insights }
    setScore(data)
    update((s) => ({ ...s, interviews: [...s.interviews, { score: overall, when: new Date().toISOString().slice(0, 10), persona: persona.prof }] }))
    addXP(30 + Math.round(overall / 4)); bumpStreak(); setTimeout(checkBadges, 50)
    toast(`Interview scored: ${overall}/100`, 'clipboard-list')
  }

  const disabled = active
  return (
    <div className="fade-in" style={{ maxWidth: 1180, margin: '0 auto' }}>
      <Head />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,320px) 1fr', gap: 24 }} className="sim-grid">
        {/* persona builder */}
        <div className="card" style={{ padding: 24, alignSelf: 'start' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(145deg,var(--plum),var(--accent))', display: 'grid', placeItems: 'center', fontSize: '2rem', marginBottom: 16 }}>{persona?.emoji || '🧑'}</div>
          <F label="Name"><input className="input" disabled={disabled} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></F>
          <F label="Age"><input className="input" type="number" disabled={disabled} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></F>
          <F label="Profession"><Sel field="prof" opts={PERSONA_OPTS.prof} {...{ form, setForm, disabled }} /></F>
          <F label="Industry"><Sel field="industry" opts={PERSONA_OPTS.industry} {...{ form, setForm, disabled }} /></F>
          <F label="Personality"><Sel field="personality" opts={PERSONA_OPTS.personality} {...{ form, setForm, disabled }} /></F>
          <F label="Experience level"><Sel field="exp" opts={PERSONA_OPTS.exp} {...{ form, setForm, disabled }} /></F>
          <F label="Main pain point"><input className="input" disabled={disabled} value={form.pain} onChange={(e) => setForm({ ...form, pain: e.target.value })} /></F>
          <F label="Main goal"><input className="input" disabled={disabled} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} /></F>
          {active
            ? <button className="btn btn-primary" style={{ width: '100%' }} onClick={end}><Flag size={16} /> End & score interview</button>
            : <button className="btn btn-plum" style={{ width: '100%' }} onClick={start}><Play size={16} /> Start interview</button>}
        </div>

        {/* chat + scorecard */}
        <div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 520, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(145deg,var(--plum),var(--accent))', display: 'grid', placeItems: 'center', fontSize: '1.2rem' }}>{persona?.emoji || '🧑'}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem' }}>{persona?.name || 'No interview yet'}</h4>
                <p style={{ margin: 0, fontSize: '.78rem', color: 'var(--ink-3)' }}>{persona ? `${persona.prof} · ${persona.industry}` : 'Build a persona and hit start'}</p>
              </div>
              <span className="pill pill-time"><MessagesSquare size={13} /> {turns} Q</span>
            </div>
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {log.length ? log.map((m, i) => <Bubble key={i} m={m} />) : (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--ink-3)' }}>
                  <MicOff size={44} color="var(--line)" style={{ marginBottom: 12 }} />
                  <p>Start an interview to begin. Tip: open with &apos;Tell me about the last time you...&apos; instead of pitching anything.</p>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, padding: 16, borderTop: '1px solid var(--line)' }}>
              <input value={input} disabled={!active} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ask()}
                placeholder={active ? 'Ask your question...' : 'Start the interview first'} style={{ flex: 1, border: '1.5px solid var(--line)', borderRadius: 12, background: 'var(--surface)', color: 'var(--ink)', padding: '12px 16px', fontFamily: 'inherit', fontSize: '.95rem' }} />
              <button disabled={!active} onClick={ask} style={{ width: 'auto', padding: '0 16px', border: 'none', borderRadius: 12, background: 'var(--plum)', color: '#fff', cursor: active ? 'pointer' : 'not-allowed', opacity: active ? 1 : .5 }}><Send size={18} /></button>
            </div>
          </div>

          {score && <Scorecard d={score} onReset={() => { setScore(null); setPersona(null); setLog([]) }} />}
        </div>
      </div>
      <style>{`@media (max-width:900px){ .sim-grid{ grid-template-columns:1fr !important } }`}</style>
    </div>
  )
}

function Head() {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <span className="pill pill-lvl"><Mic size={13} /> Practice tool</span>
        <span className="pill pill-time"><Inf size={13} /> Unlimited</span>
      </div>
      <h1 style={{ fontSize: 'clamp(1.7rem,3.6vw,2.5rem)', marginBottom: 12 }}>Customer Interview Simulator</h1>
      <p className="font-serif-q" style={{ fontSize: '1.12rem', color: 'var(--ink-2)', maxWidth: '68ch' }}>Build a customer, then interview them live. Every question is analyzed for leading language, closed framing, solution-pitching, and depth. End for a full scorecard.</p>
    </div>
  )
}
function F({ label, children }) { return <div style={{ marginBottom: 12 }}><label style={{ display: 'block', fontSize: '.74rem', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-3)', fontWeight: 700, marginBottom: 5 }}>{label}</label>{children}</div> }
function Sel({ field, opts, form, setForm, disabled }) { return <select className="input" disabled={disabled} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}>{opts.map((o) => <option key={o}>{o}</option>)}</select> }

function Bubble({ m }) {
  const tagStyle = { lead: { bg: 'var(--bad-wash)', c: 'var(--bad)', I: AlertTriangle, t: 'Leading question' }, sol: { bg: 'var(--bad-wash)', c: 'var(--bad)', I: Megaphone, t: 'Pitching a solution' }, good: { bg: 'var(--ok-wash)', c: 'var(--ok)', I: Check, t: 'Strong open question' }, closed: { bg: 'var(--gold-wash)', c: 'var(--gold-ink)', I: MinusCircle, t: 'Closed / yes-no' } }
  const tg = m.tag ? tagStyle[m.tag] : null
  return (
    <div style={{ maxWidth: '78%', padding: '12px 16px', borderRadius: 16, fontSize: '.95rem', lineHeight: 1.5, alignSelf: m.who === 'me' ? 'flex-end' : 'flex-start', background: m.who === 'me' ? 'var(--plum)' : 'var(--surface-2)', color: m.who === 'me' ? '#fff' : 'var(--ink)', borderBottomRightRadius: m.who === 'me' ? 5 : 16, borderBottomLeftRadius: m.who === 'me' ? 16 : 5 }}>
      {m.text}
      {tg && <div style={{ marginTop: 8 }}><span style={{ fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 999, background: tg.bg, color: tg.c }}><tg.I size={11} /> {tg.t}</span></div>}
    </div>
  )
}

function Scorecard({ d, onReset }) {
  const grade = d.overall >= 85 ? 'Outstanding' : d.overall >= 70 ? 'Strong' : d.overall >= 55 ? 'Developing' : 'Needs work'
  const rows = [['Open questions', d.openness, 'var(--ok)'], ['Avoided leading', d.nonLeading, 'var(--plum-2)'], ['Avoided pitching', d.nonPitch, 'var(--accent)'], ['Depth (why / stories)', d.depth, 'var(--gold)'], ['Rapport', d.rapport, 'var(--info)']]
  const circ = 2 * Math.PI * 52, off = circ * (1 - d.overall / 100)
  return (
    <div className="card fade-in" style={{ padding: 24, marginTop: 24 }}>
      <h3 style={{ fontFamily: '"Bricolage Grotesque"', marginBottom: 16 }}>Interview scorecard <span style={{ color: 'var(--ink-3)', fontWeight: 500, fontSize: '.9rem' }}>· {grade}</span></h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ flex: 'none' }}>
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--line-soft)" strokeWidth="12" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--plum)" strokeWidth="12" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 60 60)" />
          <text x="60" y="58" textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--ink)" fontFamily="'Bricolage Grotesque'">{d.overall}</text>
          <text x="60" y="76" textAnchor="middle" fontSize="10" fill="var(--ink-3)">/ 100</text>
        </svg>
        <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map(([lab, v, c]) => (
            <div key={lab} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 130, fontSize: '.85rem', fontWeight: 600, color: 'var(--ink-2)' }}>{lab}</span>
              <span style={{ flex: 1, height: 8, background: 'var(--line-soft)', borderRadius: 8, overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: v + '%', background: c, borderRadius: 8, transition: 'width .8s' }} /></span>
              <span className="tnum" style={{ width: 38, textAlign: 'right', fontWeight: 700, fontSize: '.85rem' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}><ClipboardList size={16} /> What the coach noticed</div>
        <ul className="prose-q">{d.insights.map((i, k) => <li key={k}>{i}</li>)}</ul>
      </div>
      <button className="btn btn-plum btn-sm" style={{ marginTop: 8 }} onClick={onReset}><RotateCcw size={15} /> Run another interview</button>
    </div>
  )
}

/* ---- analysis + persona reply engine ---- */
function zeroFlags() { return { lead: 0, closed: 0, sol: 0, good: 0, openStory: 0, why: 0, rapport: 0 } }

function analyze(q) {
  const l = q.toLowerCase()
  if (/(don'?t you|wouldn'?t you|isn'?t it|aren'?t you|right\?$|surely|agree that|you must|obviously)/.test(l)) return { type: 'lead', tag: 'lead' }
  if (/(would you (use|pay|want|like)|what if we|imagine a feature|our (app|product|tool)|if we built|if we added)/.test(l)) return { type: 'sol', tag: 'sol' }
  if (/(tell me about|walk me through|last time|describe|what happened|how did you|why (did|do|does|is|are|were)|can you give me an example|the most recent)/.test(l)) return { type: 'good', story: /(last time|walk me through|tell me about|what happened|example|recent)/.test(l), tag: 'good' }
  if (/^(do|did|is|are|was|were|have|has|can|could|will|would|should)\b/.test(l) || /(yes or no|or not)/.test(l)) return { type: 'closed', tag: 'closed' }
  return { type: 'neutral', tag: null }
}
function reply(q, a, p) {
  const talk = p.personality.startsWith('Talkative'), terse = p.personality.startsWith('Terse'), skept = p.personality === 'Skeptical', anal = p.personality === 'Analytical'
  const pain = p.pain, goal = p.goal
  if (a.type === 'lead') return skept ? "See, that's a leading question. I won't just agree because you framed it that way." : pick(['I mean... I guess? You kind of said it for me, so sure.', 'Yeah, sure, if you put it that way.'])
  if (a.type === 'sol') return skept ? "A feature, huh. I can't tell you if I'd use something hypothetical. I don't even know if I have the problem it solves." : "Hard to say. I'd probably say yes to be nice, but I've said yes to things I never used. Ask me what I actually do instead?"
  if (a.type === 'closed') return terse ? 'Yes.' : pick(['Yeah.', 'No, not really.', 'Sort of, yeah.', 'I suppose so.'])
  if (a.type === 'good') {
    if (/\bwhy\b/.test(q.toLowerCase())) return anal ? `The root is that ${pain}. It matters because ${goal}. When it goes wrong, I look disorganized in front of people I'm trying to impress.` : `Honestly? Because ${pain}, and that gets in the way of what I actually care about: ${goal}.`
    const stories = [
      `So last week it happened again. I ${pain}. I remember sitting there at 7pm thinking, this is the third time this month. I ended up ${talk ? 'copy-pasting between four tabs, then double-checking everything because I did not trust it' : "doing it manually and hoping I didn't miss anything"}.`,
      `Most recent time, I was trying to get ${goal.split(' ').slice(0, 4).join(' ')} done, and I just... ${pain}. Took way longer than it should have.`,
      `Funny you ask, it came up two days ago. The reason it's annoying is I ${pain}, and there's no clean way around it. I've basically accepted it, which is the worst part.`
    ]
    let base = pick(stories)
    if (talk) base += ' Sorry, I know I ramble. It is genuinely one of my daily headaches.'
    if (terse) base = base.split('.').slice(0, 2).join('.') + '.'
    return base
  }
  return pick([`Sure. ${cap(pain)} is the honest answer, but I'm not sure what you're getting at.`, "Hmm, can you say more about what you mean? I don't want to guess wrong.", `That's a bit broad. But day to day, ${pain}.`])
}
