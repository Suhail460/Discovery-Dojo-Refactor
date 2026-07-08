const VARIANTS = {
  level: 'pill-level', time: 'pill-time', easy: 'pill-easy', medium: 'pill-medium', hard: 'pill-hard', done: 'pill-done',
}

export default function Badge({ variant = 'time', icon, children, style }) {
  return (
    <span className={`pill ${VARIANTS[variant] || VARIANTS.time}`} style={style}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  )
}
