const VARIANTS = {
  lvl: { bg: 'var(--plum-wash)', c: 'var(--plum)' },
  time: { bg: 'var(--surface-2)', c: 'var(--ink-2)' },
  d1: { bg: 'var(--ok-wash)', c: 'var(--ok)' },
  d2: { bg: 'var(--gold-wash)', c: 'var(--gold-ink)' },
  d3: { bg: 'var(--bad-wash)', c: 'var(--bad)' },
  accent: { bg: 'var(--accent-wash)', c: 'var(--accent-ink)' },
  plum: { bg: 'var(--plum-wash)', c: 'var(--plum)' },
  ok: { bg: 'var(--ok-wash)', c: 'var(--ok)' }
}

export default function Badge({ variant = 'time', icon, children, style }) {
  const v = VARIANTS[variant] || VARIANTS.time
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 11px', borderRadius: 999, fontSize: '.72rem',
      fontWeight: 700, letterSpacing: '.03em',
      background: v.bg, color: v.c, ...style
    }}>
      {icon} {children}
    </span>
  )
}
