export default function Progress({ value = 0, max = 100, height, color, bg, style }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  return (
    <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} style={{ height: height ?? undefined, background: bg, ...style }}>
      <div className="progress-fill" style={{ width: `${pct}%`, background: color ?? undefined }} />
    </div>
  )
}
