# Discovery Dojo — Architecture

## Overview

Discovery Dojo is a single-page application built with React 18, Vite, Firebase, and Framer Motion. It implements a self-paced product discovery curriculum with gamification, simulated interviews, and AI coaching.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 with hooks |
| Build | Vite 8 |
| Routing | React Router v7 (lazy routes) |
| Animation | Framer Motion |
| Auth | Firebase Auth (Google, GitHub, Email) |
| Database | Firestore (users collection) |
| Persistence | localStorage (primary) + Firestore (sync) |
| Analytics | Google Analytics 4 (optional, env-gated) |
| Styling | OKLCH design tokens + Tailwind 3 (minimal) |
| Icons | Lucide React |
| Diagrams | Mermaid 11 |
| Lint | ESLint 9 + react-hooks + react-refresh |

---

## Project Structure

```
src/
├── main.jsx                 # Entry: providers
├── styles/index.css         # OKLCH design system
├── router/
│   ├── AppRouter.jsx        # Lazy routes, Suspense, ErrorBoundary
│   └── ProtectedRoute.jsx   # Auth gate with session recovery
├── context/
│   ├── AuthContext.jsx       # Auth state + service orchestration
│   ├── ThemeContext.jsx      # Light/dark toggle
│   └── ToastContext.jsx      # Global toast notifications
├── services/
│   ├── authService.js        # Firebase Auth wrapper
│   ├── userService.js        # Firestore operations
│   └── analyticsService.js   # GA4 event tracking
├── utils/
│   ├── firebaseErrors.js     # Error code mapping
│   └── helpers.js            # Utility functions
├── hooks/
│   ├── useStore.jsx          # Progress state + Firestore sync
│   ├── useNavigation.js      # Router wrapper
│   ├── useOnlineStatus.js    # Online/offline detection
│   ├── useNotifications.js   # Notification items
│   └── useGuestLimits.js     # Guest session limits
├── data/
│   ├── curriculum.js         # 15 levels of content
│   └── gamedata.js           # Badges, challenges, etc.
├── firebase/
│   └── config.js             # Firebase init
├── pages/
│   ├── Dashboard.jsx         # Home: progress, stats, learning path
│   ├── Lesson.jsx            # Screen renderer
│   ├── LoginScreen.jsx       # Auth gate
│   ├── InterviewSim.jsx      # Interview simulator
│   ├── Generator.jsx         # Scenario generator
│   ├── Challenges.jsx        # Drills
│   ├── Capstone.jsx          # 9-stage project
│   ├── Badges.jsx            # Skill tree + badges
│   └── NotFound.jsx          # 404
└── components/
    ├── common/               # Button, Card, Spinner, SEO, etc.
    ├── layout/               # AppLayout, TopBar, Sidebar, BottomNav
    ├── coach/                # AI Coach
    ├── quiz/                 # Quiz engine
    ├── diagrams/             # Mermaid renderer
    └── gamification/         # XpRing, StreakBadge, DailyQuest
```

---

## Data Flow

### Auth Flow
```
User → LoginScreen → AuthContext.loginWithProvider()
  → authService.loginWithProvider() → Firebase Auth
  → userService.ensureUserDocument() → Firestore
  → userService.mergeGuestProgress() (if was guest)
  → setUser() → re-render → ProtectedRoute allows children
```

### Progress Flow
```
Lesson.jsx → complete()
  → update() → useStore setState (immediate)
  → useEffect → localStorage.setItem() (800ms debounce)
  → syncProgressToFirestore() → Firestore (auth users only)
  → checkBadges() → BADGES check → achievements → analytics
```

### Analytics Flow
```
AppLayout → trackPageView() on route change
Lesson → trackLessonStarted() on mount
Lesson → trackLessonCompleted() on complete
Lesson → trackQuizCompleted() on quiz result
AuthContext → trackLogin/Signup/Logout/GuestLogin
```

---

## State Management

No external state library. Uses React Context + useReducer pattern:

- **AuthContext** — user, ready, error, auth actions
- **ThemeContext** — theme, toggle
- **ToastContext** — global toast queue
- **useStore (ProgressProvider)** — all learning state, split into StateContext (re-renders) and ActionsContext (stable refs)

The useStore split prevents components that only call actions (e.g., InterviewSim) from re-rendering when state changes.

---

## Persistence Strategy

| User Type | Primary Storage | Sync |
|-----------|----------------|------|
| Guest | localStorage | None |
| Authenticated | localStorage | Firestore (debounced 800ms) |

On mount, authenticated users load from Firestore with localStorage as fallback. This ensures fast local reads while maintaining cross-device sync.

---

## Learning Engine

The learning engine tracks:

- **Completed screens** → `completed[]` array of `"level.screen"` IDs
- **XP** → numeric, awarded for lessons (20), quizzes (5-15), reflections (5), interviews (30+), exercises (10)
- **Streak** → consecutive days with activity, tracked via `lastActive`
- **Level unlock** → all screens in level N must be completed to unlock N+1
- **Mastery %** → `(completed.length / totalScreens) * 100`
- **Resume position** → `{ level, screen, timestamp }` saved on each lesson visit
- **Learning time** → session timer, accumulated on unmount
- **Daily log** → `{ "YYYY-MM-DD": count }` tracked per day
- **Badges** → 14 badges checked via state conditions
- **Achievements** → 11 achievements checked via state conditions
- **Weak/Strong** → topics flagged based on quiz performance
- **Bookmarks** → persisted screens array
