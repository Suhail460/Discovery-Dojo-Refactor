export default function Progress({ value = 0, max = 100, height = 6, color = 'var(--plum-2)', bg = 'var(--line-soft)', rounded = true, style }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div style={{ height, background: bg, borderRadius: rounded ? height : 0, overflow: 'hidden', ...style }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: rounded ? height : 0, transition: 'width .5s var(--ease-out)' }} />
    </div>
  )
}
