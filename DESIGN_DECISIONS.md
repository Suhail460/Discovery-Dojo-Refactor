# Design Decisions — Discovery Dojo

## Principles
1. **Purpose over decoration** — every element answers a specific user question.
2. **Progressive disclosure** — start with the big picture (hero + stats), then specific (continue), then detailed (path).
3. **Consistency with personality** — use the established design tokens, but compose them in premium patterns.

## Key Decisions

### 1. Hero as a dashboard, not a banner
**Decision**: The hero is ~280px with two columns: greeting/CTA on the left, visual/floating cards on the right.
**Why**: The traditional single-column hero wastes the right side. By making it two-column, the user sees both motivation and progress in one viewport without scrolling.
**Inspiration**: Duolingo's streak-heavy hero + Linear's clean greeting pattern.

### 2. Floating cards replace static badges
**Decision**: Streak badge, mastery percentage, and XP total float over a soft gradient illustration area with 3-5s oscillation animations.
**Why**: Static badges feel flat. Floating elements with subtle motion create a premium "live dashboard" feel without adding real-time data.
**Inspiration**: Stripe dashboard's floating metric cards.

### 3. Stats row uses 4 columns instead of 5
**Decision**: 4 stats (XP, Levels, Badges, Mastery) with animated progress bars and weekly change indicators.
**Why**: Streak data lives in the hero as a floating card, not in the stats row. This reduces clutter and gives each stat enough room for a large value, label, progress bar, and change indicator.
**Inspiration**: Vercel analytics cards.

### 4. Continue Learning is the visual centerpiece
**Decision**: The largest card on the dashboard with a progress ring, lesson meta (difficulty, duration, XP), and a dominant CTA button.
**Why**: Getting the user to their next lesson is the primary conversion goal. The card needs to feel important enough to click without being overwhelming.
**Inspiration**: Duolingo's lesson card + Linear's primary action button.

### 5. Learning Path uses a timeline with alternating backgrounds
**Decision**: Each level is a horizontal card with a vertical timeline connector. Every other card has a subtle primary-wash background.
**Why**: The timeline visually communicates progression in a way stacked cards cannot. Alternating backgrounds break the monotony of identical rectangles without introducing new colors.
**Inspiration**: Linear's project timeline + Notion's roadmap view.

### 6. Right sidebar is sticky with purpose-ordered content
**Decision**: Sidebar stacks: Daily Goal → Quick Actions → Weekly Chart → Next Badge → AI Recommendation → Upcoming Milestone.
**Why**: The sidebar should never be a dumping ground. Each item has a role: daily motivation (Goal), quick wins (Actions), progress pattern (Chart), future incentive (Badge, Milestone), and guidance (Recommendation).
**Inspiration**: Linear's right sidebar for issue metadata + Notion's page sidebar.

### 7. Mobile follows a different flow
**Decision**: On mobile (<560px): Hero → Continue Learning → Daily Goal → Stats (2-col grid) → Quick Actions → Learning Path → Recommendations.
**Why**: Desktop layouts don't compress. The mobile flow prioritizes what the user needs first: motivation, then next action, then goal check, then overview.
**Inspiration**: Duolingo's mobile-first approach.

### 8. Weekly progress chart as mini bar chart
**Decision**: 7 bars representing Mon-Sun with active highlighting for streak days.
**Why**: A mini chart communicates weekly consistency in ~60px of vertical space. More efficient than text and more visual than numbers.
**Inspiration**: Headspace's streak visualization.

### 9. Animated number counters
**Decision**: XP and stat values use `useSpring` from framer-motion for smooth counting animation on mount and update.
**Why**: Hard numbers feel static. Animated counters make the data feel alive and give the user a sense of accumulation.
**Inspiration**: Stripe's revenue counter animation.

### 10. Section headers become purpose statements
**Decision**: Headers use action verbs and icons: "Continue learning", "Learning path", "Recommended for you".
**Why**: Generic headers like "Content" or "More" don't guide the user. Each header should answer "What is this section for?" in the user's mental model.
**Inspiration**: Notion's clear section labeling + Linear's project headers.
