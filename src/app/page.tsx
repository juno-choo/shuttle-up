// src/app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShuttlecockIcon } from "@/components/icons/shuttlecock-icon"; // Assuming this icon is appropriate

export default function UnauthenticatedLandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/50 p-4">
      <div className="text-center max-w-md w-full">
        <ShuttlecockIcon className="h-32 w-32 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-2 cursive-font text-primary">
          Welcome to ShuttleUp!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          The best platform to manage your badminton league.
        </p>
        <Button asChild size="lg">
          <Link href="/login">Login to Get Started</Link>
        </Button>
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} ShuttleUp
      </footer>
    </div>
  );
}
