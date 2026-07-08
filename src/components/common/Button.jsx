export default function Button({ variant = 'primary', size = 'md', children, icon, disabled, onClick, type, style, className, ...rest }) {
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    plum: { background: 'var(--plum)', color: '#fff' },
    ghost: { background: 'transparent', borderColor: 'var(--line)', color: 'var(--ink-2)' }
  }
  const sizes = {
    sm: { padding: '8px 14px', fontSize: '.84rem' },
    md: { padding: '11px 20px', fontSize: '.92rem' }
  }
  const v = variants[variant] || variants.primary
  const s = sizes[size] || sizes.md
  return (
    <button
      type={type || 'button'}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        borderRadius: 'var(--r-md)', border: '1.5px solid transparent', fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .18s var(--ease-quart)',
        opacity: disabled ? .45 : 1, boxShadow: variant === 'ghost' ? 'none' : 'var(--sh-sm)',
        ...v, ...s, ...style
      }}
      {...rest}
    >
      {icon} {children}
    </button>
  )
}
