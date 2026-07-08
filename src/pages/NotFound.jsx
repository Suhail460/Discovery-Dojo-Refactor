import { Link } from 'react-router-dom'
import { Compass, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: 32 }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(145deg,var(--plum),var(--accent))', display: 'grid', placeItems: 'center', color: '#fff', marginBottom: 24, transform: 'rotate(-4deg)' }}>
        <Compass size={36} />
      </div>
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
