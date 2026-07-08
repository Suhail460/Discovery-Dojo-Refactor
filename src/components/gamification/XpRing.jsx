import { motion } from 'framer-motion'

export default function XpRing({ xp, maxXp = 500, size = 140, stroke = 12 }) {
  const pct = Math.min(xp / maxXp, 1)
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)

  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--primary)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span key={xp} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="tnum heading" style={{ fontSize: size > 120 ? '1.8rem' : '1.4rem', lineHeight: 1, color: 'var(--ink)' }}>
          {xp}
        </motion.span>
        <span style={{ fontSize: size > 120 ? '.72rem' : '.65rem', color: 'var(--ink-3)', fontWeight: 600 }}>XP</span>
      </div>
    </div>
  )
}
