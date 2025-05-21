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
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { getStorage } from 'firebase/storage';

// Initialize Firebase
// Check if Firebase has already been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app); 
const storage = getStorage(app);

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




export { app, auth , db, storage}; 