# Discovery Dojo

[![CI](https://github.com/anomalyco/discovery-dojo/actions/workflows/ci.yml/badge.svg)](https://github.com/anomalyco/discovery-dojo/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black)](https://discoverydojo.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Master Product Discovery — one level, one interview, one scenario at a time.**

Discovery Dojo is an interactive Product Discovery learning platform. 15 curriculum levels, a live AI-powered customer interview simulator, an endless scenario generator, rapid-fire challenge drills, a capstone project, and an AI coach — all wrapped in a polished, responsive SPA.

Built with **React 18 + Vite + Framer Motion + Mermaid + OKLCH design tokens**. Zero backend required for demo mode. Swap in Firebase / Clerk / Supabase for real auth and cross-device sync.

---

## Features

- **15 levels** of product discovery curriculum — from opportunity trees to experiment design
- **Live interview simulator** — build a customer persona, interview them, get scored on your questioning technique
- **Exercise generator** — randomized discovery briefs to practice against
- **Discovery challenges** — quick-fire single-question drills
- **Capstone project** — 9-stage end-to-end discovery with feedback report
- **AI Coach "Mei"** — Socratic mentor that nudges your thinking
- **Gamification** — XP, streaks, badges, skill tree, weak/strong topic tracking
- **Dark mode**, progress export/import, per-account localStorage persistence
- **Responsive** — mobile drawer sidebar, touch-friendly targets
- **Accessible** — focus-visible, ARIA labels, reduced-motion support, semantic HTML
- **SEO** — per-page meta tags via react-helmet-async, sitemap, robots.txt

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

The `/dist` folder is a static site — deploy to Vercel, Netlify, Cloudflare Pages, or any static host.

---

## Project structure

```
src/
├── main.jsx                        # Entry point: providers + Analytics
├── styles/index.css                # OKLCH design system + responsive utilities
├── router/
│   └── AppRouter.jsx               # Lazy routes + ErrorBoundary + Suspense
├── context/
│   ├── AuthContext.jsx             # Login control (demo / Firebase / Clerk / Supabase)
│   ├── ThemeContext.jsx            # Light/dark toggle
│   └── ToastContext.jsx            # Global toast notifications
├── hooks/
│   ├── useStore.jsx                # Per-user progress (XP, completed, badges, streak)
│   └── useNavigation.js           # React Router wrapper (go, openLevel, gotoScreen)
├── data/
│   ├── curriculum.js               # All 15 levels of content
│   └── gamedata.js                 # Badges, challenges, generator pools, personas
├── pages/
│   ├── Dashboard.jsx               # Home: metrics, quick actions, learning path
│   ├── Lesson.jsx                  # Renders any screen from curriculum.js
│   ├── InterviewSim.jsx            # Customer interview simulator + scorecard
│   ├── Generator.jsx               # Randomized scenario generator
│   ├── Challenges.jsx              # Rapid-fire drills
│   ├── Capstone.jsx                # 9-stage project + feedback report
│   ├── Badges.jsx                  # Skill tree + earned badges
│   ├── LoginScreen.jsx             # Auth gate (social / email / guest)
│   └── NotFound.jsx                # 404 page
└── components/
    ├── common/
    │   ├── Button.jsx, Card.jsx, Input.jsx, Spinner.jsx
    │   ├── Badge.jsx, Progress.jsx, Skeleton.jsx
    │   ├── SEO.jsx                  # Per-page meta tags
    │   └── ErrorBoundary.jsx        # Graceful crash fallback
    ├── layout/
    │   ├── AppLayout.jsx            # Sidebar + TopBar + Main + Coach shell
    │   ├── Sidebar.jsx              # Navigation + level list
    │   └── TopBar.jsx               # XP/streak chips, theme toggle, account menu
    ├── coach/
    │   └── Coach.jsx                # AI Coach Mei (rule-based, swappable for LLM)
    ├── quiz/
    │   └── Quiz.jsx                 # MCQ / true-false / ordering / matching engine
    └── diagrams/
        └── Mermaid.jsx              # Mermaid diagram renderer
```

---

## Adding content (no component changes)

**Lessons** — edit `src/data/curriculum.js`. Each level has a `screens[]` array. Fields: `title`, `lead`, `prose`, `analogy`, `mermaid`, `quiz`, `reflection`, `hint`, `launch`, `example`, `mistakes`.

**Badges, challenges, generator pools, personas, capstone stages** — edit `src/data/gamedata.js`. Add array entries and they appear automatically.

---

## Login & auth

Controlled entirely in `src/context/AuthContext.jsx`. The switch:

```js
export const AUTH_MODE = 'demo'   // 'demo' | 'firebase' | 'clerk' | 'supabase'
```

**Demo mode** (default) — accounts live in localStorage, all buttons work immediately. Zero setup.

**Real auth** — set `AUTH_MODE`, install the provider's SDK, replace the 4 function bodies (`loginWithProvider`, `loginWithEmail`, `signup`, `logout`). Nothing else changes.

---

## Code quality

```bash
npm run lint          # ESLint (0 errors, 0 warnings)
npm run build         # Vite build (no warnings)
npm run format        # Prettier
```

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 |
| Build | Vite 8 |
| Routing | React Router v7 (lazy routes) |
| Animation | Framer Motion |
| Diagram | Mermaid 11 |
| Icons | Lucide React |
| SEO | react-helmet-async |
| Analytics | @vercel/analytics |
| Design tokens | OKLCH custom properties |
| CSS utility | Tailwind 3 (minimal, only base layer) |
| Auth | Demo mode (swap for Firebase/Clerk/Supabase) |
| Persistence | localStorage (swap for database) |
| Lint | ESLint 9 + react-hooks + react-refresh |
| Format | Prettier 3 |

---

## License

MIT
