// src/components/layout/coming-soon-overlay.tsx

import { Construction } from "lucide-react";

export function ComingSoonOverlay() {
  return (
    // This div will cover its parent container
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Construction className="h-12 w-12 mb-4 text-muted-foreground" />
      <h2 className="text-2xl font-bold text-center">Feature Coming Soon</h2>
      <p className="text-muted-foreground">Please stay tuned!</p>
    </div>
  );
}
