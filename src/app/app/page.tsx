// src/app/app/page.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Trophy, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Welcome to ShuttleUp!</h1>
        <Button asChild>
          <Link href="/app/play_now/matchmaking">Play Now</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Matches
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Matches scheduled this week
            </p>
            <Button asChild variant="link" className="px-0 pt-4">
              <Link href="/app/schedule">
                View Schedule <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Team Standings
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#2</div>
            <p className="text-xs text-muted-foreground">
              Your current rank in Group A
            </p>
            <Button asChild variant="link" className="px-0 pt-4">
              <Link href="/app/standings">
                View Standings <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Teams competing in the league
            </p>
            <Button asChild variant="link" className="px-0 pt-4">
              <Link href="/app/teams">
                View Teams <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>
              Stay updated with the latest league news.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>No new announcements.</li>
              {/* Add announcements here */}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
