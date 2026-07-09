# Changelog

## v1.2.0 (MVP Release)

### New

- **GA4 Analytics** — `analyticsService.js` with page views, auth events, lesson tracking, quiz completions, interview scores, challenge completions, and level completions. Route tracking via `useLocation`. No-op when `VITE_GA_MEASUREMENT_ID` is not set.
- **Firestore sync** — authenticated user progress (XP, badges, lessons, quizzes, interviews, capstone, bookmarks) persists to Firestore. Guests continue using localStorage. Seamless migration on signup.
- **Password strength indicator** — 5-level bar in signup forms (LoginScreen + UpgradeModal).
- **Success animations** — checkmark with spring animation on login/signup before redirect.
- **Offline indicator** — amber `WifiOff` badge in TopBar when `navigator.onLine` is false.
- **Confetti** — reusable confetti component for celebrations.
- **Empty states** — polished empty states for Generator, Challenges, Badges, and all tool pages.
- **SEO** — full Open Graph, Twitter Cards, canonical URLs, structured data (JSON-LD), sitemap.xml, robots.txt.
- **Release documentation** — `MVP_RELEASE_NOTES.md`, updated `README.md`, `CHANGELOG.md`.

### Changed

- **Architecture** — extracted Firebase auth into `services/authService.js`, Firestore operations into `services/userService.js`, error mapping into `utils/firebaseErrors.js`.
- **AuthContext** — delegates all external calls to service layer. Added proper cleanup and separation of concerns.
- **useStore** — now syncs progress to Firestore for authenticated users (debounced 800ms). Loads Firestore data on mount before falling back to localStorage.
- **LoginScreen** — password strength meter, spinner-in-button during loading, success checkmark animation, toast feedback, ARIA roles, `autoComplete` attributes, privacy notice.
- **UpgradeModal** — aligned with LoginScreen UX: password strength, spinner-in-button, success toast, ARIA `dialog`.
- **TopBar** — offline indicator, improved ARIA labels, `role="menu"` on user dropdown.
- **ProtectedRoute** — better session recovery spinner with `role="status"`.
- **Dashboard** — recent activity section, personalized SEO description with user stats.
- **SEO component** — full meta tags (OG, Twitter, canonical, structured data).
- **Firestore user document** — extended schema with bookmarks, quizScores, reflections, confidence, interviews, capstone, weak/strong tracking.

### Fixed

- All ESLint warnings resolved (0 errors, 0 warnings).
- Build produces no warnings related to source code.
- Removed unused `AUTH_MODE` constant and dead code paths.
- Consistent error handling across all auth flows.

### Security

- Firebase config values loaded from environment variables only.
- Guest sessions stored only in localStorage — no Firebase access.
- Error messages sanitized through `friendlyError()` — no raw Firebase codes exposed.
- No secrets or API keys in source code.

### Performance

- Lazy loading via `React.lazy()` for all page components.
- Suspense boundaries with skeleton loaders.
- Debounced Firestore writes (800ms) to prevent write storms.
- Memoized context values to prevent unnecessary re-renders.
- Optimistic UI updates — local state updates immediately, Firestore syncs async.
