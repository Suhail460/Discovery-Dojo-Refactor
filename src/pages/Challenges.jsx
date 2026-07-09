import { useState } from 'react'
import { Swords, PartyPopper, Lightbulb, Brain, Search, Target, CheckCircle, MessageCircle, RefreshCw, List, Eye, GitBranch, BarChart3, Mic, Users, Shield, HelpCircle } from 'lucide-react'
import SEO from '../components/common/SEO.jsx'
import PremiumLock from '../components/common/PremiumLock.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { CHALLENGES } from '../data/gamedata.js'
import { useStoreActions } from '../hooks/useStore.jsx'
import { trackChallengeCompleted } from '../services/analyticsService.js'

const CHALLENGE_ICONS = { brain: Brain, search: Search, target: Target, 'check-circle': CheckCircle, 'message-circle': MessageCircle, 'refresh-cw': RefreshCw, list: List, eye: Eye, 'git-branch': GitBranch, 'bar-chart-3': BarChart3, mic: Mic, users: Users, shield: Shield, 'help-circle': HelpCircle }

export default function Challenges() {
  const { user } = useAuth()
  const { update, addXP, bumpStreak, checkBadges } = useStoreActions()
  const [answered, setAnswered] = useState({})

  if (user?.provider === 'guest') {
    return <PremiumLock feature="Discovery Challenges" description="Test your product discovery knowledge with quick-fire drills on interview questions, biases, research methods, and prioritization." icon={Swords} />
  }

  function answer(id, j) {
    if (answered[id] !== undefined) return
    const c = CHALLENGES.find((x) => x.id === id)
    const ok = c.options[j].ok
    setAnswered((a) => ({ ...a, [id]: j }))
    update((s) => ({ ...s, quizWins: ok ? (s.quizWins || 0) + 1 : s.quizWins }))
    addXP(ok ? 15 : 5); bumpStreak(); setTimeout(checkBadges, 50)
    if (ok) trackChallengeCompleted(id)
  }

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <SEO title="Discovery Challenges" description="Quick-fire drills on interview questions, biases, research methods, and prioritization." />
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}><span className="pill pill-level"><Swords size={13} /> Rapid drills</span></div>
        <h1 style={{ fontSize: 'clamp(1.7rem,3.6vw,2.5rem)', marginBottom: 12 }}>Discovery Challenges</h1>
        <p className="font-serif-q" style={{ fontSize: '1.12rem', color: 'var(--ink-2)', maxWidth: '68ch' }}>Fast, single-question drills on the skills that separate good PMs from cargo-cult ones. Each one you nail earns XP.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {CHALLENGES.map((c) => {
          const Icon = CHALLENGE_ICONS[c.icon] || Swords
          const picked = answered[c.id]
          const done = picked !== undefined
          return (
            <div key={c.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}><Icon size={16} /> {c.title}</div>
              <div style={{ fontSize: '1.08rem', fontWeight: 600, marginBottom: 16 }}>{c.prompt}</div>
              {c.options.map((o, j) => {
                let bg = 'var(--surface)', bc = 'var(--line)', mk
                if (done) { if (o.ok) { bg = 'var(--ok-wash)'; bc = 'var(--ok)'; mk = 'correct' } else if (j === picked) { bg = 'var(--bad-wash)'; bc = 'var(--bad)'; mk = 'wrong' } }
                return (
                  <button key={j} disabled={done} onClick={() => answer(c.id, j)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', textAlign: 'left', padding: '14px 16px', border: '1.5px solid ' + bc, borderRadius: 14, background: bg, color: 'var(--ink)', fontSize: '.98rem', marginBottom: 10, cursor: done ? 'default' : 'pointer' }}>
                    <span style={{ width: 22, height: 22, borderRadius: 7, border: '1.5px solid ' + (mk ? bc : 'var(--line)'), flex: 'none', display: 'grid', placeItems: 'center', fontSize: '.72rem', fontWeight: 700, marginTop: 1, background: mk === 'correct' ? 'var(--ok)' : mk === 'wrong' ? 'var(--bad)' : 'transparent', color: mk ? '#fff' : 'var(--ink-3)' }}>{String.fromCharCode(65 + j)}</span>
                    <span style={{ flex: 1 }}>{o.t}</span>
                  </button>
                )
              })}
              {done && (
                <div style={{ borderRadius: 14, padding: 16, marginTop: 6, fontSize: '.95rem', background: c.options[picked].ok ? 'var(--ok-wash)' : 'var(--bad-wash)', color: 'var(--ink)' }}>
                  <h5 style={{ fontFamily: '"Bricolage Grotesque"', fontSize: '.95rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7, color: c.options[picked].ok ? 'var(--ok)' : 'var(--bad)' }}>
                    {c.options[picked].ok ? <PartyPopper size={16} /> : <Lightbulb size={16} />} {c.options[picked].ok ? 'Nailed it' : 'Not quite'}
                  </h5>
                  <div>{c.options[picked].why}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

