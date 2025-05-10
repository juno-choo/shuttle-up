// src/lib/firebase/auth.ts
'use client';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  type User,
  type AuthError,
} from 'firebase/auth';
import { auth } from './client';

const provider = new GoogleAuthProvider();

interface SignInResult {
  user: User | null;
  error: AuthError | null;
}

export async function signInWithGoogle(): Promise<SignInResult> {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return { user, error: null };
  } catch (error) {
    const authError = error as AuthError;
    console.error('Google Sign-In Popup Error:', authError.code, authError.message); // Kept error log
    return { user: null, error: authError };
  }
}

interface SignOutResult {
  success: boolean;
  error: AuthError | null;
}
export async function signOutUser(): Promise<SignOutResult> {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    const authError = error as AuthError;
    console.error('Sign Out Error:', authError.code, authError.message); // Kept error log
    return { success: false, error: authError };
  }
}

export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return onFirebaseAuthStateChanged(auth, callback);
}