// src/app/(authenticated)/layout.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout"; // Ensure this path is correct
import { useAuth } from "@/context/auth-context";

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect redirects if not loading and no user is found.
    // This handles direct access attempts or post-logout scenarios.
    if (!loading && !user) {
      console.log(
        "AuthenticatedLayout Effect: Not loading and no user, redirecting to /login"
      );
      router.push("/login");
    }
    // Dependencies are correct: run when user, loading, or router changes.
  }, [user, loading, router]);

  // --- Revised Render Logic ---

  // 1. While authentication is loading, show a clear loading state.
  if (loading) {
    console.log("AuthenticatedLayout Render: Loading authentication...");
    // Return your loading component or a simple div
    return (
      <div className="flex items-center justify-center min-h-screen">
        Authenticating...
      </div>
    );
  }

  // 2. If loading is complete BUT there is no user:
  //    The useEffect above will trigger the redirect. We should render nothing
  //    or the loader briefly while that happens to prevent flashing content.
  if (!user) {
    console.log(
      "AuthenticatedLayout Render: User not found after load, waiting for redirect effect."
    );
    // Return null (cleanest) or your loader component again.
    // Avoids trying to render MainLayout when user is null.
    return null;
    // Or: return <div className="flex items-center justify-center min-h-screen">Authenticating...</div>;
  }

  // 3. If loading is complete AND we have a user:
  //    Render the main application layout and the actual page content.
  console.log(
    "AuthenticatedLayout Render: Rendering children for authenticated user."
  );
  return <MainLayout>{children}</MainLayout>;
}
