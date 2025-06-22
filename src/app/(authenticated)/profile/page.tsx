// src/app/(authenticated)/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Users,
  ShieldCheck,
  Pencil,
  Save,
  XCircle,
  UploadCloud,
} from "lucide-react";
import { RacketIcon } from "@/components/icons/racket-icon";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase/client";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

interface UserProfile {
  team?: string;
  skillLevel?: string;
  matchesPlayed?: number;
  matchesWon?: number;
  avatar?: string;
}

type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "N/A";
const skillLevelOptions: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableSkillLevel, setEditableSkillLevel] = useState<SkillLevel>("N/A");
  const [editableTeam, setEditableTeam] = useState<string>("");

  // State to control the visibility of our new dialog
  const [isAvatarInfoOpen, setIsAvatarInfoOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setUserProfile(data);
            setEditableSkillLevel((data.skillLevel as SkillLevel) || "N/A");
            setEditableTeam(data.team || "");
          } else {
            setUserProfile({});
            setEditableSkillLevel("N/A");
            setEditableTeam("");
          }
          setProfileLoading(false);
        },
        (error) => {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
          setProfileLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      setProfileLoading(false);
      setUserProfile(null);
    }
  }, [user]);

  const handleEditToggle = () => {
    if (!isEditing && userProfile) {
      setEditableSkillLevel((userProfile.skillLevel as SkillLevel) || "N/A");
      setEditableTeam(userProfile.team || "Your Team");
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (userProfile) {
      setEditableSkillLevel((userProfile.skillLevel as SkillLevel) || "N/A");
      setEditableTeam(userProfile.team || "");
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, {
        skillLevel: editableSkillLevel,
        team: editableTeam,
      });
      setIsEditing(false);
      console.log("Profile details updated successfully!");
    } catch (error) {
      console.error("Error updating profile details:", error);
    }
  };

  // --- Loading and Fallback States ---
  if (authLoading || (user && profileLoading && !userProfile)) {
    // Skeleton Loader
    return (
      <div className="container mx-auto py-8 max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Card>
          <CardHeader className="flex flex-col items-center text-center border-b pb-6">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-52" />
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">User not found. Please log in.</div>
    );
  }

  const combinedProfile = {
    name: user.displayName || "No Name Provided",
    email: user.email || "No Email Provided",
    avatar: user.photoURL || userProfile?.avatar || "",
    team: userProfile?.team || "N/A",
    skillLevel: (userProfile?.skillLevel as SkillLevel) || "N/A",
    matchesPlayed: userProfile?.matchesPlayed || 0,
    matchesWon: userProfile?.matchesWon || 0,
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        {!isEditing ? (
          <Button variant="outline" onClick={handleEditToggle}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              <XCircle className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              <Save className="mr-2 h-4 w-4" /> Save Details
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center text-center border-b pb-6">
          <div className="relative">
            <Avatar className="h-24 w-24 mb-4">
              {combinedProfile.avatar && (
                <AvatarImage
                  src={combinedProfile.avatar}
                  alt={combinedProfile.name}
                  key={combinedProfile.avatar}
                />
              )}
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-2 right-2 transform translate-x-1/2 -translate-y-1/2 p-2 h-8 w-8 rounded-full shadow-md"
                onClick={() => setIsAvatarInfoOpen(true)}
                title="Change profile picture"
              >
                <UploadCloud className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CardTitle className="text-2xl mt-4">{combinedProfile.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-4 w-4" /> Name
                </Label>
                <Input id="name" value={combinedProfile.name} readOnly />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="flex items-center gap-1 text-muted-foreground">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input id="email" type="email" value={combinedProfile.email} readOnly />
              </div>
              <div className="space-y-1">
                <Label htmlFor="team" className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" /> Team
                </Label>
                {isEditing ? (
                  <Input
                    id="team"
                    value={editableTeam}
                    onChange={(e) => setEditableTeam(e.target.value)}
                  />
                ) : (
                  <Input id="team" value={combinedProfile.team} readOnly />
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="skill" className="flex items-center gap-1 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" /> Skill Level
                </Label>
                {isEditing ? (
                  <Select
                    value={editableSkillLevel}
                    onValueChange={(value) => setEditableSkillLevel(value as SkillLevel)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select skill level" /></SelectTrigger>
                    <SelectContent>
                      {skillLevelOptions.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="skill" value={combinedProfile.skillLevel} readOnly />
                )}
              </div>
            </div>
          </div>
          {/* Stats Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
                  <RacketIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{combinedProfile.matchesPlayed}</div>
                </CardContent>
              </Card>
              <Card className="bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Matches Won</CardTitle>
                  <RacketIcon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{combinedProfile.matchesWon}</div>
                  <p className="text-xs text-muted-foreground">
                    {combinedProfile.matchesPlayed > 0
                      ? `${((combinedProfile.matchesWon / combinedProfile.matchesPlayed) * 100).toFixed(0)}% win rate`
                      : "N/A"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog is now here, at the top level of the return statement */}
      <Dialog open={isAvatarInfoOpen} onOpenChange={setIsAvatarInfoOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              To change your profile picture, please update it directly on your Google account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAvatarInfoOpen(false)}>
                Close
              </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}