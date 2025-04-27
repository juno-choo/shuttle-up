// src/lib/firebase/client.ts
/**
 * @fileOverview Firebase client-side initialization.
 * Initializes the Firebase app and exports authentication and firestore instances.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
// Import necessary auth functions
import {
    getAuth,
    setPersistence, // <--- Import setPersistence
    browserLocalPersistence // <--- Import persistence type
} from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore'; // Uncomment if you need Firestore
import { firebaseConfig } from './config';

// Initialize Firebase
// Check if Firebase has already been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// --- ADD THIS ---
// Explicitly set browser local persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Persistence set successfully
    console.log("Firebase auth persistence set to browserLocalPersistence.");
  })
  .catch((error) => {
    // Handle errors setting persistence
    console.error("Error setting Firebase auth persistence:", error);
  });
// --- END ADD ---


// const db = getFirestore(app); // Uncomment if you need Firestore

export { app, auth /*, db*/ }; // Export auth and db if needed elsewhere