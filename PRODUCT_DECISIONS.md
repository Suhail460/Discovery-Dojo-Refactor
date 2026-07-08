# Product Decisions

## Why Discovery Dojo exists

Product management is taught through books, blogs, case studies, and frameworks — all **passive learning**. The gap in the market is **deliberate practice with feedback**.

Discovery Dojo fills that gap by being:
- **Interactive**: You interview simulated customers, make decisions, get scored
- **Structured**: 15 levels progress from fundamentals (opportunity trees) to advanced (experiment design)
- **Gamified**: XP, streaks, badges, and a daily quest create habit loops
- **Zero-friction**: No setup, no backend, works in a browser tab

## Target user

**Primary**: Aspiring and junior product managers (0-3 years) who want structured practice.

**Secondary**: Experienced PMs who want to sharpen specific skills (especially interviewing).

**Tertiary**: Product coaches and educators who need a teaching tool with measurable progress.

## Key product decisions

### 1. Demo-first, backend-optional

The app works completely offline with localStorage. Firebase/Firestore is optional and opt-in. This removes all setup friction — a user can start learning in under 5 seconds.

**Why**: Every sign-up gate reduces conversion by 20-60%. By making the app work immediately, we maximize the number of people who experience the core value before deciding to create an account.

### 2. AI coach is rule-based by default

The AI Coach ("Mei") uses a rule-based reply engine, not an LLM. This means zero API costs, zero latency, and zero privacy concerns.

**Why**: For a learning tool, rule-based replies are more predictable and can be curriculum-aware. An LLM-powered coach would be richer but would add cost, latency, and variability. The architecture supports swapping in an LLM later by changing one function (`coachReply`).

### 3. Interview simulator is rule-based

Same reasoning as the coach. The interview simulator's question analysis is a regex engine, and replies are template-based with personality modifiers.

**Why**: Predictable scoring. A rule-based analyzer gives consistent feedback — an LLM-based analyzer would score differently each time, making progress tracking unreliable.

### 4. Curriculum is data-driven

All 15 levels live in `src/data/curriculum.js`. Adding a new level or screen is a JSON edit, not a code change.

**Why**: This separates content creation from engineering. A non-technical curriculum designer can add lessons without touching React code.

### 5. Per-account progress

Progress is keyed by user ID, stored in localStorage under `dojo_progress_{userId}`. Multiple accounts on one machine stay separate.

**Why**: This enables the demo-first approach while still supporting multiple users. When Firebase is connected, the migration path replaces localStorage calls with Firestore read/write — a single file change.

### 6. Mastery over completion

Badges reward both completion (finishing levels) and mastery (high quiz scores, interview scores).

**Why**: Completion-based gamification can encourage rushing. By rewarding quiz accuracy and interview depth, we incentivize genuine understanding over clicking through.

### 7. Weak/strong topic tracking

The app tracks which topics appear in wrong quiz answers (weak) and correct ones (strong). These feed back into the coach's suggestions.

**Why**: Adaptive learning requires knowing what the user struggles with. This data is currently used for display only — future versions should use it to suggest review screens.

## What we optimized for

| Priority | Why |
|----------|-----|
| **Zero setup** | Remove all friction to first learning moment |
| **Fast load** | 386 kB main bundle, lazy routes, instant interaction |
| **Mobile first** | 70%+ of learners use phones |
| **Progress visibility** | Streaks, XP ring, daily quest create return loops |
| **Safe failure** | Wrong answers explain why, not just "incorrect" |

## What we explicitly chose NOT to build

1. **Real leaderboards** — Require a backend and can demotivate non-competitive learners
2. **LLM-powered coach** — Adds cost and latency; rule-based is more reliable for a structured curriculum
3. **Social features** — Comments, shares, and team mode would be the next major feature set
4. **Spaced repetition** — The most requested feature after interviews; needs a scheduling engine
5. **PDF export** — Capstone report export is the most common request; would add value
