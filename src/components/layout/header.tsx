
// src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Settings, Loader2 } from 'lucide-react';
import { ShuttlecockIcon } from '@/components/icons/shuttlecock-icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/auth-context'; // Import useAuth
import { signOutUser } from '@/lib/firebase/auth'; // Import signOutUser
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth(); // Get user and loading state
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { success, error } = await signOutUser();
    if (success) {
      // Remove the temporary demo cookie on sign out
      document.cookie = "firebaseAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push('/login'); // Redirect to login page after sign out
    } else {
       toast({ title: "Sign Out Failed", description: error?.message || "An unknown error occurred.", variant: "destructive" });
    }
  };

  // Function to get initials from name
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };


  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg ">
          <ShuttlecockIcon className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">ShuttleUp</span>
        </Link>
      </div>
      {loading ? (
         <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {user.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />
                  ) : null}
                  <AvatarFallback>
                    {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.displayName || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
         // Optionally show a login button if not authenticated (layout should handle this)
         <Button asChild variant="outline" size="sm">
            <Link href="/login">Log In</Link>
         </Button>
       )}
    </header>
  );
}
