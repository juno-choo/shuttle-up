// src/components/providers/client-providers.tsx
"use client"; // VERY IMPORTANT: Mark this component as a Client Component

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/auth-context";
// If you have other client-side providers (Theme, QueryClient, etc.), import them here too

export function ClientProviders({ children }: { children: ReactNode }) {
  console.log("--- Rendering ClientProviders (wraps AuthProvider) ---");
  return (
    <AuthProvider>
      {/* Wrap children with other providers here if needed */}
      {children}
    </AuthProvider>
  );
}
