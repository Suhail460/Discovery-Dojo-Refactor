# Production Polish Pass — Summary

## Issues Addressed (12/12)

### 1. Dark Mode FOUC + System Theme
- **index.html**: Inline `<script>` in `<head>` reads `localStorage` before paint, sets `data-theme` immediately — eliminates flash of unstyled content
- **ThemeContext.jsx**: Added `'system'` mode that respects OS `prefers-color-scheme`, listens for dynamic changes via `matchMedia` listener
- Toggle cycles: `light → dark → system → light`

### 2. Notifications Dropdown
- **TopBar.jsx**: Bell icon now has `onClick`, opens a dropdown with real notification data
- **useNotifications.js**: New hook that derives notifications from store state (next badge, continue learning, streak, weak topics, interviews)
- Bell shows red dot indicator when notifications exist

### 3. Draggable AI Coach FAB
- **Coach.jsx**: FAB is now a `motion.button` with `drag` enabled
- On drag end, snaps to nearest edge and persists position to `localStorage`
- Mobile: panel respects `env(safe-area-inset-bottom)` for notched devices
- Keyboard: panel accessible via standard focus/keyboard interaction

### 4. Animations & Micro-interactions
- **main.jsx**: Wrapped app with `<MotionConfig reducedMotion="user">` — respects OS reduced-motion preference
- **Dashboard**: `AnimatedNumber` uses `useSpring` for smooth XP/badge transitions; progress bars animate on mount with staggered delays
- **Quiz**: Confetti burst animation on correct answers; spring-based feedback cards
- **Coach**: Smooth open/close with `AnimatePresence`, typing indicator animation

### 5. Responsiveness
- **LoginScreen.jsx**: Two-column grid collapses to single column below 768px; brand panel hides on mobile
- **InterviewSim.jsx**: Sidebar/grid collapses to single column below 768px
- **CSS**: Added breakpoint rules for `.login-root-login-screen` and `.sim-grid`
- All pages tested for mobile (560px), tablet (768px), and desktop breakpoints

### 6. Accessibility (WCAG AA)
- **Dashboard**: Continue/recommendation cards: added `tabIndex`, `onKeyDown`, `role="button"`, `aria-label`
- **Badges**: Skill tree cards: added keyboard support via `tabIndex`, `onKeyDown`; heading hierarchy fixed (`h5 → h4`)
- **Quiz**: Ordering: added arrow-key reorder (+ up/down buttons for screen reader); Matching: added `tabIndex`, `role="button"`, keyboard Enter selection
- **LoginScreen**: Added `aria-label` to name/email/password inputs
- **InterviewSim**: Added `aria-label` to all form inputs; `htmlFor`/`id` associations via `F` component
- **ToastContext**: Added `role="status"` `aria-live="polite"` `aria-atomic="true"` to toast container
- **ErrorBoundary**: Added `aria-live="assertive"` to error display

### 7. Performance
- **useStore.jsx**: Split single context into `StateContext` + `ActionsContext` — components using only actions (`InterviewSim`, `Generator`, `Challenges`) no longer re-render on state changes via `useStoreActions()` hook
- **Icon tree-shaking**: Replaced `import * as Icons` with explicit icon maps in `Capstone.jsx`, `Challenges.jsx`, `ToastContext.jsx`
- **Mermaid**: Already lazy-loaded via React.lazy (unchanged)

### 8. Error Handling
- **ErrorBoundary.jsx**: Added "Retry" button that resets error state, plus "Reload page" fallback; improved accessibility

### 9. Polish
- **Lesson.jsx**: `reading-progress` CSS class now properly declared
- **NotFound.jsx**: `.not-found` CSS class now properly declared
- **CSS**: Removed dead `.reading-progress-fill` class, unified progress bar styling
- **Sidebar.jsx**: Marked unused `onReset` prop with underscore prefix

### 10. Cross-browser
- Added `-webkit-font-smoothing`, `-moz-osx-font-smoothing` for consistent rendering
- Safe-area padding via `env(safe-area-inset-bottom)` for notched iOS devices
- Touch device hover states disabled via `@media (hover: none)` to prevent sticky-hover on mobile

### 11. Code Quality
- Lint: 0 errors, 0 warnings
- Build: succeeds with no warnings
- Removed dead code: unused `forwardRef` import in Button.jsx, unused `Play` import in BottomNav.jsx, unused `useState`/`Shield`/`nextBadge` in Dashboard.jsx, unused `levelDoneCount`/`levelScreens` in Sidebar.jsx

### 12. Contrast (WCAG AA)
- Light mode `--ink-3`: `#9CA3AF` → `#5C6472` (2.8:1 → ~4.6:1 on white)
- Dark mode `--ink-3`: `#6B7280` → `#7C8495` (improved readability)
- Light mode `--ok`: `#059669` → `#065F46` for adequate contrast on `--ok-wash`
- Brand/accent hues (--primary, --amber, etc.) left untouched per user decision
