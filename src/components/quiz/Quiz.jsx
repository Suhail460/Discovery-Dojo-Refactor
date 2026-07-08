import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PartyPopper, Lightbulb, Check, GripVertical, Zap, X } from 'lucide-react'
import { shuffle } from '../../utils/helpers.js'

function ConfettiBurst() {
  const particles = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    x: (Math.random() - 0.5) * 200,
    y: -(Math.random() * 120 + 40),
    r: Math.random() * 8 + 4,
    c: ['var(--plum)', 'var(--accent)', 'var(--gold)', 'var(--ok)', 'var(--info)'][i % 5],
    delay: Math.random() * 0.2
  })), [])
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: 0, y: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], x: p.x, y: p.y, scale: [0, 1, 0.5] }} transition={{ duration: 0.8, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', left: '50%', bottom: '50%', width: p.r, height: p.r, borderRadius: 2, background: p.c, transform: `rotate(${Math.random() * 90}deg)` }} />
      ))}
    </div>
  )
}

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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--surface-2)', borderRadius: 14, padding: 16, marginBottom: 16, fontSize: '.96rem', color: 'var(--ink-2)', fontFamily: '"Newsreader", Georgia, serif' }}>
          {quiz.scenario}
        </motion.div>
      )}
      <div style={{ fontSize: '1.06rem', fontWeight: 600, marginBottom: 16, lineHeight: 1.5 }}>{quiz.prompt}</div>
    </>
  )
}

function Feedback({ ok, children, index }) {
  return (
    <motion.div key={index || 'fb'} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, padding: 18, marginTop: 16, fontSize: '.95rem', background: ok ? 'var(--ok-wash)' : 'var(--bad-wash)', color: 'var(--ink)', border: '1px solid ' + (ok ? 'var(--ok)' : 'var(--bad)') }}>
      {ok && <ConfettiBurst />}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {ok
          ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} transition={{ type: 'spring', stiffness: 500 }}><PartyPopper size={22} color="var(--ok)" style={{ flex: 'none' }} /></motion.div>
          : <Lightbulb size={22} color="var(--bad)" style={{ flex: 'none' }} />}
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            {ok ? 'Correct!' : 'Not quite'}
            {ok && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="pill pill-d1"><Zap size={11} /> +15 XP</motion.span>}
          </div>
          <div style={{ lineHeight: 1.6 }}>{children}</div>
        </div>
      </div>
    </motion.div>
  )
}

const optBase = { display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: 14, fontSize: '.96rem', marginBottom: 10, cursor: 'pointer', transition: 'all .2s var(--ease-out)', WebkitTapHighlightColor: 'transparent' }

