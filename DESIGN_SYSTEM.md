# Design System

## Tokens

All design tokens are defined as CSS custom properties in `src/styles/index.css` under `:root` (light) and `[data-theme="dark"]`.

### Typography
- **Headings**: "Bricolage Grotesque" (Google Font) — 700 weight, tight letter-spacing
- **Body**: System font stack (`ui-sans-serif, system-ui, -apple-system, ...`)
- **Monospace**: "JetBrains Mono", "Fira Code" — for code snippets
- **Serif**: Georgia — for italic prose sections

### Spacing (8-point grid)
- `gap-1`: 4px, `gap-2`: 8px, `gap-3`: 12px, `gap-4`: 16px, `gap-6`: 24px, `gap-8`: 32px
- `mt/mb-1` through `mt/mb-8` follow the same scale
- Padding/margins in components use multiples of 4px or 8px

### Border Radii
- `--r-xs`: 6px, `--r-sm`: 8px, `--r-md`: 12px, `--r-lg`: 16px, `--r-xl`: 24px, `--r-full`: 9999px

### Easing Curves
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)` — smooth deceleration
- `--ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` — bouncy micro-interactions
- `--ease-smooth`: `cubic-bezier(0.4, 0, 0.2, 1)` — standard Material-style
- `--ease-glass`: `cubic-bezier(0.22, 1, 0.36, 1)` — elegant card transitions

### Layout
- `--topbar-h`: 56px, `--bottom-nav-h`: 64px (56px on mobile)
- `--sidebar-w`: 256px
- Z-index system: overlay(39), sidebar(40), topbar(30), bottomnav(50), coach(60), modal(100)

## Dark Mode
Enabled via `[data-theme="dark"]` attribute. All tokens are redefined for dark backgrounds, maintaining identical visual hierarchy. No hardcoded colors anywhere.

## Responsive Breakpoints
- **Mobile**: `<560px` — single column, smaller padding, compact pills/inputs
- **Tablet**: `561-999px` — 2-column grids, sidebar slides in
- **Desktop**: `≥1000px` — sidebar always visible, 3-4 column grids
