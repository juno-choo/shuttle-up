// src/context/auth-context.tsx
"use client";

import type { ReactNode } from "react";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged as firebaseOnAuthStateChanged } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

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
  const previousUserRef = useRef<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(async (firebaseUser) => {
      const previousUser = previousUserRef.current;
      const stateChanged = firebaseUser?.uid !== previousUser?.uid;
      previousUserRef.current = firebaseUser;

      setUser(firebaseUser);
      setLoading(false);

      if (stateChanged) {
        if (firebaseUser) {
          console.log(
            "Auth state changed: User is now logged in.",
            firebaseUser.uid
          );

          // --- Check and create Firestore user profile document ---
          const userDocRef = doc(db, "users", firebaseUser.uid);
          try {
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
              console.log(
                `No profile document found for UID: ${firebaseUser.uid}. Creating one...`
              );

              await setDoc(userDocRef, {
                displayName: firebaseUser.displayName || "New User",
                email: firebaseUser.email,
                team: "Your Team",
                skillLevel: "Beginner",
                createdAt: serverTimestamp(),
                stats: {
                  badminton: {
                    matchesPlayed: 0,
                    matchesWon: 0,
                  },
                  pickleball: {
                    matchesPlayed: 0,
                    matchesWon: 0,
                  },
                },
              });

              console.log(
                "New user profile created in Firestore for UID:",
                firebaseUser.uid
              );
            } else {
              console.log(
                "Profile document already exists for UID:",
                firebaseUser.uid
              );
            }
          } catch (error) {
            console.error(
              "Error checking or creating user profile in Firestore:",
              error
            );
          }
          // --- End of Firestore profile check ---

          try {
            const idToken = await firebaseUser.getIdToken();
            const response = await fetch("/api/auth/sessionLogin", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken }),
            });
            if (!response.ok) {
              console.error(
                "sessionLogin API call failed:",
                response.status,
                await response.text()
              );
            }
          } catch (error) {
            console.error("Error during sessionLogin fetch:", error);
          }
        } else {
          console.log("Auth state changed: User is now logged out.");
          try {
            await fetch("/api/auth/sessionLogout", { method: "POST" });
          } catch (error) {
            console.error("Error during sessionLogout fetch:", error);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  const isAuthenticated = !!user;
  const value = { user, loading, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