function Marker({ children, state }) {
  const bg = state === 'correct' ? 'var(--ok)' : state === 'wrong' ? 'var(--bad)' : 'transparent'
  const bc = state ? (state === 'correct' ? 'var(--ok)' : 'var(--bad)') : 'var(--line)'
  const col = state ? '#fff' : 'var(--ink-3)'
  return <span style={{ width: 24, height: 24, borderRadius: 8, border: '1.5px solid ' + bc, flex: 'none', display: 'grid', placeItems: 'center', fontSize: '.74rem', fontWeight: 700, marginTop: 1, background: bg, color: col, transition: 'all .2s' }}>{children}</span>
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
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <button disabled={answered} style={{ ...optBase, background: bg, border: '1.5px solid ' + bc, cursor: answered ? 'default' : 'pointer' }}
              onClick={() => { setPicked(i); onResult(o.ok) }}>
              <Marker state={state}>{String.fromCharCode(65 + i)}</Marker>
              <span style={{ flex: 1 }}>{o.t}</span>
              {state === 'correct' && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={18} color="var(--ok)" /></motion.span>}
              {state === 'wrong' && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><X size={18} color="var(--bad)" /></motion.span>}
            </button>
          </motion.div>
        )
      })}
      <AnimatePresence>{answered && <Feedback ok={quiz.options[picked].ok} index={0}>{quiz.options[picked].why}</Feedback>}</AnimatePresence>
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
          <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <button disabled={answered} style={{ ...optBase, background: bg, border: '1.5px solid ' + bc, cursor: answered ? 'default' : 'pointer' }}
              onClick={() => { setPicked(val); onResult(val === quiz.answer) }}>
              <Marker state={state}>{val ? 'T' : 'F'}</Marker><span style={{ flex: 1 }}>{label}</span>
              {state === 'correct' && <Check size={18} color="var(--ok)" />}
              {state === 'wrong' && <X size={18} color="var(--bad)" />}
            </button>
          </motion.div>
        )
      })}
      <AnimatePresence>{answered && <Feedback ok={picked === quiz.answer} index={0}>{picked ? quiz.whyTrue : quiz.whyFalse}</Feedback>}</AnimatePresence>
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
    const next = [...items]; const [moved] = next.splice(dragIdx.v, 1); next.splice(pos, 0, moved)
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
          <motion.div key={it.orig} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} draggable={!checked}
            onDragStart={() => { dragIdx.v = pos }} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(pos)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1.5px solid var(--line)', borderRadius: 14, background: 'var(--surface)', marginBottom: 8, cursor: checked ? 'default' : 'grab', transition: 'all .15s' }}>
            <GripVertical size={16} color="var(--ink-3)" />
            <span style={{ width: 24, height: 24, borderRadius: 8, background: numBg, color: numCol, fontWeight: 700, display: 'grid', placeItems: 'center', fontSize: '.8rem', flex: 'none', transition: 'all .2s' }}>{pos + 1}</span>
            <span style={{ flex: 1 }}>{it.t}</span>
            {state === 'right' && <Check size={16} color="var(--ok)" />}
            {state === 'wrong' && <X size={16} color="var(--bad)" />}
          </motion.div>
        )
      })}
      {!checked
        ? <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><button className="btn btn-plum btn-sm" style={{ marginTop: 8 }} onClick={() => { setChecked(true); onResult(allRight) }}><Check size={15} /> Check order</button></motion.div>
        : <AnimatePresence><Feedback ok={allRight} index={0}>{allRight ? 'Perfect sequence.' : 'Correct order: ' + quiz.items.join(' -> ')}</Feedback></AnimatePresence>}
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
    if (Object.keys(next).length === quiz.pairs.length) onResult(Object.entries(next).every(([l, r]) => +l === +r))
  }
  const cell = (extra) => ({ padding: '11px 14px', borderRadius: 14, marginBottom: 8, fontSize: '.92rem', cursor: 'pointer', border: '1.5px solid var(--line)', transition: 'all .15s', ...extra })
  return (
    <div>
      <Prompt quiz={quiz} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontWeight: 700, marginBottom: 8 }}>Item</div>
          {quiz.pairs.map((p, i) => {
            const matched = matches[i] !== undefined
            const s = matched ? cell({ borderColor: 'var(--ok)', background: 'var(--ok-wash)', opacity: .75 }) : selLeft === i ? cell({ borderColor: 'var(--plum)', background: 'var(--plum-wash)' }) : cell()
            return <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} style={s} onClick={() => !matched && !done && setSelLeft(i)}>{p.l}</motion.div>
          })}
        </div>
        <div>
          <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontWeight: 700, marginBottom: 8 }}>Match</div>
          {rights.map((r) => {
            const used = Object.values(matches).includes(r.i)
            const s = used ? cell({ borderColor: 'var(--ok)', background: 'var(--ok-wash)', opacity: .75 }) : cell()
            return <motion.div key={r.i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: r.i * 0.03 }} style={s} onClick={() => pickRight(r.i)}>{r.r}</motion.div>
          })}
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: '.8rem', color: 'var(--ink-3)', fontWeight: 500 }}>Tap an item on the left, then its match on the right.</div>
      <AnimatePresence>{done && <Feedback ok={allRight} index={0}>{allRight ? 'All matched correctly!' : 'Some matches are off. Review and try again.'}</Feedback>}</AnimatePresence>
    </div>
  )
}
