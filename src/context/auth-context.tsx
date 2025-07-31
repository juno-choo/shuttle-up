// src/context/auth-context.tsx
"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "firebase/auth";
// Use your actual onAuthStateChanged import
import { onAuthStateChanged } from "@/lib/firebase/auth";

// Firestore imports
import { db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up the listener. It runs once on component mount.
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser); // Set user state immediately
      setLoading(false); // Set loading to false after all async operations are done
      if (firebaseUser) {
        // --- User is logged IN ---

        // Check/create Firestore profile (this can happen in the background)
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          console.log(`Creating Firestore profile for ${firebaseUser.uid}`);
          const displayName = firebaseUser.displayName || "New User";
          await setDoc(userDocRef, {
            displayName: displayName,
            displayName_lowercase: displayName.toLowerCase(),
            email: firebaseUser.email,
            team: "Your Team",
            skillLevel: "Beginner",
            createdAt: serverTimestamp(),
            stats: {
              /* ...stats object... */
            },
          });
        }

        // Set the server-side session cookie
        const idToken = await firebaseUser.getIdToken();
        await fetch("/api/auth/sessionLogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
      } else {
        // --- User is logged OUT ---
        await fetch("/api/auth/sessionLogout", { method: "POST" });
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []); // <-- Use an empty dependency array to run only once

  const isAuthenticated = !!user;
  const value = { user, loading, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
