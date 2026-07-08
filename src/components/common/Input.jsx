import { forwardRef } from 'react'

const Input = forwardRef(({ multiline, label, icon, error, style, ...rest }, ref) => {
  const inputStyle = {
    width: '100%', border: '1.5px solid var(--line)', borderRadius: 'var(--r-md)',
    padding: icon ? '12px 14px 12px 40px' : '12px 14px',
    background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'inherit',
    fontSize: '1rem', transition: 'border-color .16s', outline: 'none',
    ...style
  }
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div style={{ position: 'relative' }}>
      {label && <label style={{ display: 'block', fontSize: '.74rem', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-3)', fontWeight: 700, marginBottom: 5 }}>{label}</label>}
      {icon && <span style={{ position: 'absolute', left: 14, top: multiline ? 16 : '50%', transform: multiline ? 'none' : 'translateY(-50%)', color: 'var(--ink-3)', pointerEvents: 'none' }}>{icon}</span>}
      <Tag ref={ref} style={inputStyle} {...rest} />
      {error && <div style={{ marginTop: 4, fontSize: '.82rem', color: 'var(--bad)' }}>{error}</div>}
    </div>
  )
})
Input.displayName = 'Input'
export default Input
