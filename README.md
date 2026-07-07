# Discovery Dojo

An interactive Product Discovery learning platform. 15 levels, a live customer-interview simulator, an exercise generator, rapid challenges, a capstone project, an AI coach, gamification, and a login screen.

Built with **Vite + React + Tailwind CSS + Framer Motion + Mermaid**. Fully componentized and data-driven so you can extend it without rewriting UI.

---

## 1. Run it locally (step by step)

You need **Node.js 18+** installed. Check with `node -v`. If you don't have it, grab it from https://nodejs.org (the LTS version).

1. Put all these files into one folder, keeping the exact structure below.
2. Open a terminal in that folder.
3. Install dependencies (one time):
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. It prints a URL like `http://localhost:5173`. Open it. That's the app, with hot-reload: edit a file, the browser updates instantly.

To make a production build:
```bash
npm run build      # outputs to /dist
npm run preview    # preview the built version
```

The `/dist` folder is a static site. You can host it free on Netlify, Vercel, GitHub Pages, or Cloudflare Pages by dragging the folder in or connecting the repo.

---

## 2. Folder structure

```
discovery-dojo/
â”œâ”€ index.html                 # HTML entry (loads fonts + React)
â”œâ”€ package.json               # dependencies + scripts
â”œâ”€ vite.config.js             # Vite setup
â”œâ”€ tailwind.config.js         # Tailwind + design tokens
â”œâ”€ postcss.config.js
â”œâ”€ .gitignore
â””â”€ src/
   â”œâ”€ main.jsx                # mounts React, wraps app in providers
   â”œâ”€ App.jsx                 # routing (view state), layout shell, toasts
   â”œâ”€ index.css               # OKLCH design system + base styles
   â”œâ”€ context/
   â”‚  â”œâ”€ AuthContext.jsx      # LOGIN CONTROL lives here (read section 4)
   â”‚  â””â”€ ThemeContext.jsx     # light/dark theme
   â”œâ”€ hooks/
   â”‚  â””â”€ useStore.jsx         # per-user progress, XP, streak, badges (localStorage)
   â”œâ”€ data/
   â”‚  â”œâ”€ curriculum.js        # ALL 15 levels of content (edit here to add lessons)
   â”‚  â””â”€ gamedata.js          # badges, challenges, generator pools, personas, capstone stages
   â”œâ”€ components/
   â”‚  â”œâ”€ LoginScreen.jsx      # the login UI (Google / GitHub / Apple / email / guest)
   â”‚  â”œâ”€ Sidebar.jsx
   â”‚  â”œâ”€ TopBar.jsx           # XP/streak chips, theme toggle, account menu, export/import
   â”‚  â”œâ”€ Coach.jsx            # AI coach (rule-based, swappable for an LLM)
   â”‚  â”œâ”€ Quiz.jsx             # mcq / true-false / ordering / matching engine
   â”‚  â””â”€ Mermaid.jsx          # diagram renderer
   â””â”€ views/
      â”œâ”€ Dashboard.jsx        # home + progress map
      â”œâ”€ Lesson.jsx           # renders any lesson screen from curriculum.js
      â”œâ”€ InterviewSim.jsx     # customer interview simulator + scorecard
      â”œâ”€ Generator.jsx        # randomized scenario generator
      â”œâ”€ Challenges.jsx       # rapid drills
      â”œâ”€ Capstone.jsx         # 9-stage project + feedback report
      â””â”€ Badges.jsx           # skill tree + badges
```

---

## 3. How to add or edit content (no coding)

**Lessons** live entirely in `src/data/curriculum.js`. Each level is an object with a `screens` array. To add a screen, copy an existing screen object and edit the fields. The lesson view renders every field automatically:

- `title`, `lead`, `time`, `diff` (1-3), `objectives[]`
- `prose` (HTML string), `analogy {title, body}`
- `mermaid {code, cap}` for a diagram
- `example {items[]}`, `mistakes[]`, `reflection`, `hint`
- `quiz` with `type: 'mcq' | 'truefalse' | 'order' | 'match'`
- `launch {view, label, icon}` to link to a practice tool

**Badges, challenges, generator scenarios, personas, capstone stages** all live in `src/data/gamedata.js`. Add array entries and they appear in the UI. No component changes needed.

---

## 4. Controlling login (important)

Login is controlled in **one file**: `src/context/AuthContext.jsx`. There's a single switch at the top:

