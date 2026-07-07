import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { useTheme } from '../context/ThemeContext.jsx'

let idc = 0

/** Renders a Mermaid diagram from a code string, re-rendering on theme change.
 *  Falls back to showing the raw code if Mermaid fails to parse. */
export default function Mermaid({ code, caption }) {
  const { theme } = useTheme()
  const ref = useRef(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    let cancelled = false
    setErr(false)
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'neutral',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    })
    const id = 'mmd_' + (idc++)
    mermaid.render(id, code)
      .then(({ svg }) => { if (!cancelled && ref.current) ref.current.innerHTML = svg })
      .catch(() => { if (!cancelled) setErr(true) })
    return () => { cancelled = true }
  }, [code, theme])

  return (
    <div>
      <div className="card mermaid-wrap" style={{ padding: 24, overflowX: 'auto' }}>
        {err
          ? <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '.8rem', color: 'var(--ink-2)', whiteSpace: 'pre-wrap', margin: 0 }}>{code}</pre>
          : <div ref={ref} />}
      </div>
      {caption && (
        <div style={{ fontSize: '.8rem', color: 'var(--ink-3)', marginTop: 12, textAlign: 'center', fontStyle: 'italic', fontFamily: '"Newsreader", Georgia, serif' }}>
          {caption}
        </div>
      )}
    </div>
  )
}
