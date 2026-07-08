# Responsive Design Guide

## Breakpoints

| Type | Range | Layout |
|------|-------|--------|
| Mobile | `< 560px` | Single column, bottom nav, compact UI |
| Tablet | `561-999px` | 2-column grids, sidebar slides in |
| Desktop | `≥ 1000px` | 3-4 column, sidebar always visible |

## Mobile (`< 560px`)
- `app-content` padding: 16px (vs 24-32px desktop)
- Bottom nav height: 56px (vs 64px)
- Sidebar becomes fixed overlay, triggered by hamburger
- All grid layouts collapse to single column
- Buttons, pills, inputs use compact padding
- Coach panel fills full width minus margins
- Heading sizes scale down (h1: 1.6rem)

## Tablet (`561-999px`)
- `grid-3` and `grid-4` become 2-column
- `hide-tablet` class hides elements on tablet
- Sidebar overlay with backdrop blur
- Content max-width of 1100px

## Desktop (`≥ 1000px`)
- Full 3-4 column grids
- Sidebar always visible (256px), sticky, full height
- Bottom nav hidden
- TopBar gets more horizontal padding (32px)
- Dashboard grid: 1fr 280px (main + sidebar)

## Mobile-First Patterns
- Dashboard: sidebar collapses to bottom section on mobile
- Lesson: single column, full-width content at 780px max
- InterviewSim: persona sidebar moves above chat on mobile
- Coach: FAB + panel positioned for thumb reach

## Safe Areas
- Bottom Nav uses `env(safe-area-inset-bottom)` for notched devices
- Touch devices have separate hover/active states (no hover on touch)
