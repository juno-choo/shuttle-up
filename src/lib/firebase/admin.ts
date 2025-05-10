// src/lib/firebase/admin.ts
import * as admin from 'firebase-admin';

// Retrieve the private key from environment variables.
// Vercel handles multi-line environment variables, so the \n should be preserved correctly.
// If not, you might need .replace(/\\n/g, '\n') if Vercel somehow escapes it.
// But usually, direct copy-paste of the key from JSON into Vercel UI works.
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

// Check if the necessary environment variables are set
if (!process.env.FIREBASE_PROJECT_ID) {
  console.error('Firebase Admin SDK Config Error: FIREBASE_PROJECT_ID is not set.');
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
  console.error('Firebase Admin SDK Config Error: FIREBASE_CLIENT_EMAIL is not set.');
}
if (!privateKey) {
  console.error('Firebase Admin SDK Config Error: FIREBASE_PRIVATE_KEY is not set or invalid.');
}

// Initialize the Firebase Admin SDK only if it hasn't been initialized yet
if (!admin.apps.length) {
  try {
    // Only attempt to initialize if all required env vars for this method seem present
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey, // Use the private key directly from env
        }),
      });
      console.log('Firebase Admin SDK Initialized Successfully (using individual Vercel env vars).');
    } else {
      console.error('Firebase Admin SDK: Missing one or more required credential environment variables for initialization.');
    }
  } catch (error) {
    console.error('Firebase Admin SDK Initialization Failed:', error);
  }
} else {
  // console.log('Firebase Admin SDK already initialized.'); // Optional
}

// Export the initialized Firebase Admin Authentication service
let adminAuthInstance;
try {
  adminAuthInstance = admin.auth();
} catch (error) {
   console.error("Failed to get admin.auth() instance, likely due to init failure:", error);
   adminAuthInstance = null;
}
export const adminAuth = adminAuthInstance;