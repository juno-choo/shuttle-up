// src/app/app/profile/page.tsx
"use client"; // Keep client component for potential future state/interactions

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Mail, Users, ShieldCheck } from "lucide-react";
import { RacketIcon } from "@/components/icons/racket-icon";
import { useAuth } from "@/context/auth-context"; // Import useAuth
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Mock user data (will be replaced/augmented by auth user)
const userProfileData = {
  // name: 'Alex Johnson', // From auth
  // email: 'alex.j@example.com', // From auth
  // avatar: 'https://picsum.photos/seed/alex/100/100', // From auth
  team: "Your Team", // Example - would likely come from Firestore
  skillLevel: "Intermediate", // Example - would likely come from Firestore
  matchesPlayed: 10, // Example - would likely come from Firestore
  matchesWon: 6, // Example - would likely come from Firestore
};

export default function ProfilePage() {
  const { user, loading } = useAuth(); // Get user and loading state

  // Handle loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Card>
          <CardHeader className="flex flex-col items-center text-center border-b pb-6">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-8 w-24 mt-4" />
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-6 w-16 mb-4 mt-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle case where user is somehow not available after loading (should be caught by layout)
  if (!user) {
    return <div className="container mx-auto py-8">User not found.</div>;
  }

  // Combine auth user data with mock profile data
  const combinedProfile = {
    name: user.displayName || "No Name Provided",
    email: user.email || "No Email Provided",
    avatar: user.photoURL || "", // Use photoURL from Google Sign-In
    ...userProfileData, // Spread the rest of the mock data
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <Card>
        <CardHeader className="flex flex-col items-center text-center border-b pb-6">
          <Avatar className="h-24 w-24 mb-4">
            {/* Use AvatarImage only if combinedProfile.avatar exists */}
            {combinedProfile.avatar && (
              <AvatarImage
                src={combinedProfile.avatar}
                alt={combinedProfile.name}
              />
            )}
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{combinedProfile.name}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-muted-foreground">
            <Mail className="h-4 w-4" /> {combinedProfile.email}
          </CardDescription>
          <Button variant="outline" size="sm" className="mt-4">
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <User className="h-4 w-4" /> Name
                </Label>
                <Input id="name" value={combinedProfile.name} readOnly />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={combinedProfile.email}
                  readOnly
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="team"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <Users className="h-4 w-4" /> Team
                </Label>
                <Input id="team" value={combinedProfile.team} readOnly />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="skill"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <ShieldCheck className="h-4 w-4" /> Skill Level
                </Label>
                <Input id="skill" value={combinedProfile.skillLevel} readOnly />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Matches Played
                  </CardTitle>
                  <RacketIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {combinedProfile.matchesPlayed}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Matches Won
                  </CardTitle>
                  <RacketIcon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {combinedProfile.matchesWon}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {combinedProfile.matchesPlayed > 0
                      ? `${(
                          (combinedProfile.matchesWon /
                            combinedProfile.matchesPlayed) *
                          100
                        ).toFixed(0)}% win rate`
                      : "N/A"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
