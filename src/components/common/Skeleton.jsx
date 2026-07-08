export default function Skeleton({ width = '100%', height = 20, borderRadius, style, variant }) {
  const cls = variant === 'card' ? 'skeleton skeleton-card' : variant === 'title' ? 'skeleton skeleton-title' : 'skeleton skeleton-text'
  return <div aria-hidden="true" className={cls} style={{ width, height, borderRadius, ...style }} />
}
