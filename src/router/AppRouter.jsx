import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoginScreen from '../pages/LoginScreen.jsx'
import AppLayout from '../components/layout/AppLayout.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Lesson from '../pages/Lesson.jsx'
import InterviewSim from '../pages/InterviewSim.jsx'
import Generator from '../pages/Generator.jsx'
import Challenges from '../pages/Challenges.jsx'
import Capstone from '../pages/Capstone.jsx'
import Badges from '../pages/Badges.jsx'
import NotFound from '../pages/NotFound.jsx'

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
            <Route index element={<Dashboard />} />
            <Route path="level/:id/:screen?" element={<Lesson />} />
            <Route path="interview" element={<InterviewSim />} />
            <Route path="generator" element={<Generator />} />
            <Route path="challenges" element={<Challenges />} />
            <Route path="capstone" element={<Capstone />} />
            <Route path="badges" element={<Badges />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
