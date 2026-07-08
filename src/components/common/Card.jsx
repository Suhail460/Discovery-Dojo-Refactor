export default function Card({ children, padding, style, className, onClick, ...rest }) {
  return (
    <div
      onClick={onClick}
      className={`card ${className || ''}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e) } : undefined}
      style={{ padding: padding ?? 24, cursor: onClick ? 'pointer' : undefined, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}
