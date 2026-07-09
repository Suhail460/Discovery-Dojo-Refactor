import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function EmptyState({ icon: Icon, title, desc, action, actionLabel, onAction, secondaryAction, secondaryLabel, onSecondary }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: 'center', padding: '64px 16px', maxWidth: 420, margin: '0 auto' }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--primary-wash)', display: 'grid', placeItems: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
        {Icon && <Icon size={34} />}
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: '.92rem', color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: 24 }}>{desc}</p>
      {action && onAction && (
        <button className="btn btn-primary" onClick={onAction} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {actionLabel || 'Get started'} <ArrowRight size={15} />
        </button>
      )}
      {secondaryAction && onSecondary && (
        <button className="btn btn-ghost" onClick={onSecondary} style={{ marginLeft: 10 }}>
          {secondaryLabel || 'Learn more'}
        </button>
      )}
    </motion.div>
  )
}
