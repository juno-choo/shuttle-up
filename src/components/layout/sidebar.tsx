
// src/components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, CalendarDays, Trophy, Users, LogOut, Settings, PenLine } from 'lucide-react';
import { ShuttlecockIcon } from '@/components/icons/shuttlecock-icon';
import { useAuth } from '@/context/auth-context'; // Import useAuth
import { signOutUser } from '@/lib/firebase/auth'; // Import signOutUser
import { useToast } from '@/hooks/use-toast';


const menuItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/umpire', label: 'Umpire', icon: PenLine }, // Conditionally show based on role later?
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth(); // Get user state
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

  // Optionally hide sidebar content while loading auth state
  // if (loading) {
  //   return <div>Loading...</div>; // Or a skeleton sidebar
  // }

  // If no user, maybe don't render the full sidebar (layout should handle redirection)
  // Layout and middleware handle this redirection, so sidebar might render briefly before redirect
  // if (!user && !loading) {
  //     return null; // Or a minimal sidebar/message
  // }


  return (
    <>
      <SidebarHeader className="border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg px-2">
          <ShuttlecockIcon className="h-6 w-6 text-primary" />
          <span className="text-primary cursive-font">ShuttleUp</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                variant="ghost"
                className="w-full justify-start"
                // Match base path, e.g., /teams should match /teams/123
                isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t p-2">
        <SidebarMenu>
         <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                variant="ghost"
                className="w-full justify-start"
                isActive={pathname === '/settings'}
                tooltip="Settings"
              >
                <Link href="/settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
           <SidebarMenuItem>
              <SidebarMenuButton
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive"
                tooltip="Logout"
                onClick={handleSignOut} // Call sign out function
              >
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

