// src/app/app/settings/page.tsx
"use client"; // Needed for potential future interactions like theme switching

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Lock, Palette } from "lucide-react";

export default function SettingsPage() {
  // Add logic for theme switching if implementing dark mode toggle later
  // const handleThemeChange = (checked: boolean) => {
  //   if (checked) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  //   // Persist preference (e.g., in localStorage)
  // };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </CardTitle>
          <CardDescription>
            Manage your notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="match-reminders"
              className="flex flex-col space-y-1"
            >
              <span>Match Reminders</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive reminders for your upcoming matches.
              </span>
            </Label>
            <Switch id="match-reminders" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="result-updates" className="flex flex-col space-y-1">
              <span>Result Updates</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get notified when match results are posted.
              </span>
            </Label>
            <Switch id="result-updates" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="league-news" className="flex flex-col space-y-1">
              <span>League News</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive general league announcements.
              </span>
            </Label>
            <Switch id="league-news" />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> Account Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Note: Changing password for Google Sign-In usually happens via Google account settings */}
          <p className="text-sm text-muted-foreground">
            Password management is handled through your Google account.
          </p>
          {/* <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" disabled/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" disabled/>
          </div>
          <Button disabled>Update Password</Button> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" /> Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
              <span>Dark Mode</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Enable dark theme for the application. (Coming soon!)
              </span>
            </Label>
            {/* Basic switch, actual theme switching logic would need implementation */}
            <Switch id="dark-mode" disabled />
            {/* <Switch id="dark-mode" onCheckedChange={handleThemeChange} /> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
