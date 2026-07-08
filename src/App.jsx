import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { useAuth } from './context/AuthContext.jsx'
import { useStore } from './hooks/useStore.jsx'
import LoginScreen from './pages/LoginScreen.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import TopBar from './components/layout/TopBar.jsx'
import Coach from './components/coach/Coach.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Lesson from './pages/Lesson.jsx'
import InterviewSim from './pages/InterviewSim.jsx'
import Generator from './pages/Generator.jsx'
import Challenges from './pages/Challenges.jsx'
import Capstone from './pages/Capstone.jsx'
import Badges from './pages/Badges.jsx'

const toPascal = (s) => s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')

export default function App() {
  const { ready, isAuthed } = useAuth()
  const store = useStore()
  const [current, setCurrent] = useState({ view: 'home', level: null, screen: 0 })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, icon = 'sparkles') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg, icon }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  const nav = {
    current,
    go: (view) => { setCurrent({ view, level: null, screen: 0 }); setSidebarOpen(false); window.scrollTo(0, 0) },
    openLevel: (lvl) => {
      if (!store.isUnlocked(lvl)) { toast('Finish the previous level to unlock this.', 'lock'); return }
      let idx = 0, n = store.levelScreens(lvl)
      for (let i = 0; i < n; i++) { if (!store.state.completed.includes(store.screenId(lvl, i))) { idx = i; break } if (i === n - 1) idx = i }
      setCurrent({ view: 'level', level: lvl, screen: idx }); setSidebarOpen(false); window.scrollTo(0, 0)
    },
    gotoScreen: (idx) => setCurrent((c) => ({ ...c, screen: idx }))
  }

  function reset() {
    if (!window.confirm("Reset all progress, XP, badges, interviews, and capstone? This can't be undone.")) return
    store.reset(); nav.go('home'); toast('Progress reset. Fresh start.', 'rotate-ccw')
  }

  if (!ready) return null
  if (!isAuthed) return <LoginScreen />

  const view = current.view
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '296px 1fr', minHeight: '100vh' }} className="app-grid">
      <Sidebar nav={nav} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onReset={reset} />
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar nav={nav} onMenu={() => setSidebarOpen(true)} />
        <main style={{ padding: 'clamp(20px,4vw,52px) clamp(16px,4vw,40px)', width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div key={view + (current.level || '') + (current.screen || '')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}>
              {view === 'home' && <Dashboard nav={nav} />}
              {view === 'level' && <Lesson nav={nav} toast={toast} />}
              {view === 'interview' && <InterviewSim toast={toast} />}
              {view === 'generator' && <Generator nav={nav} toast={toast} />}
              {view === 'challenges' && <Challenges toast={toast} />}
              {view === 'capstone' && <Capstone nav={nav} toast={toast} />}
              {view === 'badges' && <Badges nav={nav} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Coach nav={nav} />

      {/* Toasts */}
      <div style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 80, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', pointerEvents: 'none' }}>
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = Icons[toPascal(t.icon)] || Sparkles
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '12px 20px', borderRadius: 14, fontWeight: 600, fontSize: '.9rem', boxShadow: 'var(--sh-lg)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={18} color="var(--gold)" /> {t.msg}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width:1000px){
          .app-grid{ grid-template-columns:1fr !important }
          .sidebar{ position:fixed; left:0; top:0; width:300px; height:100vh; transform:translateX(-100%); transition:transform .35s cubic-bezier(0.16,1,0.3,1); box-shadow:var(--sh-lg) }
          .sidebar.open{ transform:translateX(0) }
        }
        @media (min-width:1001px){
          .sidebar{ position:sticky; top:0; height:100vh }
          .sb-scrim{ display:none !important }
        }
        @media (max-width:560px){ .chip-hide-sm{ display:none !important } }
      `}</style>
    </div>
  )
}
