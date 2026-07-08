import { motion } from 'framer-motion'

export default function XpRing({ xp, maxXp = 500, size = 160, stroke = 14 }) {
  const pct = Math.min(xp / maxXp, 1)
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)

  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-soft)" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#xpGrad)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        <defs>
          <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--plum)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span key={xp} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="tnum" style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: size > 140 ? '2.2rem' : '1.6rem', lineHeight: 1, color: 'var(--ink)' }}>
          {xp}
        </motion.span>
        <span style={{ fontSize: size > 140 ? '.78rem' : '.68rem', color: 'var(--ink-3)', fontWeight: 600 }}>XP</span>
      </div>
    </div>
  )
}
