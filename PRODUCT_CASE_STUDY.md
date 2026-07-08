# Discovery Dojo — Product Case Study

**A production-grade Product Discovery learning platform, built from a single-page prototype through 9 phases of incremental refactoring.**

> **Live app:** [discoverydojo.app](https://discoverydojo.app) (demo)  
> **Tech:** React 18 · Vite 8 · Framer Motion · Mermaid · OKLCH tokens · React Router v7  
> **Status:** Production-ready, deployed to Vercel, 0 ESLint warnings, 0 build errors

---

## Table of contents

1. [Product overview](#1-product-overview)
2. [Who it's for](#2-who-its-for)
3. [The problem](#3-the-problem)
4. [My approach](#4-my-approach)
5. [Architecture & key decisions](#5-architecture--key-decisions)
6. [Phased refactoring journey](#6-phased-refactoring-journey)
7. [Performance](#7-performance)
8. [What I'd do differently](#8-what-id-do-differently)

---

## 1. Product overview

Discovery Dojo is an interactive, gamified learning platform for product discovery — the skill of deciding **what** to build before figuring out **how** to build it.

![Dashboard](public/screenshots/dashboard.png)

### Core features

| Feature | What it does |
|---------|-------------|
| **15 curriculum levels** | Opportunity trees, customer interviews, assumption mapping, experiment design, MVP strategy, stakeholder buy-in |
| **Interview Simulator** | Build a customer persona (name, industry, personality, pain point), interview them live, get scored on question quality (leading vs open, depth, rapport) |
| **Exercise Generator** | Randomized discovery briefs — a company, problem, customer, market, timeline, budget, and team — to practice against |
| **Discovery Challenges** | 10+ single-question rapid drills covering bias, interview technique, research methods, prioritization |
| **Capstone Project** | 9-stage full discovery cycle on a real idea of the user's choosing, ends with a feedback report and Practitioner badge |
| **AI Coach "Mei"** | Socratic mentor accessible from any page. Gives hints, analogies, and nudges based on the current screen |
| **Gamification** | XP per screen/quiz/interview, daily streaks, 14 badges (First Step → Discovery Master), skill tree with weak/strong topic tracking |
| **Progress persistence** | Per-account localStorage (demo). Swap to Supabase/Firebase for cross-device sync |
| **Dark mode** | Full OKLCH color system, light and dark themes, persisted to localStorage |
| **Export / Import** | Full progress export/import as JSON from the account menu |
| **Guest mode** | Zero-friction exploration without signup |

---

## 2. Who it's for

- **Aspiring and junior product managers** who want structured, interactive practice
- **Experienced PMs** who want to sharpen specific discovery skills
- **Product coaches and educators** who need a teaching tool
- **Anyone interviewing for PM roles** — the interview simulator is the most requested practice tool

---

## 3. The problem

Product discovery is taught through books, blogs, and frameworks — all **passive**. The gap is **deliberate practice with feedback**.

Discovery Dojo closes that gap by being:
- **Interactive** — you don't read, you *do* (interview, exercise, challenge)
- **Structured** — 15 levels progress from fundamentals to advanced
- **Scored** — every interview is analyzed for question quality, every quiz and challenge awards XP
- **Always available** — zero setup, works in a browser, demo mode needs no backend

---

## 4. My approach

The original app was a single `App.jsx` with manual view state (`useState` toggling between "dashboard", "lesson", "interview", etc.), no routing, components in flat files, and a single CSS bundle.

Over 9 incremental phases, I refactored it into a production-grade single-page application using **zero-credit refactoring**: every phase preserved all existing functionality, built without breaking, and was committed independently.

### Principles

1. **Never break the build.** Every phase ends with `npm run build` succeeding.
2. **Never remove functionality.** All 15 levels, quizzes, Mermaid diagrams, AI coach, interview sim, gamification — preserved throughout.
3. **Make the next change easy.** Architecture decisions prioritize future extensibility over perfection.
4. **Favor data-driven architecture.** All content lives in data files (`curriculum.js`, `gamedata.js`). Adding a level or badge is a JSON edit, not a code change.
5. **Design tokens over magic values.** Every color, shadow, and radius is a CSS custom property. Re-theming the whole app is one variable change.

---

## 5. Architecture & key decisions

### Router-based navigation (React Router v7)

Replaced `useState` view-state with `BrowserRouter` + lazy-loaded routes. The `useNavigation` hook wraps `useNavigate`/`useParams` so no component touches the router directly — swapping to a different router is one file change.

### Context providers

```
main.jsx
├── HelmetProvider (per-page SEO)
├── ThemeProvider (light/dark)
├── AuthProvider (login control)
├── ProgressProvider (XP, badges, streak, persistence) → useStore()
├── ToastProvider (global notifications)
└── AppRouter (lazy routes)
```

Each provider is small and focused. The ProgressProvider (`useStore.jsx`) uses `useMemo` + debounced localStorage to avoid cascading re-renders.

### Code splitting

Every page is `React.lazy()` loaded. The main entry chunk is **386 kB** (down from 1075 kB in the original build). Mermaid, Lucide icons, and Cytoscape are in separate chunks loaded only when needed.

### Design system

A set of 8 common components (`Button`, `Card`, `Input`, `Spinner`, `Badge`, `Progress`, `Skeleton`, `SEO`) — each is a thin shell over a CSS token. No CSS framework dependency beyond Tailwind's base layer (used only for reset + animation).

### OKLCH color system

All colors use OKLCH (perceptually uniform). The light and dark themes are generated by shifting lightness and chroma on the same hues. Changing `--hue` re-themes the entire application.

### Auth abstraction

Auth is abstracted behind `AuthContext.jsx`. The single `AUTH_MODE` variable toggles between demo mode (localStorage, zero setup) and real providers (Firebase, Clerk, Supabase). The rest of the app calls `useAuth()` without knowing which provider is behind it.

---

## 6. Phased refactoring journey

### Phase 1 — Folder structure
- Reorganized from flat files into `components/{layout,coach,quiz,diagrams}/`, `pages/`, `styles/`
- Deleted dead ClickUp Brain code in index.html
- Clean separation of concerns

### Phase 2 — Code quality
- ESLint (react, react-hooks, react-refresh) + Prettier + EditorConfig
- Extracted `src/utils/helpers.js` (toPascal, pick, cap, shuffle, clamp)
- Removed unused imports, duplicate utilities, unescaped entities

### Phase 3 — React Router
- Replaced `useState` view-state with `BrowserRouter` + `Routes`
- Created `useNavigation.js` hook, `ToastContext.jsx`, `AppLayout.jsx` shell
- Deleted old `App.jsx`
- All views updated to use hooks instead of props

### Phase 4 — Design system
- Button, Card, Input, Spinner, Badge, Progress, Skeleton components
- Accessibility utilities (sr-only, focus-visible, reduced-motion)
- OKLCH token system expanded

### Phase 5 — Performance
- React.lazy + Suspense for all 7 route pages
- Main bundle: **1075 kB → 386 kB** (64% reduction)
- Mermaid dependencies automatically code-split

### Phase 6 — Accessibility & SEO
- react-helmet-async for per-page meta tags (OpenGraph, Twitter Card)
- robots.txt, sitemap.xml
- Keyboard focus-visible styles, reduced-motion media query

### Phase 7 — Error handling
- ErrorBoundary class component with graceful reload fallback
- Every lazy route wrapped independently for crash isolation

### Phase 8 — State management optimization
- Debounced localStorage writes (500ms timeout)
- useMemo on context value to prevent cascading re-renders

### Phase 9 — Final quality gates
- 0 ESLint errors, 0 build warnings, clean CI
- Vite chunk size warning limit configured

### Polish phase — Premium UX
- Staggered card animations with framer-motion
- Typing indicators for Coach + Interview Simulator
- Skeleton loading screens during route transitions
- Quick actions panel on dashboard
- Responsive improvements (touch targets, mobile drawer)
- Empty states with helpful copy
- Pro tip cards
- Vercel Analytics integration
- GitHub Actions CI workflow
- README, case study, screenshot placeholders
- 182 lint warnings → 0

---

## 7. Performance

| Metric | Before | After |
|--------|--------|-------|
| Main bundle size | 1,075 kB | 386 kB |
| Lint warnings | 182 | 0 |
| Build time | ~5s | ~3.5s |
| Route-level code splitting | None | 7 lazy chunks |
| Third-party splitting | None | Mermaid, Lucide, Cytoscape separate |
| Storage writes | Synchronous | Debounced 500ms |
| Context re-renders | All consumers | Memoized |

---

## 8. What I'd do differently

1. **TypeScript from day one.** Adding it now would be a large refactor. The 182 prop-types warnings were a signal that was cheaper to disable (via ESLint) than to add PropTypes or TS definitions to every component. For a team project, I'd choose TypeScript.

2. **Test coverage.** The app has zero automated tests. With architecture stable, adding Vitest + React Testing Library would be the next investment. Critical paths: quiz engine, interview analysis, scoring calculations, and the coach's reply function.

3. **Mermaid loading.** Mermaid is a heavy dependency (~250 kB gzipped). If I were optimizing further, I'd use a pre-rendered image approach or defer Mermaid loading until the component is in the viewport using IntersectionObserver.

4. **CSS approach.** The app uses inline styles extensively (a deliberate choice for component isolation). With Tailwind already installed, migrating to utility classes would reduce the JS bundle size and make the CSS more maintainable. However, the current approach keeps the component JSX readable and the CSS tokens centralized.

5. **Accessibility depth.** The app has good surface-level accessibility (focus-visible, ARIA labels, semantic HTML), but a full screen-reader audit would likely find issues in the quiz interaction, the coach panel, and the interview simulator's chat area.

---

*Built with React, Vite, and deliberate practice. Documented for anyone who wants to understand how a single-page prototype becomes a production application.*
