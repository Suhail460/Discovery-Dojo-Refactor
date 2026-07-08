export default function Spinner({ size = 24, color = 'var(--primary)', label = 'Loading' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" role="status" aria-label={label} style={{ animation: 'spin .8s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="var(--line-soft)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
