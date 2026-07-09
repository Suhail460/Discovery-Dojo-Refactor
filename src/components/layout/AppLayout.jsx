import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import BottomNav from './BottomNav.jsx'
import Coach from '../coach/Coach.jsx'
import { useStore } from '../../hooks/useStore.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useNavigation } from '../../hooks/useNavigation.js'
import { trackPageView } from '../../services/analyticsService.js'

export default function AppLayout() {
  const store = useStore()
  const { toast } = useToast()
  const nav = useNavigation(toast)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [coachOpen, setCoachOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { trackPageView(location.pathname, document.title) }, [location.pathname])

  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  const view = nav.current.view
  const showBottomNav = view !== 'level'

  function reset() {
    if (!window.confirm("Reset all progress, XP, badges, interviews, and capstone? This can't be undone.")) return
    store.reset(); nav.go('home'); toast('Progress reset. Fresh start.', 'rotate-ccw')
  }

  return (
    <div className="app-shell">
      <Sidebar nav={nav} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onReset={reset} />
      <div className="app-main">
        <TopBar nav={nav} onMenu={() => setSidebarOpen(true)} onCoachToggle={() => setCoachOpen((o) => !o)} />
        <main className="app-content">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        {showBottomNav && <BottomNav nav={nav} view={view} />}
      </div>
      <Coach nav={nav} open={coachOpen} onClose={() => setCoachOpen(false)} />
    </div>
  )
}
