// src/app/(authenticated)/profile/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react"; // Added useRef
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
  User,
  Mail,
  Users,
  ShieldCheck,
  Pencil,
  Save,
  XCircle,
  UploadCloud,
  AlertCircle,
} from "lucide-react"; // Added UploadCloud, AlertCircle
import { RacketIcon } from "@/components/icons/racket-icon";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

// Firebase imports
import { db, app } from "@/lib/firebase/client"; // Assuming 'app' (FirebaseApp) is exported for storage
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"; // Storage functions
import { updateProfile as updateAuthProfile } from "firebase/auth"; // Auth profile update

interface UserProfile {
  team?: string;
  skillLevel?: string;
  matchesPlayed?: number;
  matchesWon?: number;
  avatar?: string; // Keep avatar field if you want to denormalize or have a fallback
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
  const [editableSkillLevel, setEditableSkillLevel] =
    useState<SkillLevel>("N/A");
  const [editableTeam, setEditableTeam] = useState<string>("");

  // ---- New States for Avatar Upload ----
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(
    null
  );
  // ------------------------------------

  const storage = getStorage(app); // Initialize Firebase Storage

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
    setAvatarUploadError(null); // Clear errors when toggling edit mode
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (userProfile) {
      setEditableSkillLevel((userProfile.skillLevel as SkillLevel) || "N/A");
      setEditableTeam(userProfile.team || "");
    }
    setAvatarUploadError(null);
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

  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }
    const file = event.target.files[0];
    // Basic file type validation (optional)
    if (!file.type.startsWith("image/")) {
      setAvatarUploadError("Please select an image file.");
      return;
    }
    // Basic file size validation (e.g., 5MB, optional)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarUploadError("File size should not exceed 5MB.");
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarUploadError(null);

    try {
      // Use a consistent file name like 'avatar' with the original extension,
      // or just 'avatar' and let Firebase handle/infer type or set it in metadata.
      // For simplicity, let's try to maintain the extension.
      const fileExtension = file.name.split(".").pop();
      const avatarFileName = `avatar.${fileExtension}`;
      const imagePath = `profileImages/${user.uid}/${avatarFileName}`;
      const imageRef = storageRef(storage, imagePath);

      // Optional: Delete old avatar if it exists and you want to prevent multiple files
      // This requires knowing the old file name/path or always using the same name.
      // For simplicity, we'll overwrite or create new if name changes due to extension.

      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update Firebase Auth profile
      await updateAuthProfile(user, { photoURL: downloadURL });
      console.log("Firebase Auth profile updated with new photoURL");

      // Optionally, update Firestore if you store the avatar URL there too
      // This is useful if you want combinedProfile.avatar to potentially come from Firestore
      // or if other parts of your app query Firestore for avatar URLs.
      // If combinedProfile.avatar ALWAYS uses user.photoURL from Auth, this is for denormalization.
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        avatar: downloadURL, // Assuming your UserProfile interface has an 'avatar' field
      });
      console.log("Firestore profile updated with new avatar URL.");
      // The user object in useAuth() should update, triggering a re-render with the new avatar.
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setAvatarUploadError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploadingAvatar(false);
      // Clear the file input so the same file can be re-selected if needed after an error
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ... (Skeleton loading state remains the same)
  if (authLoading || (user && profileLoading && !userProfile)) {
    // Adjusted loading condition
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

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        User not found. Please log in.
      </div>
    );
  }

  // The `user.photoURL` will be updated by `updateAuthProfile`,
  // and `useAuth` should provide the updated `user` object,
  // so `combinedProfile.avatar` will reflect the new image.
  const combinedProfile = {
    name: user.displayName || "No Name Provided",
    email: user.email || "No Email Provided",
    avatar: user.photoURL || userProfile?.avatar || "", // Prioritize Auth, fallback to Firestore if needed
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
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isUploadingAvatar}
            >
              <XCircle className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isUploadingAvatar}>
              <Save className="mr-2 h-4 w-4" /> Save Details
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center text-center border-b pb-6">
          <div className="relative group">
            {" "}
            {/* Added group for hover effects if desired */}
            <Avatar className="h-24 w-24 mb-4">
              {combinedProfile.avatar && (
                <AvatarImage
                  src={combinedProfile.avatar}
                  alt={combinedProfile.name}
                  key={combinedProfile.avatar}
                /> // Added key to force re-render on change
              )}
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileInputRef}
                  onChange={handleAvatarFileChange}
                  disabled={isUploadingAvatar}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-2 right-2 transform translate-x-1/2 -translate-y-1/2 p-2 h-8 w-8 rounded-full shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  title="Change profile picture"
                >
                  {isUploadingAvatar ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    <UploadCloud className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>
          {isUploadingAvatar && (
            <p className="text-sm text-muted-foreground mt-2">
              Uploading image...
            </p>
          )}
          {avatarUploadError && (
            <p className="text-sm text-red-500 mt-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" /> {avatarUploadError}
            </p>
          )}
          <CardTitle className="text-2xl mt-4">
            {combinedProfile.name}
          </CardTitle>
          <CardDescription className="flex items-center gap-1 text-muted-foreground">
            <Mail className="h-4 w-4" /> {combinedProfile.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* ... Details and Stats sections remain the same ... */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name and Email remain read-only as they come from Auth */}
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

              {/* Editable Team */}
              <div className="space-y-1">
                <Label
                  htmlFor="team"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <Users className="h-4 w-4" /> Team
                </Label>
                {isEditing ? (
                  <Input
                    id="team"
                    value={editableTeam}
                    onChange={(e) => setEditableTeam(e.target.value)}
                    disabled={isUploadingAvatar}
                  />
                ) : (
                  <Input id="team" value={combinedProfile.team} readOnly />
                )}
              </div>

              {/* Editable Skill Level */}
              <div className="space-y-1">
                <Label
                  htmlFor="skill"
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <ShieldCheck className="h-4 w-4" /> Skill Level
                </Label>
                {isEditing ? (
                  <Select
                    value={editableSkillLevel}
                    onValueChange={(value) =>
                      setEditableSkillLevel(value as SkillLevel)
                    }
                    disabled={isUploadingAvatar}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevelOptions.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="skill"
                    value={combinedProfile.skillLevel}
                    readOnly
                  />
                )}
              </div>
            </div>
          </div>

          {/* Stats section remains the same */}
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
