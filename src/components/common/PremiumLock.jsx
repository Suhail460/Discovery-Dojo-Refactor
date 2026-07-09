import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import UpgradeModal from './UpgradeModal.jsx'

export default function PremiumLock({ feature, description, icon: Icon }) {
  const { user } = useAuth()
  const [show, setShow] = useState(false)

  if (user?.provider !== 'guest') return null

  return (
    <div className="fade-in" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', paddingTop: 'clamp(48px,10vh,120px)' }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', margin: '0 auto 20px', color: 'var(--ink-3)' }}>
        {Icon ? <Icon size={36} /> : <Lock size={36} />}
      </div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: 10 }}>{feature}</h2>
      <p style={{ color: 'var(--ink-3)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '36ch', margin: '0 auto 28px' }}>{description}</p>
      <button className="btn btn-primary" onClick={() => setShow(true)} style={{ padding: '14px 32px', fontSize: '1rem' }}>
        Unlock with Premium
      </button>
      <UpgradeModal open={show} onClose={() => setShow(false)} />
    </div>
  )
}
