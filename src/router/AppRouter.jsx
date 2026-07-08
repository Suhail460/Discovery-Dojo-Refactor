import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoginScreen from '../pages/LoginScreen.jsx'
import AppLayout from '../components/layout/AppLayout.jsx'
import ErrorBoundary from '../components/common/ErrorBoundary.jsx'
import { Spinner } from '../components/common/index.js'

const Dashboard = lazy(() => import('../pages/Dashboard.jsx'))
const Lesson = lazy(() => import('../pages/Lesson.jsx'))
const InterviewSim = lazy(() => import('../pages/InterviewSim.jsx'))
const Generator = lazy(() => import('../pages/Generator.jsx'))
const Challenges = lazy(() => import('../pages/Challenges.jsx'))
const Capstone = lazy(() => import('../pages/Capstone.jsx'))
const Badges = lazy(() => import('../pages/Badges.jsx'))
const NotFound = lazy(() => import('../pages/NotFound.jsx'))

function SuspenseFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Spinner size={36} />
    </div>
  )
}

function AuthGuard() {
  const { ready, isAuthed } = useAuth()
  if (!ready) return null
  if (!isAuthed) return <LoginScreen />
  return <Outlet />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route index element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Dashboard /></Suspense></ErrorBoundary>} />
            <Route path="level/:id/:screen?" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Lesson /></Suspense></ErrorBoundary>} />
            <Route path="interview" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><InterviewSim /></Suspense></ErrorBoundary>} />
            <Route path="generator" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Generator /></Suspense></ErrorBoundary>} />
            <Route path="challenges" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Challenges /></Suspense></ErrorBoundary>} />
            <Route path="capstone" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Capstone /></Suspense></ErrorBoundary>} />
            <Route path="badges" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Badges /></Suspense></ErrorBoundary>} />
            <Route path="*" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><NotFound /></Suspense></ErrorBoundary>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
