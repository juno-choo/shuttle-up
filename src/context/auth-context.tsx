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
import { onAuthStateChanged as firebaseOnAuthStateChanged } from "@/lib/firebase/auth"; // Renamed to avoid conflict if User type is also from here
import { useRouter } from "next/navigation";

// Firestore imports
import { db } from "@/lib/firebase/client"; // Make sure this path is correct for your Firestore db instance
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
      // Using renamed import
      const previousUser = previousUserRef.current;
      // Determine if the user object instance itself has changed, or if login/logout occurred.
      // Comparing UIDs is more reliable if the user object might be re-instantiated with the same data.
      const stateChanged = firebaseUser?.uid !== previousUser?.uid;
      previousUserRef.current = firebaseUser;

      setUser(firebaseUser);
      setLoading(false); // Auth state determined, set loading to false

      if (stateChanged) {
        if (firebaseUser) {
          // User is newly logged IN or user instance changed
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
                team: "Your Team", // Example default
                skillLevel: "Beginner", // Example default
                matchesPlayed: 0,
                matchesWon: 0,
                createdAt: serverTimestamp(), // Firestore server timestamp
                // email: firebaseUser.email, // Optional: if you want to store it from Option 2
                // name: firebaseUser.displayName || "New User", // Optional
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
            // Decide how to handle this error. It shouldn't block login unless critical.
          }
          // --- End of Firestore profile check ---

          // Existing sessionLogin logic
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
            } else {
              // Successfully set cookie, now navigate
              router.push("/app"); // Changed from "/" to "/app"
            }
          } catch (error) {
            console.error("Error during sessionLogin fetch:", error);
          }
        } else {
          // User is logged OUT
          console.log("Auth state changed: User is now logged out.");
          try {
            const response = await fetch("/api/auth/sessionLogout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
              console.error(
                "sessionLogout API call failed:",
                response.status,
                await response.text()
              );
            }
          } catch (error) {
            console.error("Error during sessionLogout fetch:", error);
          }
        }
      } else if (firebaseUser && !loading) {
        // This case handles when onAuthStateChanged fires again for an already logged-in user
        // without a state *change* (e.g., token refresh).
        // You might not need to do anything here unless there's a specific action on token refresh.
        console.log(
          "Auth state refreshed for logged-in user:",
          firebaseUser.uid
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]); // router added as dependency

  const isAuthenticated = !!user;
  const value = { user, loading, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
