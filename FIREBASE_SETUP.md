# Firebase Setup Guide

This guide walks you through connecting Discovery Dojo to Firebase for real authentication and cross-device progress sync.

## Prerequisites

1. A Firebase project (free tier works fine)
2. Node.js 18+

## Step 1: Install Firebase

```bash
npm install firebase
```

## Step 2: Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Create a project** (or select existing)
3. Disable Google Analytics (optional)
4. Wait for the project to provision

## Step 3: Register your web app

1. In the Firebase Console, go to **Project Settings → General → Your apps**
2. Click **Add app → Web** (</> icon)
3. Give it a nickname (e.g. "Discovery Dojo")
4. Copy the `firebaseConfig` object shown

## Step 4: Configure the app

Update `src/lib/firebase.js` with your config:

```js
const firebaseConfig = {
  apiKey: 'AIzaSy...',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123',
  measurementId: 'G-ABCDEF'
}
```

## Step 5: Enable Authentication providers

1. In Firebase Console, go to **Authentication → Sign-in method**
2. Enable the providers you want:

| Provider | How |
|----------|-----|
| **Email/Password** | Enable "Email/Password" toggle |
| **Google** | Enable → configure OAuth consent → add support email |
| **GitHub** | Enable → get Client ID/Secret from GitHub OAuth Apps settings |

## Step 6: Update AuthContext

In `src/context/AuthContext.jsx`:

1. Change `AUTH_MODE` to `'firebase'`
2. Uncomment the Firebase imports
3. Replace the 4 demo function bodies with Firebase SDK calls

```js
import { auth, db } from '../lib/firebase.js'
import {
  signInWithPopup, GoogleAuthProvider, GithubAuthProvider,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'

export const AUTH_MODE = 'firebase' // ← Change this

// Then inside the provider:
async function loginWithProvider(provider) {
  const p = provider === 'google' ? new GoogleAuthProvider()
    : provider === 'github' ? new GithubAuthProvider()
    : null
  if (!p) throw new Error('Unsupported provider')
  const result = await signInWithPopup(auth, p)
  persist(makeFirebaseUser(result.user))
}

async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  persist(makeFirebaseUser(result.user))
}

async function signup(name, email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName: name })
  persist(makeFirebaseUser(result.user))
}

function logout() {
  signOut(auth)
  persist(null)
}
```

## Step 7: Enable Firestore (for progress sync)

1. In Firebase Console, go to **Firestore Database → Create database**
2. Choose **Start in test mode** (you can secure it later)
3. Select a region close to your users

## Step 8: Wire up Firestore progress

Update `src/hooks/useStore.jsx` to use Firestore instead of localStorage:

```js
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { useAuth } from '../context/AuthContext.jsx'

// Replace localStorage load/save with:
const docRef = doc(db, 'progress', uid)

// Load
const snap = await getDoc(docRef)
if (snap.exists()) setState({ ...DEFAULT, ...snap.data() })

// Save
await setDoc(docRef, state, { merge: true })
```

## Security Rules (Firestore)

For production, restrict Firestore access:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Environment variables

Create a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

Then reference them in `firebase.js`:

```js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ...
}
```

> Never commit `.env` to git. It's already in `.gitignore`.
