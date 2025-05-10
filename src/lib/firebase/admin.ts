import * as admin from 'firebase-admin';

console.log('[admin.ts] Starting Firebase Admin initialization...');
let adminAuthInstance = null;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  console.log('[admin.ts] ENV CHECK:', {
    projectId,
    clientEmail,
    hasPrivateKey: !!privateKey,
    previewPrivateKey: privateKey?.slice(0, 40), // DO NOT log full key
  });

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing required Firebase Admin env vars.');
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
    console.log('[admin.ts] ✅ Firebase Admin initialized');
  }

  adminAuthInstance = admin.auth();
} catch (err) {
  console.error('[admin.ts] ❌ Firebase Admin SDK init failed:', err);
}

export const adminAuth = adminAuthInstance;
