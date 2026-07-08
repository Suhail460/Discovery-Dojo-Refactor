import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ArrowUp } from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum.js'

/* Socratic coach. Rule-based, context-aware replies. It nudges rather than
   hands over answers. Swap coachReply() for an LLM API call to go live. */
export default function Coach({ nav }) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ who: 'bot', text: "Hey, I'm Mei, your discovery coach. I won't just hand you answers, I'll nudge your thinking. Ask me anything, or tap a prompt below." }])
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight }, [msgs, open])

  const chips = chipsFor(nav.current.view)
  function send(text) {
    const t = (text ?? input).trim(); if (!t) return
    setMsgs((m) => [...m, { who: 'me', text: t }])
    setInput('')
    setTimeout(() => setMsgs((m) => [...m, { who: 'bot', text: coachReply(t, nav.current) }]), 260)
  }

  return (
    <>
      <button onClick={() => setOpen(!open)} title="Ask your AI coach"
        style={{ position: 'fixed', right: 22, bottom: 22, zIndex: 60, width: 58, height: 58, borderRadius: 18, border: 'none', background: 'linear-gradient(145deg,var(--plum),var(--accent))', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: 'var(--sh-lg)', cursor: 'pointer' }}>
        <Sparkles size={26} />
        <span style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, background: 'var(--gold)', borderRadius: '50%', border: '2px solid var(--bg)', fontSize: '.6rem', color: '#000', display: 'grid', placeItems: 'center', fontWeight: 800 }}>?</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .98 }} transition={{ duration: .25 }}
            style={{ position: 'fixed', right: 22, bottom: 92, zIndex: 61, width: 'min(390px, calc(100vw - 44px))', maxHeight: 'min(620px, calc(100vh - 130px))', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 30, boxShadow: 'var(--sh-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: 16, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(180deg,var(--plum-wash),transparent)' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(145deg,var(--plum),var(--accent))', display: 'grid', placeItems: 'center', color: '#fff' }}><Sparkles size={20} /></div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem' }}>Coach Mei</h4>
                <p style={{ margin: 0, fontSize: '.76rem', color: 'var(--ink-3)' }}>Your Socratic discovery mentor</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface)', display: 'grid', placeItems: 'center', color: 'var(--ink-2)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div ref={bodyRef} style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 14, fontSize: '.9rem', lineHeight: 1.5, maxWidth: '90%', alignSelf: m.who === 'me' ? 'flex-end' : 'flex-start', background: m.who === 'me' ? 'var(--plum)' : 'var(--surface-2)', color: m.who === 'me' ? '#fff' : 'var(--ink)', borderBottomRightRadius: m.who === 'me' ? 4 : 14, borderBottomLeftRadius: m.who === 'me' ? 14 : 4 }}>{m.text}</div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, padding: '0 16px 12px' }}>
              {chips.map((c) => (
                <button key={c} onClick={() => send(c)} style={{ padding: '7px 12px', borderRadius: 999, background: 'var(--surface-2)', border: '1px solid var(--line)', fontSize: '.78rem', fontWeight: 600, color: 'var(--ink-2)', cursor: 'pointer' }}>{c}</button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderTop: '1px solid var(--line)' }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask, or say 'give me a hint'..." style={{ flex: 1, border: '1.5px solid var(--line)', borderRadius: 12, background: 'var(--surface)', color: 'var(--ink)', padding: '10px 14px', fontFamily: 'inherit', fontSize: '.9rem' }} />
              <button onClick={() => send()} style={{ width: 42, height: 42, borderRadius: 12, border: 'none', background: 'var(--plum)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><ArrowUp size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function chipsFor(view) {
  if (view === 'level') return ['Give me a hint on this screen', 'Why does this matter?', 'Give me an analogy', 'Explain this simply']
  if (view === 'interview') return ['How do I ask better questions?', "What's a leading question?", 'Give me an opener']
  if (view === 'capstone') return ['Is my opportunity a solution in disguise?', 'How do I write a kill criterion?', 'Challenge my assumption']
  return ['Give me a hint', 'What should I focus on?', 'Explain product discovery', 'Challenge my thinking']
}

function coachReply(q, cur) {
  const l = q.toLowerCase()
  const lvl = cur.view === 'level' ? CURRICULUM.find((x) => x.id === cur.level) : null
  const sc = lvl ? lvl.screens[Math.min(cur.screen || 0, lvl.screens.length - 1)] : null

  if (/hint/.test(l)) return sc?.hint || (sc ? `Re-read the lead line and name the ONE risk this screen reduces before you answer the quiz.` : "Tell me what you're stuck on and I'll nudge, not solve.")
  if (/leading question|leading/.test(l)) return "A leading question smuggles the answer in: 'Don't you hate when X?'. Strip your opinion and ask about a real past event: 'Tell me about the last time X happened.'"
  if (/better question|ask better|opener/.test(l)) return "Openers that work: 'Walk me through the last time you tried to [job].' 'What did you do right before that?' All past-tense and open. Try one."
  if (/solution in disguise|opportunity/.test(l)) return "Test it fast: can you imagine three different ways to solve it? If yes, it's an opportunity. If it names one feature, it's a solution."
  if (/kill criterion|kill|threshold/.test(l)) return "A kill criterion is the number that makes you STOP. 'We scale if X% do Y; we kill it if fewer than Z%.' Set it BEFORE the test."
  if (/challenge|assumption/.test(l)) return "Prosecutor mode: what evidence would prove your idea WRONG? If you can't name it, you're seeking applause, not testing."
  if (/focus|weak|what should/.test(l)) return "Push through the levels in order. When you miss a quiz, I'll steer you back to that topic."
  if (/why.*matter|why does/.test(l)) return sc ? `Because ${sc.lead || 'this reduces a specific risk before you spend engineering weeks'}.` : 'Building the wrong thing well is still failure. Cheaper to learn than to ship blind.'
  if (/analogy/.test(l)) return sc?.analogy ? `${sc.analogy.title}: ${sc.analogy.body}` : 'Discovery is diagnosis before prescription.'
  if (/simply|explain|eli5/.test(l)) return sc ? `Simply: ${sc.title} is about ${(sc.lead || '').toLowerCase() || 'reducing uncertainty before you build'}.` : 'Discovery = deciding what to build. Delivery = building it well.'
  if (/thank/.test(l)) return 'Anytime. Now go reduce some uncertainty.'
  return 'Good question. Reframe it around the four risks (value, usability, feasibility, viability) and it usually gets sharper. What are you trying to decide?'
}
