export default function Spinner({ size = 24, color = 'var(--plum)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin .8s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="var(--line-soft)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </svg>
  )
}
