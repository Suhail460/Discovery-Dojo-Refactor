import { useState } from 'react'
import { Shield, BookOpen, Users, BarChart3, Settings } from 'lucide-react'

const TABS = [
  { id: 'lessons', label: 'Lessons', icon: BookOpen },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('lessons')

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Shield size={24} color="var(--plum)" />
        <h1 style={{ fontSize: '1.6rem' }}>Admin dashboard</h1>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 12, border: '1px solid ' + (tab === t.id ? 'var(--plum-2)' : 'var(--line)'), background: tab === t.id ? 'var(--plum-wash)' : 'var(--surface)', color: tab === t.id ? 'var(--plum)' : 'var(--ink-2)', fontWeight: 700, fontSize: '.88rem', cursor: 'pointer' }}>
            <t.icon size={18} /> {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 32, minHeight: 400 }}>
        {tab === 'lessons' && <AdminLessons />}
        {tab === 'users' && <AdminUsers />}
        {tab === 'analytics' && <AdminAnalytics />}
        {tab === 'settings' && <AdminSettings />}
      </div>
    </div>
  )
}

function AdminLessons() {
  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Curriculum Manager</h3>
      <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>Edit levels, screens, quizzes, and badges. Content is managed via <code>src/data/curriculum.js</code> and <code>src/data/gamedata.js</code>.</p>
      <div style={{ display: 'grid', gap: 12 }}>
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 14, border: '1px solid var(--line)', background: 'var(--surface-2)' }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--plum-wash)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '.82rem', color: 'var(--plum)' }}>{i + 1}</span>
            <span style={{ flex: 1, fontWeight: 600 }}>Level {i + 1}</span>
            <span style={{ fontSize: '.78rem', color: 'var(--ink-3)' }}>{Math.floor(Math.random() * 8 + 3)} screens</span>
            <button style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', fontSize: '.78rem' }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminUsers() {
  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>User Management</h3>
      <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>View and manage users. Requires Firebase/Firestore to be connected.</p>
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>
        <Users size={48} color="var(--line)" style={{ marginBottom: 12 }} />
        <p>Connect Firebase Firestore to see user data here.</p>
      </div>
    </div>
  )
}

function AdminAnalytics() {
  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Analytics</h3>
      <p style={{ color: 'var(--ink-3)', marginBottom: 20 }}>Track completion rates, XP distribution, and engagement.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {[
          { label: 'Active users', value: '—', desc: 'Requires Firestore' },
          { label: 'Avg. completion', value: '—', desc: 'Requires Firestore' },
          { label: 'Total XP earned', value: '—', desc: 'Requires Firestore' },
          { label: 'Interviews run', value: '—', desc: 'Requires Firestore' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '.74rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontWeight: 700, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: '1.6rem', color: 'var(--ink-2)' }}>{s.value}</div>
            <div style={{ fontSize: '.74rem', color: 'var(--ink-3)', marginTop: 4 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminSettings() {
  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Application Settings</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { label: 'Maintenance mode', desc: 'Show maintenance page to users', type: 'toggle' },
          { label: 'Registration open', desc: 'Allow new user signups', type: 'toggle' },
          { label: 'Default XP per screen', desc: 'XP awarded for completing a screen', type: 'number' },
        ].map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 14, border: '1px solid var(--line)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: '.8rem', color: 'var(--ink-3)' }}>{s.desc}</div>
            </div>
            {s.type === 'toggle' && <div style={{ width: 44, height: 24, borderRadius: 12, background: 'var(--line)', cursor: 'pointer' }} />}
            {s.type === 'number' && <input type="number" defaultValue={20} style={{ width: 60, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--line)', textAlign: 'center', fontFamily: 'inherit' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}
