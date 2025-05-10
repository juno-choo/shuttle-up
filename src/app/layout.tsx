// src/app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
// Import the new wrapper component
import { ClientProviders } from "@/components/providers/client-providers";
// REMOVE the direct import of AuthProvider:
// import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: "ShuttleUp",
  description: "Your badminton league manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("--- Rendering RootLayout (using ClientProviders) ---");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('antialiased', GeistSans.variable)}
        suppressHydrationWarning // Suppresses hydration mismatch warning during development
      >
        {/* Use the ClientProviders component here */}
        <ClientProviders>{children}</ClientProviders>
        <Toaster />
      </body>
    </html>
  );
}
