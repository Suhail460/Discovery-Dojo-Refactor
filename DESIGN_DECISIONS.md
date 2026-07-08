# Design Decisions

This document captures the rationale behind key design decisions in Discovery Dojo.

## Mobile-first bottom navigation

**Decision**: Replace the sidebar-only navigation with a bottom tab bar on mobile, sticky sidebar on desktop (≥1000px).

**Rationale**: The original sidebar was unusable on mobile — users had to tap a hamburger, then tap a nav item, then close. Bottom navigation is the mobile industry standard (Instagram, Twitter, Duolingo all use it) because it's thumb-reachable and always visible.

**Trade-off**: Desktop users lose ~60px of vertical space. The sidebar provides richer navigation with progress bars per level, so we keep it on desktop.

## XP Ring instead of text metrics

**Decision**: Replace the 4-card metric row with an SVG XP ring + compact stats bar.

**Rationale**: A circular progress ring is more emotionally satisfying than a number. It gives a visceral sense of progress toward the next milestone. The original metric cards were information-dense but cold — users scanned them but didn't feel them.

**Implementation**: SVG circle with stroke-dasharray animation on mount. Uses a gradient from plum → accent. Animated with framer-motion's `initial`/`animate` for the fill-up effect.

## OKLCH color system

**Decision**: Use OKLCH for all colors instead of HSL or hex.

**Rationale**: OKLCH is perceptually uniform — a change of 0.01 in lightness looks the same across all hues. This makes dark mode generation trivial (shift lightness + chroma on the same hues). HSL produces uneven contrast and muddy dark mode colors.

**Impact**: Re-theming is one CSS variable change. The entire app shifts hue by adjusting `--hue`.

## Two-column dashboard layout

**Decision**: Use a 2-column grid on desktop (1fr 300px), single column on mobile.

**Rationale**: The original dashboard stacked everything vertically — users had to scroll past 4 metric cards, then 15 level rows. The new layout surfaces the most important information (daily quest, quick actions, badges) in a sidebar column, while the learning path takes the main column.

## Staggered animations

**Decision**: Use framer-motion's `staggerChildren` for dashboard cards and level list items.

**Rationale**: Staggered entries feel more polished than everything appearing at once. Each element gets a moment of attention. The stagger delay is 50ms — fast enough to feel responsive, slow enough to see each item.

## Confetti on quiz correct

**Decision**: Add particle burst animation on correct quiz answers.

**Rationale**: Celebrating small wins increases dopamine and encourages continued engagement. Duolingo and Khan Academy both use celebratory animations. The confetti is subtle (12 small colored rectangles, 800ms duration) — enough to delight, not enough to annoy.

## Reading progress bar

**Decision**: Fixed thin progress bar at the top of lesson pages tracking scroll depth.

**Rationale**: Reading progress bars are a Medium/Dev.to convention that reduces uncertainty — users know how much content remains and can gauge their time commitment. The gradient color matches the app's accent.

## Daily quest gamification

**Decision**: Show a "Daily goal" card on the dashboard with completion tracking.

**Rationale**: Habit formation requires a clear, achievable daily target. The daily quest creates a reason to return to the app every day. The streak counter reinforces consistency. This pattern is validated by Duolingo, Headspace, and every modern learning app.

## No confetti on wrong answer

**Decision**: Wrong quiz answers show an explanation card without celebration particles.

**Rationale**: Wrong answers are learning opportunities, not failures. The explanation card provides the why behind the correct answer. Celebrating wrong answers would dilute the meaning of correct answers and confuse the feedback loop.

## Admin panel as separate lazy route

**Decision**: Route `/admin` is a lazy-loaded page, gated by route only (no auth gate in this version).

**Rationale**: The admin panel is a development tool, not a user-facing feature. Keeping it as a lazy route means it doesn't affect the main bundle size. Future versions should add an admin auth gate.
