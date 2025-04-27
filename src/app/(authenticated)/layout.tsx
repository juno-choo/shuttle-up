// src/app/(authenticated)/layout.tsx
'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout'; // Ensure this path is correct
import { useAuth } from '@/context/auth-context';

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    // The middleware handles the primary redirect, but this provides
    // an additional client-side check, especially useful after client-side logout.
    if (!loading && !user) {
      console.log('AuthenticatedLayout: Not loading and no user, redirecting to /login'); // Client-side log
      // document.cookie = "firebaseAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // REMOVED THIS LINE
      router.push('/login');
    }
    // REMOVED the else if block that set firebaseAuth=true cookie
  }, [user, loading, router]);

  // Prevent rendering children until authentication is confirmed and user exists.
  // This prevents flashing protected content to logged-out users.
  if (loading || !user) {
    // You can return a proper loading skeleton or component here
    return <div className="flex items-center justify-center min-h-screen">Authenticating.</div>;
  }

  // If authenticated and loaded, render the main layout with the children pages
  console.log('AuthenticatedLayout: Rendering children for authenticated user.'); // Client-side log
  return <MainLayout>{children}</MainLayout>;
}