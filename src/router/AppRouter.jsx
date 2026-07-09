import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout.jsx'
import ErrorBoundary from '../components/common/ErrorBoundary.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import { Skeleton } from '../components/common/index.js'

const Dashboard = lazy(() => import('../pages/Dashboard.jsx'))
const Lesson = lazy(() => import('../pages/Lesson.jsx'))
const InterviewSim = lazy(() => import('../pages/InterviewSim.jsx'))
const Generator = lazy(() => import('../pages/Generator.jsx'))
const Challenges = lazy(() => import('../pages/Challenges.jsx'))
const Capstone = lazy(() => import('../pages/Capstone.jsx'))
const Badges = lazy(() => import('../pages/Badges.jsx'))
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard.jsx'))
const NotFound = lazy(() => import('../pages/NotFound.jsx'))

function SuspenseFallback() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '40px clamp(16px,4vw,40px)', maxWidth: 900, margin: '0 auto' }}>
      <Skeleton variant="title" width="60%" height={36} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        <Skeleton variant="card" height={120} /><Skeleton variant="card" height={120} /><Skeleton variant="card" height={120} />
      </div>
      <Skeleton variant="card" height={200} />
      <Skeleton height={80} />
    </div>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route element={<AppLayout />}>
            <Route index element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Dashboard /></Suspense></ErrorBoundary>} />
            <Route path="level/:id/:screen?" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Lesson /></Suspense></ErrorBoundary>} />
            <Route path="interview" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><InterviewSim /></Suspense></ErrorBoundary>} />
            <Route path="generator" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Generator /></Suspense></ErrorBoundary>} />
            <Route path="challenges" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Challenges /></Suspense></ErrorBoundary>} />
            <Route path="capstone" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Capstone /></Suspense></ErrorBoundary>} />
            <Route path="badges" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><Badges /></Suspense></ErrorBoundary>} />
            <Route path="admin" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><AdminDashboard /></Suspense></ErrorBoundary>} />
            <Route path="*" element={<ErrorBoundary><Suspense fallback={<SuspenseFallback />}><NotFound /></Suspense></ErrorBoundary>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
