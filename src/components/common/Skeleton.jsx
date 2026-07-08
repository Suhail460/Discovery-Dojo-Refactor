export default function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'var(--surface-2)',
      animation: 'shimmer 1.5s ease-in-out infinite',
      ...style
    }}>
      <style>{`@keyframes shimmer{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}`}</style>
    </div>
  )
}
