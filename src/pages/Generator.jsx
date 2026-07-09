import { useState } from 'react'
import { Dices, Infinity as Inf, Shuffle, Mic, ListChecks } from 'lucide-react'
import { GEN } from '../data/gamedata.js'
import { useStoreActions } from '../hooks/useStore.jsx'
import { pick, cap } from '../utils/helpers.js'
import SEO from '../components/common/SEO.jsx'
import { useGuestLimits } from '../hooks/useGuestLimits.js'
import { EmptyState } from '../components/common/index.js'
import { useNavigation } from '../hooks/useNavigation.js'

export default function Generator() {
  const nav = useNavigation()
  const { update, addXP, bumpStreak, checkBadges } = useStoreActions()
  const { getRemaining, consumeOne } = useGuestLimits()
  const [g, setG] = useState(null)

  function generate() {
    if (!consumeOne('generator')) { return }
    setG({ company: pick(GEN.company), problem: pick(GEN.problem), customer: pick(GEN.customer), market: pick(GEN.market), competition: pick(GEN.competition), budget: pick(GEN.budget), time: pick(GEN.time), team: pick(GEN.team), diff: pick(GEN.diff) })
    update((s) => ({ ...s, generated: (s.generated || 0) + 1 })); addXP(10); bumpStreak(); setTimeout(checkBadges, 50)
  }

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <SEO title="Exercise Generator" description="Generate randomized product discovery scenarios. Practice assumptions, research plans, and experiment design." />
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <span className="pill pill-level"><Dices size={13} /> Practice tool</span>
          <span className="pill pill-time"><Inf size={13} /> {getRemaining('generator') < Infinity ? `${getRemaining('generator')}/3 today` : 'Unlimited scenarios'}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.7rem,3.6vw,2.5rem)', marginBottom: 12 }}>Discovery Exercise Generator</h1>
        <p className="font-serif-q" style={{ fontSize: '1.12rem', color: 'var(--ink-2)', maxWidth: '68ch' }}>Spin up a randomized, realistic discovery brief. Then work the loop against it: assumptions, research plan, an interview, opportunities, an experiment, and a recommendation.</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={generate}><Shuffle size={16} /> Generate a scenario</button>
        {g && <button className="btn btn-ghost" onClick={() => nav.go('interview')}><Mic size={16} /> Interview a customer for this</button>}
      </div>

      {g ? (
        <div className="card fade-in" style={{ padding: 32 }}>
          <h3 style={{ fontFamily: '"Bricolage Grotesque"', fontSize: '1.4rem', marginBottom: 4 }}>You&apos;re a PM at {g.company}.</h3>
          <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>Difficulty: {g.diff}. Work this brief like it&apos;s Monday morning.</p>
          <Row k="The problem" big>{cap(g.problem)}.</Row>
          <Row k="Who&apos;s affected">{cap(g.customer)}</Row>
          <Row k="Market stage">{cap(g.market)}</Row>
          <Row k="Competition">{cap(g.competition)}</Row>
          <Row k="Budget">{cap(g.budget)}</Row>
          <Row k="Timeline">{cap(g.time)}</Row>
          <Row k="Team">{cap(g.team)}</Row>
          <div style={{ marginTop: 24, padding: 18, background: 'var(--primary-wash)', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}><ListChecks size={16} /> Your task</div>
            <ul className="prose-q" style={{ fontSize: '.98rem' }}>
              <li>List the 3 riskiest assumptions and pick which to test first.</li>
              <li>Choose a research method that fits your <b>{g.time}</b> and <b>{g.budget}</b>.</li>
              <li>Run one interview in the simulator with a matching persona.</li>
              <li>Write one opportunity statement in the customer&apos;s voice.</li>
              <li>Design the cheapest experiment that could kill the idea.</li>
            </ul>
          </div>
        </div>
      ) : (
        <EmptyState icon={Dices} title="Ready to practice?" desc="Generate a randomized product discovery scenario and work through the full discovery loop." action actionLabel="Generate first scenario" onAction={generate} />
      )}
    </div>
  )
}
function Row({ k, children, big }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px dashed var(--line-soft)' }}>
      <span style={{ width: 130, flex: 'none', fontSize: '.76rem', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-3)', fontWeight: 700, paddingTop: 2 }}>{k}</span>
      <span className={big ? 'font-serif-q' : ''} style={{ fontSize: big ? '1.15rem' : '1.02rem', color: 'var(--ink)', fontWeight: big ? 400 : 500 }}>{children}</span>
    </div>
  )
}
