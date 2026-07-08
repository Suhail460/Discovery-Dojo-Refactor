import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      const msg = this.props?.fallback || 'Something went wrong. Please try again.'
      return (
        <div role="alert" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 16, padding: '64px 24px', textAlign: 'center', minHeight: 320
        }}>
          <AlertTriangle size={48} strokeWidth={1.5} opacity={0.5} />
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{msg}</h2>
          <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: 14 }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg-card)', cursor: 'pointer', fontSize: 14
            }}
          >
            <RefreshCw size={16} /> Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
