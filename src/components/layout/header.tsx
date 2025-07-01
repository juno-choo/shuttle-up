// src/components/layout/header.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
// Import useSidebar to potentially change the icon based on state
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Import PanelLeftOpen if you want to change icon, PanelLeft is default in SidebarTrigger
import {
  User,
  LogOut,
  Settings,
  Loader2,
  PanelLeftOpen,
  PanelRightOpen,
} from "lucide-react";
import { ShuttlecockIcon } from "@/components/icons/shuttlecock-icon";
// useIsMobile might not be strictly necessary for the trigger's visibility anymore,
// but can be kept if other elements depend on it.
// import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from "@/context/auth-context";
import { signOutUser, auth } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  // const isMobile = useIsMobile(); // Kept if needed, but not for SidebarTrigger visibility
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Use sidebar context to make the trigger icon dynamic if desired
  const { open, isMobile, openMobile } = useSidebar();
  const isSidebarActuallyOpen = isMobile ? openMobile : open;

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/sessionLogout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to clear session cookie.");
      }
      await import("firebase/auth").then(({ signOut }) => signOut(auth));
      document.cookie =
        "firebaseAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      router.push("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Sign Out Failed",
        description: error?.message || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        {/* SidebarTrigger is now always rendered */}
        {/* It uses PanelLeft by default from your ui/sidebar.tsx */}
        {/* You can customize its icon further if needed by modifying SidebarTrigger or passing children */}
        <SidebarTrigger>
          {/* Example: Dynamically change icon based on sidebar state */}
          {/* This would require SidebarTrigger to accept children and render them instead of its default PanelLeft */}
          {/* For simplicity, relying on the default PanelLeft in SidebarTrigger is fine. */}
          {/* If you want a different icon when open, e.g., PanelRightOpen for "close": */}
          {/* {isSidebarActuallyOpen ? <PanelRightOpen className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />} */}
        </SidebarTrigger>
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg "
        >
          <ShuttlecockIcon className="h-6 w-6 text-primary" />
          {/* Hide ShuttleUp text if sidebar is collapsed on desktop to prevent overlap, */}
          {/* or adjust spacing. Let's assume the trigger provides enough space. */}
          {/* Or, only show it if the sidebar is expanded: */}
          {/* {isSidebarActuallyOpen && <span className="hidden sm:inline">ShuttleUp</span>} */}
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
                  <AvatarImage
                    src={user.photoURL}
                    alt={user.displayName || "User Avatar"}
                  />
                ) : null}
                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user.displayName || "My Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/app/profile"
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/app/settings"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href="/login">Log In</Link>
        </Button>
      )}
    </header>
  );
}
