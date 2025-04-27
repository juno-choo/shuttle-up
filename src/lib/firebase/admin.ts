// src/lib/firebase/admin.ts
import * as admin from 'firebase-admin';

// Check if the GOOGLE_APPLICATION_CREDENTIALS environment variable is set
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
   console.warn('Firebase Admin SDK Warning: GOOGLE_APPLICATION_CREDENTIALS env var not set. SDK will try to use default credentials if available (e.g., on GCP), otherwise initialization might fail.');
   // Depending on your setup, you might want to throw an error here if the file path is required locally
}

// Initialize the Firebase Admin SDK only if it hasn't been initialized yet
if (!admin.apps.length) {
  try {
    console.log('Attempting admin.initializeApp (using GOOGLE_APPLICATION_CREDENTIALS if set)...');
    // When GOOGLE_APPLICATION_CREDENTIALS env var is set,
    // initializeApp() automatically uses it. No need to pass 'credential'.
    admin.initializeApp();
    console.log('Firebase Admin SDK Initialized Successfully.');
  } catch (error) {
    // Log any errors during initialization
    console.error('Firebase Admin SDK Initialization Failed:', error);
  }
} else {
  console.log('Firebase Admin SDK already initialized.');
}

// Export the initialized Firebase Admin Authentication service
let adminAuthInstance;
try {
  // Attempt to get the auth instance (will fail if init failed)
  adminAuthInstance = admin.auth();
} catch (error) {
   console.error("Failed to get admin.auth() instance, likely due to init failure:", error);
   adminAuthInstance = null; // Assign null if retrieval fails
}
export const adminAuth = adminAuthInstance;

// You can also export other admin services if needed later
// export const adminDb = admin.firestore();