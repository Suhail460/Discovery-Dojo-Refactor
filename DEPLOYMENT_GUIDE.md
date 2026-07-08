# Deployment Guide

Discovery Dojo builds to a static `dist/` folder. Deploy to any static host.

## Build

```bash
npm run build
```

Output: `dist/` directory with:
- `index.html` — entry point
- `assets/` — JS/CSS bundles (lazy-loaded, code-split)
- `screenshots/` — placeholder images
- `robots.txt`, `sitemap.xml` — SEO

## Vercel (recommended)

### Option A: Git import (easiest)

1. Push your repo to GitHub/GitLab
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Framework: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy → your app is live at `your-project.vercel.app`

### Option B: CLI

```bash
npm i -g vercel
vercel --prod
```

### Environment variables

If using Firebase, add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## Netlify

1. Push to GitHub
2. Go to [app.netlify.com](https://app.netlify.com)
3. Import your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy

Add a `_redirects` file in `public/` for SPA routing:

```
/*    /index.html   200
```

## Cloudflare Pages

1. Push to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
3. Connect your repo
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Build output: `dist`
7. Deploy

## Custom domain

All three providers support custom domains via their dashboard.

## Post-deployment checklist

- [ ] `npm run build` succeeds (0 errors, 0 warnings)
- [ ] App loads and displays content
- [ ] Navigation works (all routes)
- [ ] Dark mode toggles correctly
- [ ] Interview simulator starts and scores
- [ ] Quiz answers show feedback
- [ ] Progress persists across page reloads
- [ ] Mobile: bottom nav works, sidebar opens/closes
- [ ] Console shows no errors

## Analytics

The app includes `@vercel/analytics` which auto-tracks page views on Vercel. To view analytics:

1. Go to Vercel Dashboard → your project → **Analytics** tab
2. Enable Analytics if not already on
3. Data appears within 24 hours

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:

1. Installs dependencies
2. Runs ESLint
3. Runs the production build

The workflow triggers on every push to `main` and every pull request targeting `main`.
