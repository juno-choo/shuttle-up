// src/app/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// UI Components
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
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Users, ShieldCheck } from "lucide-react";
import { RacketIcon } from "@/components/icons/racket-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- TYPE DEFINITIONS ---
interface SportStats {
  matchesPlayed: number;
  matchesWon: number;
}

interface UserProfile {
  team: string;
  skillLevel: string;
  stats: {
    badminton?: SportStats;
    pickleball?: SportStats;
  };
}

// --- HELPER COMPONENT ---
const SportStatsSection = ({
  title,
  stats,
}: {
  title: string;
  stats?: SportStats;
}) => {
  const matchesPlayed = stats?.matchesPlayed ?? 0;
  const matchesWon = stats?.matchesWon ?? 0;

  const winRate =
    matchesPlayed > 0
      ? `${((matchesWon / matchesPlayed) * 100).toFixed(0)}% win rate`
      : "No matches played";

  return (
    <div className="space-y-3">
      <h4 className="text-md font-semibold text-muted-foreground">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Matches Played
            </CardTitle>
            <RacketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matchesPlayed}</div>
          </CardContent>
        </Card>
        <Card className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matches Won</CardTitle>
            <RacketIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matchesWon}</div>
            <p className="text-xs text-muted-foreground">{winRate}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data() as UserProfile);
        } else {
          console.error("No such user profile document!");
        }
      }
      setIsFetchingProfile(false);
    };

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);

  const handleSkillLevelChange = async (newSkillLevel: string) => {
    if (!user || !profileData) return;

    const originalSkillLevel = profileData.skillLevel;
    setProfileData({ ...profileData, skillLevel: newSkillLevel });

    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, { skillLevel: newSkillLevel });
      console.log("Firestore updated successfully.");
    } catch (error) {
      console.error("Failed to update Firestore:", error);
      setProfileData({ ...profileData, skillLevel: originalSkillLevel });
    }
  };

  const isLoading = authLoading || isFetchingProfile;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
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
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <div className="container mx-auto py-8">User not found.</div>;
  }

  const combinedProfile = {
    name: user.displayName || "No Name",
    email: user.email || "No Email",
    avatar: user.photoURL || "",
    team: profileData?.team || "N/A",
    skillLevel: profileData?.skillLevel || "N/A",
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <Card>
        <CardHeader className="flex flex-col items-center text-center border-b pb-6">
          <Avatar className="h-24 w-24 mb-4">
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
                <Select
                  value={profileData?.skillLevel}
                  onValueChange={handleSkillLevelChange}
                  disabled={!profileData}
                >
                  <SelectTrigger id="skill">
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stats</h3>
            <div className="space-y-6">
              <SportStatsSection
                title="Badminton 🏸"
                stats={profileData?.stats?.badminton}
              />
              <SportStatsSection
                title="Pickleball 🥒"
                stats={profileData?.stats?.pickleball}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
