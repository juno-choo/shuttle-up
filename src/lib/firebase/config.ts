
// src/lib/firebase/config.ts
/**
 * @fileOverview Firebase configuration object.
 * Loads Firebase settings from environment variables.
 */

// Ensure these variables are defined in your .env.local file
// These are read at build time, so restart the server after changing them.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Basic check to ensure config values are present
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId
) {
  console.warn(
    'Firebase configuration is missing or incomplete. Please check your environment variables.'
  );
  // Optionally throw an error in production builds
  // if (process.env.NODE_ENV === 'production') {
  //   throw new Error('Firebase configuration is missing. Set NEXT_PUBLIC_FIREBASE_* environment variables.');
  // }
}


export { firebaseConfig };
