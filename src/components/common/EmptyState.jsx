import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, desc, action, actionLabel, onAction }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: 'center', padding: '64px 16px', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--primary-wash)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--primary)' }}>
        {Icon && <Icon size={30} />}
      </div>
      <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: '.9rem', color: 'var(--ink-3)', lineHeight: 1.5, marginBottom: 20 }}>{desc}</p>
      {action && onAction && (
        <button className="btn btn-primary" onClick={onAction}>{actionLabel || 'Get started'}</button>
      )}
    </motion.div>
  )
}
