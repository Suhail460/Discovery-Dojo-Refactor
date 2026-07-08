/* ============================================================================
   FIRESTORE DATA LAYER
   ----------------------------------------------------------------------------
   Uncomment and wire up when Firebase is configured. Replaces localStorage
   in useStore.jsx with Firestore document reads/writes scoped to the user.
   ============================================================================ */

// import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
// import { db } from './firebase.js'
//
// const PROGRESS_COLLECTION = 'progress'
//
// function docRef(uid) {
//   return doc(db, PROGRESS_COLLECTION, uid)
// }
//
// export async function loadProgress(uid) {
//   const snap = await getDoc(docRef(uid))
//   return snap.exists() ? snap.data() : null
// }
//
// export async function saveProgress(uid, data) {
//   await setDoc(docRef(uid), data, { merge: true })
// }
//
// export async function resetProgress(uid) {
//   await setDoc(docRef(uid), DEFAULT_PROGRESS)
// }

export const DEFAULT_PROGRESS = {
  xp: 0, completed: [], quizScores: {}, quizWins: 0, reflections: {}, confidence: {},
  interviews: [], generated: 0, capstone: {}, capstoneDone: false,
  streak: 0, lastActive: null, weak: [], strong: [], badges: []
}
