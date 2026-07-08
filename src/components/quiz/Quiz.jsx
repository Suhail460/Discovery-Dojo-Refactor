import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PartyPopper, Lightbulb, Check, MinusCircle, AlertTriangle, GripVertical } from 'lucide-react'

/* Handles mcq | truefalse | order | match. Calls onResult(correctBool) once. */
export default function Quiz({ quiz, onResult }) {
  switch (quiz.type) {
    case 'truefalse': return <TrueFalse quiz={quiz} onResult={onResult} />
    case 'order': return <Ordering quiz={quiz} onResult={onResult} />
    case 'match': return <Matching quiz={quiz} onResult={onResult} />
    default: return <Mcq quiz={quiz} onResult={onResult} />
  }
}

function Prompt({ quiz }) {
  return (
    <>
      {quiz.scenario && (
        <div style={{ background: 'var(--surface-2)', borderRadius: 14, padding: 16, marginBottom: 16, fontSize: '.96rem', color: 'var(--ink-2)', fontFamily: '"Newsreader", Georgia, serif' }}>
          {quiz.scenario}
        </div>
      )}
      <div style={{ fontSize: '1.08rem', fontWeight: 600, marginBottom: 16, color: 'var(--ink)' }}>{quiz.prompt}</div>
    </>
  )
}

