import { forwardRef } from 'react'

const Input = forwardRef(({ multiline, label, icon, error, style, ...rest }, ref) => {
  const Tag = multiline ? 'textarea' : 'input'
  const id = rest.id || rest.name
  return (
    <div style={{ position: 'relative' }}>
      {label && <label htmlFor={id} style={{ display: 'block', fontSize: '.74rem', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-3)', fontWeight: 700, marginBottom: 5 }}>{label}</label>}
      {icon && <span aria-hidden="true" style={{ position: 'absolute', left: 14, top: multiline ? 16 : '50%', transform: multiline ? 'none' : 'translateY(-50%)', color: 'var(--ink-3)', pointerEvents: 'none' }}>{icon}</span>}
      <Tag
        ref={ref}
        id={id}
        className="input"
        style={{ paddingLeft: icon ? 40 : undefined, ...style }}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && <div id={`${id}-error`} role="alert" style={{ marginTop: 4, fontSize: '.82rem', color: 'var(--bad)' }}>{error}</div>}
    </div>
  )
})
Input.displayName = 'Input'
export default Input
