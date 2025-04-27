
import type {Metadata} from 'next';
import {GeistSans} from 'geist/font/sans';
// Removed GeistMono as it's not found
import './globals.css';
import {cn} from '@/lib/utils';
// Removed MainLayout import
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context'; // Import AuthProvider

export const metadata: Metadata = {
  title: 'ShuttleUp',
  description: 'Your badminton league manager',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          GeistSans.variable
          // GeistMono.variable removed
        )}
      >
        <AuthProvider> {/* Wrap children with AuthProvider */}
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
