// src/lib/firebase/auth.ts
'use client'; // This file might be used in client components

/**
 * @fileOverview Firebase authentication helper functions.
 */
import {
  getAuth,
  signInWithPopup, // Use Popup again
  // signInWithRedirect, // No longer using redirect
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged, // Rename to avoid conflict
  type User,
  type AuthError,
} from 'firebase/auth';
import { auth } from './client'; // Import the initialized auth instance

const provider = new GoogleAuthProvider();

// --- Sign In with Google ---
interface SignInResult {
  user: User | null;
  error: AuthError | null;
}

// Reverted back to using signInWithPopup
export async function signInWithGoogle(): Promise<SignInResult> {
  try {
    console.log("Attempting signInWithPopup..."); // Add log
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log("signInWithPopup successful, user:", user.uid); // Add log
    // NOTE: AuthProvider will handle calling sessionLogin API via onAuthStateChanged listener
    return { user, error: null };
  } catch (error) {
    // Handle Errors here.
    const authError = error as AuthError;
    // const errorCode = authError.code;
    // const errorMessage = authError.message;
    // The email of the user's account used.
    // const email = authError.customData?.email;
    // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(authError);
    console.error('Google Sign-In Popup Error:', authError); // Updated log message
    // Don't return sensitive info like credential in the error result
    return { user: null, error: authError };
  }
}

// --- Sign Out --- (Remains the same)
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
    console.error('Sign Out Error:', authError);
    return { success: false, error: authError };
  }
}

// --- Auth State Listener --- (Remains the same)
// Wraps Firebase's onAuthStateChanged to provide a simpler interface
export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return onFirebaseAuthStateChanged(auth, callback);
}