function Feedback({ ok, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{ borderRadius: 14, padding: 16, marginTop: 16, fontSize: '.95rem',
        background: ok ? 'var(--ok-wash)' : 'var(--bad-wash)', color: 'var(--ink)' }}>
      <h5 style={{ fontFamily: '"Bricolage Grotesque"', fontSize: '.95rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7, color: ok ? 'var(--ok)' : 'var(--bad)' }}>
        {ok ? <PartyPopper size={16} /> : <Lightbulb size={16} />} {ok ? 'Correct' : 'Not quite'}
      </h5>
      <div>{children}</div>
    </motion.div>
  )
}

const optBase = { display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', textAlign: 'left', padding: '14px 16px', border: '1.5px solid var(--line)', borderRadius: 14, background: 'var(--surface)', color: 'var(--ink)', fontSize: '.98rem', marginBottom: 10, cursor: 'pointer', transition: 'all .16s' }
function Marker({ children, state }) {
  const bg = { correct: 'var(--ok)', wrong: 'var(--bad)', sel: 'var(--plum)' }[state]
  return <span style={{ width: 22, height: 22, borderRadius: 7, border: '1.5px solid var(--line)', flex: 'none', display: 'grid', placeItems: 'center', fontSize: '.72rem', fontWeight: 700, marginTop: 1, background: bg || 'transparent', color: bg ? '#fff' : 'var(--ink-3)', borderColor: bg || 'var(--line)' }}>{children}</span>
}

function Mcq({ quiz, onResult }) {
  const [picked, setPicked] = useState(null)
  const answered = picked !== null
  return (
    <div>
      <Prompt quiz={quiz} />
      {quiz.options.map((o, i) => {
        let state
        if (answered) { if (o.ok) state = 'correct'; else if (i === picked) state = 'wrong' }
        const bg = state === 'correct' ? 'var(--ok-wash)' : state === 'wrong' ? 'var(--bad-wash)' : 'var(--surface)'
        const bc = state === 'correct' ? 'var(--ok)' : state === 'wrong' ? 'var(--bad)' : 'var(--line)'
        return (
          <button key={i} disabled={answered} style={{ ...optBase, background: bg, borderColor: bc, cursor: answered ? 'default' : 'pointer' }}
            onClick={() => { setPicked(i); onResult(o.ok) }}>
            <Marker state={state}>{String.fromCharCode(65 + i)}</Marker>
            <span style={{ flex: 1 }}>{o.t}</span>
          </button>
        )
      })}
      <AnimatePresence>{answered && <Feedback ok={quiz.options[picked].ok}>{quiz.options[picked].why}</Feedback>}</AnimatePresence>
    </div>
  )
}

function TrueFalse({ quiz, onResult }) {
  const [picked, setPicked] = useState(null)
  const answered = picked !== null
  return (
    <div>
      <Prompt quiz={quiz} />
      {[['True', true], ['False', false]].map(([label, val]) => {
        let state
        if (answered) { if (val === quiz.answer) state = 'correct'; else if (val === picked) state = 'wrong' }
        const bg = state === 'correct' ? 'var(--ok-wash)' : state === 'wrong' ? 'var(--bad-wash)' : 'var(--surface)'
        const bc = state === 'correct' ? 'var(--ok)' : state === 'wrong' ? 'var(--bad)' : 'var(--line)'
        return (
          <button key={label} disabled={answered} style={{ ...optBase, background: bg, borderColor: bc, cursor: answered ? 'default' : 'pointer' }}
            onClick={() => { setPicked(val); onResult(val === quiz.answer) }}>
            <Marker state={state}>{val ? 'T' : 'F'}</Marker><span style={{ flex: 1 }}>{label}</span>
          </button>
        )
      })}
      <AnimatePresence>{answered && <Feedback ok={picked === quiz.answer}>{picked ? quiz.whyTrue : quiz.whyFalse}</Feedback>}</AnimatePresence>
    </div>
  )
}

function Ordering({ quiz, onResult }) {
  const [items, setItems] = useState(() => shuffle(quiz.items.map((t, i) => ({ t, orig: i }))))
  const [checked, setChecked] = useState(false)
  const dragIdx = useState({ v: null })[0]
  const allRight = items.every((it, pos) => it.orig === pos)

  function onDrop(pos) {
    if (dragIdx.v === null || dragIdx.v === pos) return
    const next = [...items]
    const [moved] = next.splice(dragIdx.v, 1)
    next.splice(pos, 0, moved)
    setItems(next); dragIdx.v = null
  }
  return (
    <div>
      <Prompt quiz={quiz} />
      {items.map((it, pos) => {
        const state = checked ? (it.orig === pos ? 'right' : 'wrong') : null
        const numBg = state === 'right' ? 'var(--ok)' : state === 'wrong' ? 'var(--bad)' : 'var(--plum-wash)'
        const numCol = state ? '#fff' : 'var(--plum)'
        return (
          <div key={it.orig} draggable={!checked}
            onDragStart={() => { dragIdx.v = pos }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(pos)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1.5px solid var(--line)', borderRadius: 14, background: 'var(--surface)', marginBottom: 8, cursor: checked ? 'default' : 'grab' }}>
            <GripVertical size={16} color="var(--ink-3)" />
            <span style={{ width: 24, height: 24, borderRadius: 7, background: numBg, color: numCol, fontWeight: 700, display: 'grid', placeItems: 'center', fontSize: '.8rem', flex: 'none' }}>{pos + 1}</span>
            <span>{it.t}</span>
          </div>
        )
      })}
      {!checked
        ? <button className="btn btn-plum btn-sm" style={{ marginTop: 8 }} onClick={() => { setChecked(true); onResult(allRight) }}><Check size={15} /> Check order</button>
        : <AnimatePresence><Feedback ok={allRight}>{allRight ? 'Perfect sequence.' : 'Correct order: ' + quiz.items.join(' -> ')}</Feedback></AnimatePresence>}
    </div>
  )
}

function Matching({ quiz, onResult }) {
  const rights = useMemo(() => shuffle(quiz.pairs.map((p, i) => ({ r: p.r, i }))), [quiz])
  const [selLeft, setSelLeft] = useState(null)
  const [matches, setMatches] = useState({})
  const done = Object.keys(matches).length === quiz.pairs.length
  const allRight = done && Object.entries(matches).every(([l, r]) => +l === +r)

  function pickRight(rOrig) {
    if (selLeft === null || done) return
    const next = { ...matches, [selLeft]: rOrig }
    setSelLeft(null); setMatches(next)
    if (Object.keys(next).length === quiz.pairs.length) {
      onResult(Object.entries(next).every(([l, r]) => +l === +r))
    }
  }
  const cell = (extra) => ({ padding: '11px 14px', border: '1.5px solid var(--line)', borderRadius: 14, background: 'var(--surface)', marginBottom: 8, fontSize: '.92rem', transition: 'all .16s', cursor: 'pointer', ...extra })
  return (
    <div>
      <Prompt quiz={quiz} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontWeight: 700, marginBottom: 8 }}>Item</div>
          {quiz.pairs.map((p, i) => {
            const matched = matches[i] !== undefined
            const style = matched ? cell({ borderColor: 'var(--ok)', background: 'var(--ok-wash)', opacity: .75 }) : selLeft === i ? cell({ borderColor: 'var(--plum)', background: 'var(--plum-wash)' }) : cell()
            return <div key={i} style={style} onClick={() => !matched && !done && setSelLeft(i)}>{p.l}</div>
          })}
        </div>
        <div>
          <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontWeight: 700, marginBottom: 8 }}>Match</div>
          {rights.map((r) => {
            const used = Object.values(matches).includes(r.i)
            const style = used ? cell({ borderColor: 'var(--ok)', background: 'var(--ok-wash)', opacity: .75 }) : cell()
            return <div key={r.i} style={style} onClick={() => pickRight(r.i)}>{r.r}</div>
          })}
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: '.82rem', color: 'var(--ink-3)' }}>Tap an item on the left, then its match on the right.</div>
      <AnimatePresence>{done && <Feedback ok={allRight}>{allRight ? 'All matched correctly.' : 'Some matches are off. Review the pairs and try the concept again.'}</Feedback>}</AnimatePresence>
    </div>
  )
}

function shuffle(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }
