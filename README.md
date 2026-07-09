# Discovery Dojo

**Master Product Discovery — one level, one interview, one scenario at a time.**

Discovery Dojo is an interactive Product Discovery learning platform with 15 curriculum levels, a live AI-powered customer interview simulator, an endless scenario generator, rapid-fire challenge drills, a capstone project, and an AI coach.

Built with **React 18 + Vite + Framer Motion + Firebase + GA4**. Production-ready with Firestore sync for authenticated users and localStorage for guest mode.

---

## Features

- **15 levels** of product discovery curriculum
- **Live interview simulator** — scorecard with questioning analysis
- **Exercise generator** — randomized discovery briefs
- **Discovery challenges** — quick-fire single-question drills
- **Capstone project** — 9-stage end-to-end with feedback report
- **AI Coach** — Socratic mentor
- **Gamification** — XP, streaks, badges, skill tree, weak/strong tracking
- **Guest mode** — full access to Level 1, localStorage persistence
- **Firestore sync** — progress persists across devices for authenticated users
- **GA4 analytics** — page views, auth events, lesson tracking, quiz completions
- **Dark/light theme** — persisted preference
- **Responsive** — mobile sidebar, touch targets, bottom nav
- **Accessible** — focus-visible, ARIA labels, reduced-motion, semantic HTML
- **SEO** — Open Graph, Twitter Cards, canonical URLs, structured data, sitemap

---

## Quick start

```bash
npm install
npm run dev
# Opens http://localhost:5173
```

Build for production:

```bash
npm run build       # outputs to /dist
npm run preview     # preview the build
```

---

## Environment variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GA_MEASUREMENT_ID=
```

Without Firebase vars, guest mode works fully. Without GA4 var, analytics is a no-op.

---

## Project structure

```
src/
├── main.jsx                        # Entry point: providers
├── styles/index.css                # OKLCH design system
├── router/
│   ├── AppRouter.jsx               # Lazy routes + ErrorBoundary + Suspense
│   └── ProtectedRoute.jsx          # Auth gate with session recovery
├── context/
│   ├── AuthContext.jsx             # Auth state + Firebase integration
│   ├── ThemeContext.jsx            # Light/dark toggle
│   └── ToastContext.jsx            # Global toast notifications
├── services/
│   ├── authService.js              # Firebase Auth wrapper
│   ├── userService.js              # Firestore user/profile operations
│   └── analyticsService.js         # GA4 event tracking
├── utils/
│   ├── firebaseErrors.js           # Firebase error code → human messages
│   └── helpers.js                  # Utility functions
├── hooks/
│   ├── useStore.jsx                # Progress state (localStorage + Firestore sync)
│   ├── useNavigation.js            # React Router wrapper
│   ├── useOnlineStatus.js          # navigator.onLine tracker
│   ├── useNotifications.js         # Computed notification items
│   └── useGuestLimits.js           # Guest session limits
├── data/
│   ├── curriculum.js               # All 15 levels of content
│   └── gamedata.js                 # Badges, challenges, generator pools, personas
├── firebase/
│   └── config.js                   # Firebase initialization
├── pages/
│   ├── Dashboard.jsx               # Home: hero, stats, learning path, activity
│   ├── Lesson.jsx                  # Screen renderer from curriculum.js
│   ├── LoginScreen.jsx             # Auth gate with password strength
│   ├── InterviewSim.jsx            # Customer interview simulator + scorecard
│   ├── Generator.jsx               # Randomized scenario generator
│   ├── Challenges.jsx              # Rapid-fire drills
│   ├── Capstone.jsx                # 9-stage project + report
│   ├── Badges.jsx                  # Skill tree + badges
│   └── NotFound.jsx                # 404
└── components/
    ├── common/                     # Button, Card, Input, Spinner, Skeleton,
    │                               # EmptyState, SEO, ErrorBoundary,
    │                               # UpgradeModal, PremiumLock, Confetti
    ├── layout/                     # AppLayout, TopBar, Sidebar, BottomNav
    ├── coach/                      # AI Coach
    ├── quiz/                       # Quiz engine
    ├── diagrams/                   # Mermaid renderer
    └── gamification/               # XpRing, StreakBadge, DailyQuest
```

---

## Architecture decisions

| Concern | Choice |
|---------|--------|
| **Auth** | Firebase Auth (Google, GitHub, Email) + Guest mode |
| **Profile** | Firestore `users/{uid}` document |
| **Progress** | localStorage for speed + Firestore sync for persistence |
| **Analytics** | GA4 via custom `analyticsService.js` — no-op without env var |
| **Error handling** | Centralized `firebaseErrors.js` + `friendlyError()` |
| **Animations** | Framer Motion (reduced-motion respected) |
| **Chunking** | Automatic via Vite (lazy routes + dynamic imports) |

---

## Code quality

```bash
npm run lint          # ESLint (0 errors, 0 warnings)
npm run build         # Vite production build
npm run check         # lint + build
```

---

## License

MIT
