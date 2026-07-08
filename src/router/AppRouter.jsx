import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoginScreen from '../pages/LoginScreen.jsx'
import AppLayout from '../components/layout/AppLayout.jsx'
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
            <Route index element={<Suspense fallback={<SuspenseFallback />}><Dashboard /></Suspense>} />
            <Route path="level/:id/:screen?" element={<Suspense fallback={<SuspenseFallback />}><Lesson /></Suspense>} />
            <Route path="interview" element={<Suspense fallback={<SuspenseFallback />}><InterviewSim /></Suspense>} />
            <Route path="generator" element={<Suspense fallback={<SuspenseFallback />}><Generator /></Suspense>} />
            <Route path="challenges" element={<Suspense fallback={<SuspenseFallback />}><Challenges /></Suspense>} />
            <Route path="capstone" element={<Suspense fallback={<SuspenseFallback />}><Capstone /></Suspense>} />
            <Route path="badges" element={<Suspense fallback={<SuspenseFallback />}><Badges /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<SuspenseFallback />}><NotFound /></Suspense>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
