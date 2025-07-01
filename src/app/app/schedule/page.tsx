// src/app/app/schedule/page.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";

// Mock data for upcoming matches
const upcomingMatches = [
  {
    id: 1,
    teamA: "Team Alpha",
    teamB: "Team Bravo",
    date: "2024-08-15",
    time: "18:00",
    court: "Court 1",
    status: "Scheduled",
  },
  {
    id: 2,
    teamA: "Team Charlie",
    teamB: "Team Delta",
    date: "2024-08-16",
    time: "19:00",
    court: "Court 2",
    status: "Scheduled",
  },
  {
    id: 3,
    teamA: "Your Team",
    teamB: "Team Echo",
    date: "2024-08-17",
    time: "20:00",
    court: "Court 1",
    status: "Scheduled",
  },
];

// Mock data for past matches
const pastMatches = [
  {
    id: 4,
    teamA: "Team Alpha",
    teamB: "Your Team",
    date: "2024-08-08",
    time: "18:00",
    court: "Court 1",
    status: "Completed",
    scoreA: 21,
    scoreB: 15,
  },
  {
    id: 5,
    teamA: "Team Bravo",
    teamB: "Team Charlie",
    date: "2024-08-09",
    time: "19:00",
    court: "Court 2",
    status: "Completed",
    scoreA: 18,
    scoreB: 21,
  },
];

export default function SchedulePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Match Schedule</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upcoming Matches</CardTitle>
          <CardDescription>
            Check out the schedule for upcoming games.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingMatches.length > 0 ? (
            <ul className="space-y-4">
              {upcomingMatches.map((match, index) => (
                <li key={match.id}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex-1">
                      <span className="font-semibold">{match.teamA}</span> vs{" "}
                      <span className="font-semibold">{match.teamB}</span>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <CalendarDays className="h-4 w-4" />{" "}
                        {new Date(match.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        <Clock className="h-4 w-4" /> {match.time}
                        <span className="ml-2">📍 {match.court}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        match.teamA === "Your Team" ||
                        match.teamB === "Your Team"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {match.status}
                    </Badge>
                  </div>
                  {index < upcomingMatches.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              No upcoming matches scheduled.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past Matches</CardTitle>
          <CardDescription>Review results from previous games.</CardDescription>
        </CardHeader>
        <CardContent>
          {pastMatches.length > 0 ? (
            <ul className="space-y-4">
              {pastMatches.map((match, index) => (
                <li key={match.id}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex-1">
                      <span
                        className={
                          match.scoreA > match.scoreB ? "font-bold" : ""
                        }
                      >
                        {match.teamA}
                      </span>{" "}
                      vs{" "}
                      <span
                        className={
                          match.scoreB > match.scoreA ? "font-bold" : ""
                        }
                      >
                        {match.teamB}
                      </span>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <CalendarDays className="h-4 w-4" />{" "}
                        {new Date(match.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-lg font-mono">
                        {match.scoreA} - {match.scoreB}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        {match.status}
                      </Badge>
                    </div>
                  </div>
                  {index < pastMatches.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No past matches found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
