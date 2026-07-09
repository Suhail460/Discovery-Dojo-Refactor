import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = ['var(--primary)', 'var(--ok)', 'var(--amber)', 'var(--blue)', 'var(--coral)', '#8B5CF6', '#EC4899']
const SHAPES = ['circle', 'square']

function piece(id) {
  const c = COLORS[Math.floor(Math.random() * COLORS.length)]
  const s = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  return { id, x: Math.random() * 100, delay: Math.random() * 0.3, color: c, shape: s, size: 6 + Math.random() * 6, rotation: Math.random() * 360 }
}

export default function Confetti({ active, duration = 2000 }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!active) { setPieces([]); return }
    const p = Array.from({ length: 40 }, (_, i) => piece(i))
    setPieces(p)
    const t = setTimeout(() => setPieces([]), duration)
    return () => clearTimeout(t)
  }, [active, duration])

  if (pieces.length === 0) return null

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }} aria-hidden="true">
      <AnimatePresence>
        {pieces.map((p) => (
          <motion.div key={p.id}
            initial={{ x: `${p.x}vw`, y: -20, rotate: 0, opacity: 1, scale: 0 }}
            animate={{ y: '100vh', rotate: p.rotation + 360, opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 + Math.random() * 0.5, delay: p.delay, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: 'absolute', width: p.size, height: p.shape === 'square' ? p.size : p.size,
              borderRadius: p.shape === 'circle' ? '50%' : 2,
              background: p.color, top: 0
            }} />
        ))}
      </AnimatePresence>
    </div>
  )
}
