export default function Card({ children, padding = 24, hover, style, className, onClick, ...rest }) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-sm)',
        padding, transition: 'all .2s var(--ease-out)', cursor: onClick ? 'pointer' : undefined,
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
