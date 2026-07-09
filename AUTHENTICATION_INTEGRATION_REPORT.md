# Authentication Integration Report

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/firebase/config.js` | **Replaced** | Firebase SDK init using env vars. Exports `app`, `auth`, `db`, `analytics`. Sets `browserLocalPersistence` for persistent sessions. |
| `src/context/AuthContext.jsx` | **Replaced** | Demo/localStorage auth replaced with full Firebase Authentication. |
| `src/router/ProtectedRoute.jsx` | **Created** | Route guard — loading spinner → LoginScreen → render children. |
| `src/router/AppRouter.jsx` | **Updated** | Uses `ProtectedRoute` instead of inline `AuthGuard`. |
| `src/pages/LoginScreen.jsx` | **Updated** | Added Forgot Password flow, wired GitHub/Apple/Google buttons. |
| `src/main.jsx` | **Updated** | Removed unused `app` import and `console.log`. |

## Authentication Flow

### Google Sign-In
- `loginWithProvider('google')` → `GoogleAuthProvider` + `signInWithPopup`
- Sets `prompt: 'select_account'` for fresh account selection every time
- On success: creates/updates Firestore `users/{uid}` document

### GitHub Sign-In
- `loginWithProvider('github')` → `GithubAuthProvider` + `signInWithPopup`
- No custom parameters needed

### Apple Sign-In
- `loginWithProvider('apple')` → `OAuthProvider('apple.com')` + `signInWithPopup`
- Requires Apple Sign-In configured in Firebase Console

### Email Signup
- `signup(name, email, password)` → `createUserWithEmailAndPassword` + `updateProfile({ displayName: name })`
- Creates Firestore `users/{uid}` document with full profile + defaults

### Email Login
- `loginWithEmail(email, password)` → `signInWithEmailAndPassword`
- Updates `lastLogin` timestamp in Firestore

### Forgot Password
- `resetPassword(email)` → `sendPasswordResetEmail` with Firebase error handling
- LoginScreen: "Forgot password?" link → email input → sends reset email → success feedback
- Back button returns to login

### Anonymous Guest Login
- `loginAsGuest()` → `signInAnonymously` — real Firebase anonymous session
- Persists across browser refreshes
- No Firestore document created (anonymous users have no uid reference)

### Logout
- `logout()` → `signOut(auth)` → clears user state, returns to login

### Auth State Persistence
- `browserLocalPersistence` configured in `config.js`
- `onAuthStateChanged` listener restores session on every page load
- Refresh keeps the user logged in

## Firestore Document (`users/{uid}`)

### Created on first signup/login (Google, GitHub, Apple, Email)
### Updated with `lastLogin` on subsequent logins

```js
{
  uid: string,           // Firebase UID
  name: string,          // displayName or email username
  email: string,
  avatar: string,        // photoURL or empty
  provider: string,      // "google" | "github" | "apple" | "email"
  createdAt: Timestamp,  // server timestamp (first login only)
  lastLogin: Timestamp,  // server timestamp (every login)
  xp: 0,
  level: 1,
  streak: 0,
  badges: [],
  completedLessons: [],
  completedQuizzes: [],
  settings: { theme: "system", notifications: true },
  onboarding: { complete: false, step: 0 }
}
```

## User Object Shape (App-Facing)

The `normalizeUser()` function maps Firebase `User` → app shape:

```js
user.id       ← firebaseUser.uid
user.name     ← displayName || email username || 'Explorer'
user.email    ← firebaseUser.email || ''
user.avatar   ← photoURL || first letter of name || 'U'
user.photoURL ← firebaseUser.photoURL || ''
user.provider ← "guest" | "google" | "github" | "apple" | "email"
user.createdAt ← firebaseUser.metadata.createdAt
```

## Error Messages Handled

| Firebase Error Code | User-Friendly Message |
|---|---|
| `auth/popup-closed-by-user` | Sign-in cancelled. Try again. |
| `auth/cancelled-popup-request` | Sign-in cancelled. Try again. |
| `auth/popup-blocked` | Popup was blocked. Allow popups. |
| `auth/network-request-failed` | Network error. Check your connection. |
| `auth/wrong-password` | Wrong password. Try again. |
| `auth/user-not-found` / `auth/invalid-credential` | Invalid email or password. |
| `auth/email-already-in-use` | An account with that email already exists. |
| `auth/weak-password` | Password must be at least 6 characters. |
| `auth/too-many-requests` | Too many attempts. Try again later. |
| `auth/invalid-email` | Please enter a valid email address. |
| `auth/user-disabled` | This account has been disabled. |
| `auth/operation-not-allowed` | Sign-in method not enabled in Firebase Console. |

## Loading States

- **ProtectedRoute** shows spinner with "Loading your session..." while `onAuthStateChanged` resolves
- **LoginScreen** buttons show "Please wait..." and are disabled during async operations
- **AuthProvider** sets `ready=true` only after first auth state resolution

## Manual Firebase Console Settings Required

1. **Enable Authentication providers** at [Firebase Console → Authentication → Sign-in method](https://console.firebase.google.com/project/discovery-dojo/authentication/providers):
   - **Google** — enable, configure OAuth consent screen if needed
   - **GitHub** — enable, enter Client ID and Client Secret from GitHub OAuth App
   - **Apple** — enable, configure Apple Service ID (requires Apple Developer membership)
   - **Email/Password** — enable
   - **Anonymous** — enable (for guest login)

2. **Firestore Security Rules**:
   ```js
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, update: if request.auth != null && request.auth.uid == userId;
         allow create: if request.auth != null && request.auth.uid == userId;
         allow delete: if false;
       }
     }
   }
   ```

3. **Authorized domains** — add `localhost` and your production domain at [Authentication → Settings → Authorized domains](https://console.firebase.google.com/project/discovery-dojo/authentication/settings)

## Verification Checklist

- [ ] Google Sign-In — popup opens, authenticates, redirects to dashboard
- [ ] GitHub Sign-In — popup opens, authenticates, redirects to dashboard
- [ ] Email Signup — creates account, creates Firestore doc with defaults
- [ ] Email Login — signs in, updates `lastLogin`
- [ ] Forgot Password — sends reset email, shows confirmation
- [ ] Guest Login — anonymous session, persists on refresh
- [ ] Logout — clears session, returns to login
- [ ] Refresh — stays logged in
- [ ] Firestore — `users/{uid}` created with all fields on first login
- [ ] No lint errors, no build errors
