# Changelog

All notable changes to Discovery Dojo are documented here.

## [2.0.0] — 2026-07-08

### Added
- **Mobile-first layout**: Bottom navigation bar with 5 tabs (Learn, Interview, Practice, Drills, Progress)
- **Desktop sidebar**: Replaced old sidebar with proper overlay + sticky desktop variant
- **XP Ring component**: SVG circular progress ring with animated fill showing XP accumulation
- **StreakBadge component**: Animated streak display with flame icon and day counter
- **DailyQuest component**: Daily goal tracker with progress bar and completion state
- **Gamification module**: Reusable game elements in `src/components/gamification/`
- **Admin dashboard**: Skeleton admin panel at `/admin` with lessons, users, analytics, settings tabs
- **Firebase scaffolding**: Configuration files at `src/lib/firebase.js` and `src/lib/firestore.js`
- **Reading progress bar**: Fixed progress indicator on lesson pages tracking scroll depth
- **Confetti burst animation**: Particle celebration on correct quiz answers
- **Animated quiz feedback**: Spring-animated correct/incorrect feedback with XP indicator

### Changed
- **Dashboard redesigned**: XP ring hero, stats row with compact cards, two-column layout with learning path + quick actions + daily quest + pro tip
- **Lesson page redesigned**: Sticky progress bar, improved callout cards, motion animations, cleaner typography
- **Quiz component redesigned**: Staggered option animations, check/X indicators, confetti on correct, spring feedback
- **Sidebar redesigned**: Mobile overlay with close button, desktop sticky variant, same-day nav close
- **Navigation architecture**: Coach accepts controlled open/close state; TopBar has coach toggle button
- **CSS**: Complete mobile-first rewrite with spacing scale, font scale, responsive breakpoints (560px, 768px, 1000px)
- **Login screen**: Brand panel hides on mobile, full-width form on small screens
- **Interview sim**: Added replying/typing indicator with animated dots

### Fixed
- All 182 lint warnings eliminated (0 errors, 0 warnings)
- Unescaped entities in JSX
- Unused imports across all components
- Hook dependency arrays in useStore.jsx
- Mobile touch target sizes (44px minimum)

### Performance
- Main bundle: 408 kB (from 1075 kB in original — 62% reduction)
- All routes remain lazy-loaded with Suspense
- Third-party chunks (Mermaid, Lucide, Cytoscape) remain code-split

## [1.0.0] — 2026-06-15

### Added
- Initial React application with 15-level product discovery curriculum
- Customer interview simulator with question analysis
- Exercise generator with randomized scenarios
- Discovery challenges (rapid drills)
- Capstone project with 9-stage workflow
- AI Coach "Mei" with contextual hints
- Gamification (XP, streaks, badges, skill tree)
- Dark mode with OKLCH design tokens
- Progress persistence via localStorage
- Guest mode + social login (demo auth)
