import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ArrowUp } from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum.js'

export default function Coach({ nav, open: controlledOpen, onClose }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onClose ? (v) => { if (!v && onClose) onClose(); else setInternalOpen(v) } : setInternalOpen
  const [msgs, setMsgs] = useState([{ who: 'bot', text: "Hey, I'm Mei, your discovery coach. I won't just hand you answers, I'll nudge your thinking. Ask me anything, or tap a prompt below." }])
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)
  const [typing, setTyping] = useState(false)

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight }, [msgs, open, typing])

  const chips = chipsFor(nav.current.view)
  function send(text) {
    const t = (text ?? input).trim(); if (!t) return
    setMsgs((m) => [...m, { who: 'me', text: t }])
    setInput('')
    setTyping(true)
    setTimeout(() => { setMsgs((m) => [...m, { who: 'bot', text: coachReply(t, nav.current) }]); setTyping(false) }, 360 + Math.random() * 200)
  }

  return (
    <>
      <button onClick={() => setOpen(!open)} title="Ask your AI coach" aria-label="Toggle AI coach"
        className="coach-fab"
        style={{
          position: 'fixed', right: 20, bottom: 20, zIndex: 60, width: 54, height: 54, borderRadius: 16,
          border: 'none', background: 'var(--primary)', color: '#fff', display: 'grid', placeItems: 'center',
          cursor: 'pointer'
        }}>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }}><Sparkles size={24} /></motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 12, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .97 }} transition={{ duration: .22 }}
            className="coach-panel"
            style={{
              position: 'fixed', right: 20, bottom: 86, zIndex: 61, width: 'min(380px, calc(100vw - 40px))',
              maxHeight: 'min(580px, calc(100vh - 120px))', background: 'var(--surface)',
              border: '1px solid var(--line)', borderRadius: 24, display: 'flex', flexDirection: 'column',
              overflow: 'hidden'
            }}>
            <div style={{ padding: 14, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--primary)', display: 'grid', placeItems: 'center', color: '#fff', flex: 'none' }}>
                <Sparkles size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '.92rem' }}>Coach Mei</h4>
                <p style={{ margin: 0, fontSize: '.72rem', color: 'var(--ink-3)', lineHeight: 1.3 }}>Socratic discovery mentor</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--ink-2)', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <div ref={bodyRef} style={{ padding: 14, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.18 }}
                  className={m.who === 'me' ? 'bubble-user' : 'bubble-coach'}
                  style={{ maxWidth: '85%', fontSize: '.85rem' }}>
                  {m.text}
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bubble-typing" aria-label="Coach is typing">
                  <span>·</span><span>·</span><span>·</span>
                </motion.div>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 14px 10px' }}>
              {chips.map((c) => (
                <button key={c} onClick={() => send(c)}
                  style={{ padding: '6px 11px', borderRadius: 999, background: 'var(--surface-2)', border: '1px solid var(--line)', fontSize: '.75rem', fontWeight: 600, color: 'var(--ink-2)', cursor: 'pointer' }}>{c}</button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, padding: '10px 14px', borderTop: '1px solid var(--line)' }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask or say 'give me a hint'..."
                style={{ flex: 1, border: '1.5px solid var(--line)', borderRadius: 10, background: 'var(--surface)', color: 'var(--ink)', padding: '9px 12px', fontFamily: 'inherit', fontSize: '.85rem', outline: 'none' }} />
              <button onClick={() => send()}
                style={{ width: 38, height: 38, borderRadius: 10, border: 'none', background: 'var(--primary)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <ArrowUp size={17} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function chipsFor(view) {
  if (view === 'level') return ['Give me a hint', 'Why does this matter?', 'Give me an analogy', 'Explain simply']
  if (view === 'interview') return ['How do I ask better questions?', "What's a leading question?", 'Give me an opener']
  if (view === 'capstone') return ['Is this a solution?', 'How to write a kill criterion?', 'Challenge my assumption']
  return ['Give me a hint', 'What should I focus on?', 'Explain discovery', 'Challenge me']
}

function coachReply(q, cur) {
  const l = q.toLowerCase()
  const lvl = cur.view === 'level' ? CURRICULUM.find((x) => x.id === cur.level) : null
  const sc = lvl ? lvl.screens[Math.min(cur.screen || 0, lvl.screens.length - 1)] : null
  if (/hint/.test(l)) return sc?.hint || (sc ? 'Re-read the lead and name the ONE risk this screen reduces.' : "Tell me what you're stuck on.")
  if (/leading/.test(l)) return "A leading question smuggles the answer in. Ask about a real past event: 'Tell me about the last time...'"
  if (/better|opener/.test(l)) return "Try: 'Walk me through the last time you tried to [job].' Past-tense and open."
  if (/solution/.test(l)) return "If you can imagine three ways to solve it, it's an opportunity. If it names one feature, it's a solution."
  if (/kill/.test(l)) return "A kill criterion is the number that makes you STOP. Set it BEFORE the test."
  if (/challenge|assumption/.test(l)) return "Prosecutor mode: what evidence would prove your idea WRONG?"
  if (/focus|what should/.test(l)) return "Push through levels in order. When you miss a quiz, I'll steer you back."
  if (/why/.test(l)) return sc ? `Because ${sc.lead || 'this reduces risk before building'}.` : 'Building the wrong thing is still failure.'
  if (/analogy/.test(l)) return sc?.analogy ? `${sc.analogy.title}: ${sc.analogy.body}` : 'Discovery is diagnosis before prescription.'
  if (/simply|explain/.test(l)) return sc ? `Simply: ${sc.title} is about reducing uncertainty.` : 'Discovery = deciding what to build.'
  if (/thank/.test(l)) return 'Anytime. Now go reduce some uncertainty.'
  return 'Good question. Reframe it around the four risks (value, usability, feasibility, viability). What are you trying to decide?'
}
