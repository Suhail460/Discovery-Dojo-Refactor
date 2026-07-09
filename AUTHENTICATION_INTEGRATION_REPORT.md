# Authentication Integration Report

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/firebase/config.js` | **Replaced** | Firebase SDK initialization using env vars from `.env.local`. Exports `app`, `auth`, `db`, `analytics`. Sets `browserLocalPersistence` for persistent sessions. |
| `src/context/AuthContext.jsx` | **Replaced** | Removed demo/localStorage auth. Full Firebase Authentication implementation. |
| `src/router/ProtectedRoute.jsx` | **Created** | Route guard component — shows loading spinner while auth state resolves, renders `<LoginScreen />` if unauthenticated, otherwise renders children. |
| `src/router/AppRouter.jsx` | **Updated** | Uses `ProtectedRoute` instead of inline `AuthGuard`. |
| `src/main.jsx` | **Updated** | Removed unused `app` import and `console.log`. |

## Authentication Flow

### Google Sign-In
- `loginWithProvider('google')` → `GoogleAuthProvider` + `signInWithPopup`
- Sets `prompt: 'select_account'` to force account selection
- On success: creates/updates Firestore `users/{uid}` document, normalizes user, sets state

### Email Signup
- `signup(name, email, password)` → `createUserWithEmailAndPassword` + `updateProfile` (displayName)
- Immediately creates Firestore `users/{uid}` document with full profile

### Email Login
- `loginWithEmail(email, password)` → `signInWithEmailAndPassword`
- Updates `lastLogin` timestamp in Firestore

### Anonymous Guest Login
- `loginAsGuest()` → `signInAnonymously` — creates a real Firebase anonymous session
- Guest users persist across browser refreshes

### Logout
- `logout()` → `signOut(auth)` → clears user state

### Auth State Persistence
- `browserLocalPersistence` set in config.js — user stays logged in across browser restarts
- `onAuthStateChanged` listener handles session restore on mount

## Firestore Document Flow

### Document: `users/{uid}`

Created on first signup (any method). Updated on subsequent logins.

**Fields:**
```
displayName: string
email: string
photoURL: string
provider: "google" | "email" | "anonymous"
createdAt: Timestamp (server)
lastLogin: Timestamp (server)
xp: 0
level: 1
streak: 0
badges: []
completedLessons: []
completedQuizzes: []
settings: { theme: "system", notifications: true }
```

### Behavior
- **Existing user logs in**: `lastLogin` updated via `updateDoc`
- **New user signs up**: Full document created via `setDoc` with defaults
- **Anonymous guests**: No Firestore document created (anonymous users have no uid reference)

## Security Improvements

| Area | Before | After |
|------|--------|-------|
| **Password storage** | Plaintext in localStorage | Firebase Auth (bcrypt hashed, server-side) |
| **Session tokens** | localStorage JSON (malleable) | Firebase ID tokens (cryptographically signed) |
| **User data isolation** | None (all users in one localStorage key) | Firestore security rules per UID |
| **Social login** | Mocked (fabricated accounts) | Real OAuth via Google |
| **Error handling** | Basic messages | Mapped Firebase error codes → user-friendly messages |
| **Loading state** | Synchronous (instant `ready`) | Async with spinner during session resolution |

## Error Messages Handled

`auth/popup-closed-by-user`, `auth/cancelled-popup-request`, `auth/popup-blocked`, `auth/network-request-failed`, `auth/wrong-password`, `auth/user-not-found`, `auth/invalid-credential`, `auth/email-already-in-use`, `auth/weak-password`, `auth/too-many-requests`, `auth/invalid-email`, `auth/user-disabled`, `auth/operation-not-allowed`

## User Object Shape

The app's existing components expect: `{ id, name, email, avatar, provider, createdAt }`

The `normalizeUser()` function maps Firebase's `User` object to this shape:
```
id       ← firebaseUser.uid
name     ← firebaseUser.displayName || email username || 'Explorer'
email    ← firebaseUser.email || ''
avatar   ← firebaseUser.photoURL || first letter of displayName
provider ← firebaseUser.isAnonymous ? 'guest' : providerId
createdAt ← firebaseUser.metadata.createdAt
```

## Manual Firebase Console Settings Required

1. **Enable Authentication providers** at [Firebase Console → Authentication → Sign-in method](https://console.firebase.google.com/project/discovery-dojo/authentication/providers):
   - **Google** — enable, configure OAuth consent screen if needed
   - **Email/Password** — enable
   - **Anonymous** — enable (for guest login)

2. **Firestore Security Rules** — deploy rules that allow read/write only for the authenticated user's own document:
   ```js
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

3. **Authorized domains** (if using Firebase Hosting or custom domain) — add to [Authentication → Settings → Authorized domains](https://console.firebase.google.com/project/discovery-dojo/authentication/settings)
