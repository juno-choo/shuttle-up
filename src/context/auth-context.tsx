// src/context/auth-context.tsx
"use client";

import type { ReactNode } from "react";
// ADD useRef import
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "@/lib/firebase/auth"; // Your wrapper function

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
    console.log("AuthProvider mounted, setting up listener."); // Client-side log

    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      console.log(
        "onAuthStateChanged triggered. User:",
        firebaseUser?.uid || "null"
      ); // Client-side log

      // --- CHECK IF AUTH STATE ACTUALLY CHANGED (using object reference) ---
      const previousUser = previousUserRef.current;
      // Compare the actual user objects/null reference
      const stateChanged = firebaseUser !== previousUser;
      // Update the ref *before* the async API calls, but after the check
      previousUserRef.current = firebaseUser;
      // --- END CHECK ---

      // Update the user state in the context regardless of change
      // This ensures the UI reflects the latest state from Firebase SDK
      setUser(firebaseUser);
      // Set loading to false once we have the initial auth state
      setLoading(false);

      // Only call API to sync session cookie if the state *actually changed*
      if (stateChanged) {
        console.log(
          `Auth state changed: ${previousUser?.uid || "null"} -> ${
            firebaseUser?.uid || "null"
          }. Syncing cookie.`
        );
        if (firebaseUser) {
          // User is logged IN
          console.log("User found, attempting to set session cookie..."); // Client-side log
          try {
            const idToken = await firebaseUser.getIdToken();
            // --- Using Full Fetch Options Here ---
            const response = await fetch("/api/auth/sessionLogin", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ idToken }),
            });
            // --- End Full Fetch Options ---
            if (!response.ok) {
              console.error(
                "sessionLogin API call failed:",
                response.status,
                await response.text()
              );
            } else {
              console.log("sessionLogin API call successful."); // Client-side log
            }
          } catch (error) {
            console.error("Error during sessionLogin fetch:", error);
          }
        } else {
          // User is logged OUT
          console.log("User not found, attempting to clear session cookie..."); // Client-side log
          try {
            // --- Using Full Fetch Options Here (though body isn't needed) ---
            const response = await fetch("/api/auth/sessionLogout", {
              method: "POST",
              headers: {
                // Optional headers for POST, but good practice
                "Content-Type": "application/json",
              },
              // No body needed for logout
            });
            // --- End Full Fetch Options ---
            if (!response.ok) {
              console.error(
                "sessionLogout API call failed:",
                response.status,
                await response.text()
              );
            } else {
              console.log("sessionLogout API call successful."); // Client-side log
            }
          } catch (error) {
            console.error("Error during sessionLogout fetch:", error);
          }
        }
      } else {
        // Log if the state didn't change
        console.log(
          "Auth state is the same as previous state. No cookie sync needed."
        );
      }
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("AuthProvider unmounting, unsubscribing listener."); // Client-side log
      unsubscribe();
    };
  }, []); // Empty dependency array still correct

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticated,
  };

  // Optional: Render nothing or a loader until loading is false
  // if (loading) {
  //   return null; // Or your global loading component
  // }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
