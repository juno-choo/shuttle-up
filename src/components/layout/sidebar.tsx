// src/components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Home,
  CalendarDays,
  Trophy,
  Users,
  LogOut,
  Settings,
  PenLine,
  PanelLeftClose,
} from "lucide-react";
import { ShuttlecockIcon } from "@/components/icons/shuttlecock-icon";
import { useAuth } from "@/context/auth-context";
import { signOutUser } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/standings", label: "Standings", icon: Trophy },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/umpire", label: "Umpire", icon: PenLine },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  // const { user } = useAuth(); // 'user' not directly used in rendering

  const {
    isMobile,
    open, // Desktop sidebar expanded state
    openMobile, // Mobile sheet open state
    toggleSidebar,
  } = useSidebar();

  const isVisuallyExpanded = isMobile ? openMobile : open;

  const handleSignOut = async () => {
    const { success, error } = await signOutUser();
    if (success) {
      document.cookie =
        "firebaseAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      // If on mobile and the sheet is open, close it before redirecting.
      if (isMobile && openMobile) {
        toggleSidebar();
      }
      router.push("/login");
    } else {
      toast({
        title: "Sign Out Failed",
        description: error?.message || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleMenuItemClick = () => {
    // --- MODIFIED BEHAVIOR ---
    // Only auto-close the sidebar (Sheet) on menu item click if:
    // 1. We are in mobile view (isMobile === true)
    // 2. The mobile sidebar (Sheet) is currently open (openMobile === true)
    if (isMobile && openMobile) {
      toggleSidebar();
    }
    // On desktop, clicking a menu item will navigate but will NOT change
    // the sidebar's current expanded/collapsed state.
    // --- END OF MODIFIED BEHAVIOR ---
  };

  return (
    <>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between w-full h-14 px-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg"
            onClick={handleMenuItemClick} // This will now only close on mobile if open
          >
            <ShuttlecockIcon className="h-6 w-6 text-primary" />
            {isVisuallyExpanded && (
              <span className="text-primary cursive-font">ShuttleUp</span>
            )}
          </Link>
          {isVisuallyExpanded && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar} // This button still toggles normally for both mobile/desktop
              aria-label="Close sidebar"
              className="ml-auto"
            >
              <PanelLeftClose className="h-5 w-5" />
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                variant="default"
                className="w-full justify-start"
                isActive={
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href))
                }
                tooltip={item.label}
              >
                <Link href={item.href} onClick={handleMenuItemClick}>
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
              variant="default"
              className="w-full justify-start"
              isActive={pathname === "/settings"}
              tooltip="Settings"
            >
              <Link href="/settings" onClick={handleMenuItemClick}>
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              variant="default"
              className="w-full justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive"
              tooltip="Logout"
              onClick={handleSignOut} // Sign out has its own logic for closing if needed
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
