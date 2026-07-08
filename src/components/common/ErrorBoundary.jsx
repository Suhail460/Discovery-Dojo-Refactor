import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      const msg = this.props?.fallback || 'Something went wrong. Please try again.'
      return (
        <div role="alert" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '64px 24px', textAlign: 'center', minHeight: 320 }}>
          <AlertTriangle size={48} strokeWidth={1.5} color="var(--ink-3)" />
          <h2 style={{ fontSize: 22, fontWeight: 600 }}>{msg}</h2>
          <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()} className="btn btn-ghost btn-sm">
            <RefreshCw size={16} /> Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
