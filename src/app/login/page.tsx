// src/app/login/page.tsx
'use client';

// Removed useEffect import as it's no longer needed here
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShuttlecockIcon } from '@/components/icons/shuttlecock-icon';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
// Removed firebase imports for getRedirectResult/auth as they aren't needed here

// Simple Google Icon SVG (remains the same)
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-.97 2.53-1.94 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.63 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
);


export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth(); // Gets state from context
  const { toast } = useToast();

  // REMOVED the useEffect block that called getRedirectResult

  // handleGoogleSignIn calls the popup version from auth.ts again
  const handleGoogleSignIn = async () => {
    console.log("Initiating Google Sign-In Popup...");
    // Calls the reverted signInWithGoogle which now uses signInWithPopup
    const { user: signedInUser, error } = await signInWithGoogle();

    // Handle popup result directly here (optional, as AuthProvider also handles state change via listener)
    if (signedInUser) {
      // AuthProvider's onAuthStateChanged will fire and handle session cookie.
      // Redirect is handled by the logic below checking useAuth().
      // We can just show a success toast here.
      toast({ title: "Sign-In Successful", description: `Welcome back!` });
    } else if (error) {
      // Handle popup errors (e.g., popup closed by user, network error)
      // Avoid showing toast for 'popup-closed-by-user' if desired
      if (error.code !== 'auth/popup-closed-by-user') {
         toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      } else {
         // Optionally log less intrusively if the user simply closed the popup
         console.log("Popup closed by user.");
      }
    }
  };

  // Logic to handle loading state and redirecting already logged-in users:
  // This relies on the AuthProvider updating the 'user' state via onAuthStateChanged
  if (loading) {
      // Display loading indicator while checking auth state
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  // Check user from context (updated by AuthProvider via onAuthStateChanged)
  if (user) {
      // If user is found in context (meaning logged in), redirect to dashboard
      console.log("User found in context, redirecting from Login page...");
      router.push('/'); // Redirect after successful login is detected by context
      return null; // Prevent rendering login form while redirecting
  }

  // Render login page content only if not loading and not logged in
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/50 p-4">
      <div className="text-center max-w-md w-full">
        <ShuttlecockIcon className="h-32 w-32 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-2 cursive-font text-primary">ShuttleUp</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A badminton league platform
        </p>
        <Button
          onClick={handleGoogleSignIn}
          className="w-full max-w-xs"
          size="lg"
        >
          <GoogleIcon />
          <span className="ml-2">Sign in with Google</span>
        </Button>
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} ShuttleUp
      </footer>
    </div>
  );
}