# Component Guide

## Common Components (`src/components/common/`)

### Button
**Props**: `variant` (primary|secondary|ghost), `size` (md|sm|lg), `icon`, `disabled`
- Primary: purple gradient fill, white text, glow shadow
- Secondary: transparent, line border, hover fills
- Ghost: no border, hover background

### Card
**Props**: `children`, `padding`, `onClick`, `className`
- Wraps content in `.card` class with white bg, border, radius, shadow

### Badge (Pill)
**Props**: `variant` (level|time|easy|medium|hard|done), `icon`
- Small rounded label with color-coded backgrounds

### Progress
**Props**: `value`, `max`, `height`, `color`, `bg`
- Accessible progress bar with `.progress-track` + `.progress-fill`

### Input
**Props**: `multiline`, `label`, `icon`, `error`, `ref`
- Unified input/textarea with label, icon prefix, error state

### Spinner
**Props**: `size`, `color`, `label`
- SVG spinning circle with accessible label

### Skeleton
**Props**: `width`, `height`, `variant` (text|title|card)
- Shimmer loading placeholder

## Layout Components (`src/components/layout/`)

### Sidebar
- Sticky desktop sidebar (256px), slides in on mobile
- Navigation links with active indicator
- Curriculum tree with progress bars per level
- Reset button at bottom

### TopBar
- Sticky header with breadcrumb, XP/streak chips, theme toggle, user menu
- Compact: 56px height, small chips, icon buttons

### BottomNav
- Fixed bottom nav on mobile (5 tabs: Learn, Interview, Practice, Drills, Progress)
- Animated active indicator (framer-motion layoutId)
- Hidden on desktop

### AppLayout
- Shell: Sidebar + TopBar + Outlet + BottomNav + Coach
- AnimatePresence page transitions

## Gamification Components (`src/components/gamification/`)

### XpRing
- Animated SVG ring showing XP progress
- Framer-motion stroke-dashoffset animation
- XP counter in center with scale animation

### StreakBadge
- Flame icon with streak count
- Wiggle animation on high streak
- Purple highlight when streak ≥ 3

### DailyQuest
- "Complete 1 screen" daily goal card
- Progress bar animation
- Mastery + badges summary

## Coach (`src/components/coach/Coach.jsx`)
- Floating action button (purple) → slide-up panel
- Chat bubbles: `.bubble-user` (purple, right), `.bubble-coach` (surface, left)
- Typing indicator, suggested prompts, send input
- Rule-based Socratic replies (swappable for LLM)

## Quiz (`src/components/quiz/Quiz.jsx`)
- Supports MCQ, True/False, Ordering, Matching
- Confetti on correct, animated feedback
- Variant-based colors for option states