```js
export const AUTH_MODE = 'demo'
```

### Demo mode (default, zero setup)
Out of the box, `AUTH_MODE = 'demo'`. Accounts are stored in the browser (localStorage). Google/GitHub/Apple buttons, email signup, and guest mode all work immediately for local use and demos. Nothing to configure. Progress is saved per account, keyed by user id, so multiple people on one machine stay separate.

This mode is NOT real security. It's for learning, demos, and single-machine use. Anyone with the browser can see the local accounts.

### Turning on REAL login (Google / GitHub for real)
Real social login needs an auth provider (a service that verifies identity). The app is already wired so you only change `AuthContext.jsx`, nothing else. Pick one:

**Option A â€” Clerk (easiest, hosted UI):**
1. `npm install @clerk/clerk-react`
2. Create a free project at clerk.com, copy your Publishable Key.
3. Wrap the app in `<ClerkProvider>` in `main.jsx`, and in `AuthContext.jsx` replace the demo function bodies with Clerk's `useSignIn` / `useUser`. Set `AUTH_MODE = 'clerk'`.
4. Enable Google/GitHub in the Clerk dashboard (toggles, no code).

**Option B â€” Firebase Auth (Google's free tier):**
1. `npm install firebase`
2. Create a Firebase project, enable Google + GitHub sign-in providers in the console.
3. In `AuthContext.jsx`, initialize Firebase and replace:
   - `loginWithProvider` â†’ `signInWithPopup(auth, new GoogleAuthProvider())`
   - `loginWithEmail` â†’ `signInWithEmailAndPassword(...)`
   - `signup` â†’ `createUserWithEmailAndPassword(...)`
   - `logout` â†’ `signOut(auth)`
   Set `AUTH_MODE = 'firebase'`.

**Option C â€” Supabase (auth + database together):**
1. `npm install @supabase/supabase-js`
2. Create a Supabase project, enable OAuth providers.
3. Swap the same four functions for `supabase.auth.signInWithOAuth(...)` etc. Set `AUTH_MODE = 'supabase'`.

The rest of the app (`useAuth().user`, progress keyed by `user.id`, sign-out) keeps working because it never talks to the provider directly, only to this context. Keep secret keys in a `.env` file (already gitignored), never commit them.

### Making progress sync across devices
Right now progress is per-browser (see `src/hooks/useStore.jsx`). Once you have real auth + a database (Firebase/Supabase), swap the `localStorage` load/save calls in `useStore.jsx` for a row-per-user read/write. That single change makes progress follow the user across devices.

---

## 5. Advanced options already included

- **Dark mode** (top bar toggle, respects OKLCH design tokens).
- **Export / Import progress** (account menu in the top bar) â€” back up or move your data as JSON.
- **Guest mode** for zero-friction trials.
- **Per-account progress** with XP, streaks, mastery %, weak/strong topic tracking.
- **Framer Motion** page and element transitions.
- **Responsive**: sidebar collapses to a drawer on mobile, login panel stacks.

---

## 6. Ideas to add later (roadmap)

Things that would take this from great to commercial-grade:

1. **Real backend + database** (Supabase is the fastest path) so progress syncs across devices and you can see analytics.
2. **LLM-powered AI coach and interview simulator.** Right now both are smart rule-based engines. Point `Coach.jsx`'s `coachReply()` and `InterviewSim.jsx`'s `reply()` at an LLM API for open-ended, truly dynamic conversations. Keep the scoring rubric; let the model generate the persona's answers.
3. **Real leaderboard** (needs the backend) instead of a placeholder.
4. **Spaced repetition**: resurface quiz questions from weak topics on a schedule.
5. **Shareable capstone report** (export the feedback report as a PDF or public link).
6. **More content**: the data-driven engine means new levels, case studies, and challenge packs are just data entries.
7. **Team / cohort mode**: assign levels, track a group, add comments.
8. **Accessibility pass**: full keyboard nav, ARIA labels, focus management on the modal/coach.
9. **Analytics**: track where learners drop off to improve the curriculum.
10. **Tests**: add Vitest + React Testing Library once the structure stabilizes.

---

## 7. Tech notes

- Colors use **OKLCH** custom properties in `index.css`. Change the `--hue` and accent values there to re-theme the whole app.
- Mermaid is imported as an npm package and re-renders on theme change.
- No secret keys are needed for demo mode. For real auth, use a `.env` file (gitignored).

Happy discovering.
