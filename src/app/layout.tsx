// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Assuming Inter is not used for body className directly
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ClientProviders } from "@/components/providers/client-providers";

// If you're using the Inter font, apply it to the body or html tag.
// For example, if you initialized it like: const inter = Inter({ subsets: ['latin'] });
// Then you might use inter.className on the body or html tag.

export const metadata: Metadata = {
  title: "ShuttleUp",
  description: "Your badminton league manager",
  icons: {
    icon: "/favico.ico", // This is where you link your favicon
    // You can also add other icon types if needed:
    // shortcut: '/favico.ico', // For older browsers, often covered by 'icon'
    // apple: '/apple-touch-icon.png', // For Apple devices
    // other: [
    //   { rel: 'apple-touch-icon-precomposed', url: '/apple-touch-icon-precomposed.png' },
    // ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* If using Inter font, you might add its class here or to body: className={inter.className} */}
      <body className={cn("antialiased")} suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
        <Toaster />
      </body>
    </html>
  );
}
