// src/context/auth-context.tsx
'use client';

import type { ReactNode } from 'react';
// ADD useRef import
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from '@/lib/firebase/auth'; // Your wrapper function

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true, // Start as true until the first auth check completes
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Still true initially
  // Ref to track the previous user state to prevent redundant API calls
  const previousUserRef = useRef<User | null>(null);

  useEffect(() => {
    console.log('AuthProvider mounted, setting up listener.'); // Client-side log

    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      console.log('onAuthStateChanged triggered. User:', firebaseUser?.uid || 'null'); // Client-side log

      // --- CHECK IF AUTH STATE ACTUALLY CHANGED ---
      // Compare current user UID with the UID stored in the ref from the previous run
      const previousUser = previousUserRef.current;
      const stateChanged = firebaseUser?.uid !== previousUser?.uid;
      // --- END CHECK ---

      // Update the user state in the context regardless of change
      // This ensures the UI reflects the latest state from Firebase SDK
      setUser(firebaseUser);
      // Set loading to false once we have the initial auth state
      setLoading(false);

      // Only call API to sync session cookie if the state *actually changed*
      if (stateChanged) {
        console.log(`Auth state changed: ${previousUser?.uid || 'null'} -> ${firebaseUser?.uid || 'null'}. Syncing cookie.`);
        if (firebaseUser) {
          // User is logged IN (state changed from null to user)
          console.log('User found, attempting to set session cookie...'); // Client-side log
          try {
            // Get the ID token from Firebase
            const idToken = await firebaseUser.getIdToken();
            // Send the ID token to your sessionLogin API route
            const response = await fetch('/api/auth/sessionLogin', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ idToken }),
            });
            if (!response.ok) {
               // Log error if API call failed
               console.error('sessionLogin API call failed:', response.status, await response.text());
            } else {
               console.log('sessionLogin API call successful.'); // Client-side log
            }
          } catch (error) {
            console.error('Error during sessionLogin fetch:', error);
          }
        } else {
          // User is logged OUT (state changed from user to null)
          console.log('User not found, attempting to clear session cookie...'); // Client-side log
          try {
            // Call the sessionLogout API route
            const response = await fetch('/api/auth/sessionLogout', {
                method: 'POST'
                // No body needed for logout
            });
             if (!response.ok) {
               // Log error if API call failed
               console.error('sessionLogout API call failed:', response.status, await response.text());
            } else {
               console.log('sessionLogout API call successful.'); // Client-side log
            }
          } catch (error) {
            console.error('Error during sessionLogout fetch:', error);
          }
        }
      } else {
         // Log if the state didn't change (e.g., listener fired but user is still null, or still the same user)
         console.log('Auth state is the same as previous state. No cookie sync needed.');
      }

      // Update the ref AFTER processing the current state, so it's ready for the *next* check
      previousUserRef.current = firebaseUser;
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('AuthProvider unmounting, unsubscribing listener.'); // Client-side log
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticated,
  };

  // Optional: Render nothing or a loader until loading is false
  // This prevents brief flashes of incorrect UI state
  // if (loading) {
  //   return null; // Or your global loading component
  // }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};