// src/lib/firebase/admin.ts

import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

if (!admin.apps.length) {
  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
    const serviceAccountBuffer = fs.readFileSync(serviceAccountPath, 'utf-8');
    const serviceAccount = JSON.parse(serviceAccountBuffer);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('✅ Firebase Admin initialized using service account file.');
  } catch (err) {
    console.error('❌ Failed to initialize Firebase Admin SDK from file:', err);
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
