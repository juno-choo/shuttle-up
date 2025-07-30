"use client"; // Required to use the usePathname hook

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import { ComingSoonOverlay } from "@/components/layout/coming-soon-overlay"; // Import the overlay

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  // Get the current URL path
  const pathname = usePathname();

  // Define which pages should have the overlay
  const pagesWithOverlay = [
    "/app/schedule",
    "/app/standings",
    "/app/teams",
    "/app/umpire",
  ];

  // Check if the current page is one of them
  const showOverlay = pagesWithOverlay.includes(pathname);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Header />
        {/* 1. Add `relative` to make this the boundary for the overlay.
         */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          {/* 2. Conditionally render the overlay.
           */}
          {showOverlay && <ComingSoonOverlay />}

          {/* 3. Conditionally wrap children to apply the blur.
           */}
          <div className={showOverlay ? "blur-sm pointer-events-none" : ""}>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
