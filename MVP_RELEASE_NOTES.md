# Discovery Dojo v1.2 — MVP Release Notes

**Release Date:** July 2026

---

## Overview

v1.2 is the production-ready MVP release of Discovery Dojo. This release completes the learning engine, adds persistent cross-device progress sync, integrates Google Analytics 4, improves UX with micro-interactions and empty states, and polishes every surface for public launch.

---

## What's new

### 1. Google Analytics 4

- Custom `analyticsService.js` with 15+ event types
- Automatic route tracking via `useLocation`
- Auth events: login, signup, logout, guest login
- Learning events: lesson started/completed, quiz completed, level completed
- Feature events: interview completed, challenge completed, capstone completed
- Graceful no-op when `VITE_GA_MEASUREMENT_ID` is not set

### 2. Firestore Progress Sync

- Authenticated user progress syncs to Firestore (debounced)
- New users load progress from Firestore on first mount
- Guest → authenticated migration merges progress automatically
- Extended user document schema covers all learning state

### 3. Learning Engine Complete

- Lesson completion with XP rewards
- Automatic streak tracking
- Level unlocking system
- Mastery percentage calculation
- Daily goal tracking
- Bookmark support
- Weak/strong topic identification

### 4. UX Polish

- Password strength indicator (5-level bar)
- Success animations on login/signup
- Offline indicator in TopBar
- Confetti for celebrations
- Polished empty states across all tool pages
- Loading spinners in buttons during auth operations

### 5. SEO & Discoverability

- Full Open Graph meta tags
- Twitter Card support
- Canonical URLs
- Structured data (JSON-LD WebApplication)
- `sitemap.xml` and `robots.txt`
- Per-page dynamic meta descriptions

### 6. Architecture

- Service layer: `authService.js`, `userService.js`, `analyticsService.js`
- Centralized error handling: `firebaseErrors.js`
- Online status hook: `useOnlineStatus.js`
- Clean separation of concerns between context, services, and utils

---

## Files added (9 new)

| File | Purpose |
|------|---------|
| `src/services/authService.js` | Firebase Auth wrapper |
| `src/services/userService.js` | Firestore user/profile operations |
| `src/services/analyticsService.js` | GA4 event tracking |
| `src/utils/firebaseErrors.js` | Error code → message mapping |
| `src/hooks/useOnlineStatus.js` | navigator.onLine hook |
| `src/components/common/Confetti.jsx` | Confetti celebration component |
| `public/robots.txt` | Robots exclusion |
| `public/sitemap.xml` | XML sitemap |
| `MVP_RELEASE_NOTES.md` | This file |

## Files modified (12)

| File | Changes |
|------|---------|
| `src/context/AuthContext.jsx` | Service layer delegation, analytics events |
| `src/context/ThemeContext.jsx` | Removed system mode |
| `src/pages/LoginScreen.jsx` | Password strength, success animation, spinner |
| `src/components/common/UpgradeModal.jsx` | Password strength, spinner, ARIA dialog |
| `src/components/layout/TopBar.jsx` | Offline indicator, ARIA menus |
| `src/router/ProtectedRoute.jsx` | Session recovery improvements |
| `src/components/layout/AppLayout.jsx` | Route tracking via analytics |
| `src/hooks/useStore.jsx` | Firestore sync integration |
| `src/components/common/SEO.jsx` | Full meta, structured data |
| `src/components/common/EmptyState.jsx` | Secondary actions, improved layout |
| `src/pages/Dashboard.jsx` | Recent activity, personalized SEO |
| `README.md` | Updated for v1.2 architecture |

---

## Environment variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GA_MEASUREMENT_ID=
```

Without Firebase vars, guest mode still works. Without GA4 var, analytics is a no-op.

---

## QA checklist

- [x] Google Login (popup, redirect, error handling)
- [x] GitHub Login (popup, redirect, error handling)
- [x] Guest Mode (full Level 1, localStorage persistence)
- [x] Email Login/Signup (validation, error states, password strength)
- [x] Password Reset (email sent toast)
- [x] Firestore Sync (progress persists across sessions)
- [x] Analytics Events (all 15+ event types fire correctly)
- [x] Dashboard (live data, recent activity, personalized greeting)
- [x] Learning Engine (complete lesson, earn XP, unlock level)
- [x] Interview Simulator (start, question, score)
- [x] Challenges (answer, score, feedback)
- [x] Generator (create scenario, earn XP)
- [x] Capstone (save stages, complete, get report)
- [x] Badges (earn, display, skill tree)
- [x] Dark Mode (all pages, no contrast issues)
- [x] Light Mode (all pages, no contrast issues)
- [x] Mobile (bottom nav, sidebar drawer, touch targets)
- [x] Desktop (sidebar, top bar, full layout)
- [x] Protected Routes (redirect to login, session recovery)
- [x] Empty States (all tool pages when no data)
- [x] Offline Indicator (WifiOff badge in TopBar)
- [x] ESLint (0 errors, 0 warnings)
- [x] Production Build (successful, no source warnings)
- [x] Console (no runtime errors)
- [x] SEO Meta Tags (OG, Twitter, canonical, structured data)
