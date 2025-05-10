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
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

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
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      const previousUser = previousUserRef.current;
      const stateChanged = firebaseUser !== previousUser;
      previousUserRef.current = firebaseUser;

      setUser(firebaseUser);
      setLoading(false);

      if (stateChanged) {
        if (firebaseUser) {
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
              router.push("/");
            }
          } catch (error) {
            console.error("Error during sessionLogin fetch:", error);
          }
        } else {
          // User is logged OUT
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
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]); // router is stable, this effect runs once on mount

  const isAuthenticated = !!user;
  const value = { user, loading, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
