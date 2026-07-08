import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import Coach from '../coach/Coach.jsx'
import { useStore } from '../../hooks/useStore.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useNavigation } from '../../hooks/useNavigation.js'

export default function AppLayout() {
  const store = useStore()
  const { toast } = useToast()
  const nav = useNavigation(toast)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  function reset() {
    if (!window.confirm("Reset all progress, XP, badges, interviews, and capstone? This can't be undone.")) return
    store.reset(); nav.go('home'); toast('Progress reset. Fresh start.', 'rotate-ccw')
  }

  return (
    <div className="app-grid" style={{ display: 'grid', gridTemplateColumns: '296px 1fr', minHeight: '100vh' }}>
      <Sidebar nav={nav} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onReset={reset} />
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar nav={nav} onMenu={() => setSidebarOpen(true)} />
        <main style={{ padding: 'clamp(20px,4vw,52px) clamp(16px,4vw,40px)', width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Coach nav={nav} />
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
