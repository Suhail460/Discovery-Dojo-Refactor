import { Link } from 'react-router-dom'
import { Compass, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-icon" style={{ background: 'var(--primary-wash)', color: 'var(--primary)', border: '2px solid var(--primary)' }}><Compass size={36} /></div>
      <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: 12 }}>Page not found</h1>
      <p className="font-serif-q" style={{ fontSize: '1.12rem', color: 'var(--ink-2)', maxWidth: 480, marginBottom: 32 }}>
        This path doesn&apos;t lead anywhere in the Dojo. Let&apos;s get you back to learning.
      </p>
      <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
        <ArrowLeft size={17} /> Back to Dashboard
      </Link>
    </div>
  )
}
