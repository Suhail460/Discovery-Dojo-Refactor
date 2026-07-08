/* ============================================================================
   FIREBASE CONFIGURATION
   ----------------------------------------------------------------------------
   Rename this file to firebase.js and fill in your values from the Firebase
   Console (Project Settings > General > Your apps > Web app).
   ============================================================================ */

// import { initializeApp } from 'firebase/app'
// import { getAuth } from 'firebase/auth'
// import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID'
}

// const app = initializeApp(firebaseConfig)
// export const auth = getAuth(app)
// export const db = getFirestore(app)
// export default app

export { firebaseConfig }
