const VARIANTS = {
  primary: { className: 'btn-primary' },
  secondary: { className: 'btn-secondary' },
  ghost: { className: 'btn-ghost' },
}

export default function Button({ variant = 'primary', size = 'md', children, icon, disabled, onClick, type, style, className, ...rest }) {
  const v = VARIANTS[variant] || VARIANTS.primary
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''
  return (
    <button
      type={type || 'button'}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${v.className} ${sizeClass} ${className || ''}`}
      aria-disabled={disabled}
      style={style}
      {...rest}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}
