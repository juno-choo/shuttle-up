// src/app/(authenticated)/standings/page.tsx

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data for team standings
const standings = [
  { rank: 1, team: 'Team Alpha', played: 5, won: 4, lost: 1, points: 12 },
  { rank: 2, team: 'Your Team', played: 5, won: 3, lost: 2, points: 9 }, // Assuming this is the logged-in user's team for styling
  { rank: 3, team: 'Team Bravo', played: 5, won: 3, lost: 2, points: 9 },
  { rank: 4, team: 'Team Delta', played: 5, won: 2, lost: 3, points: 6 },
  { rank: 5, team: 'Team Charlie', played: 5, won: 2, lost: 3, points: 6 },
  { rank: 6, team: 'Team Echo', played: 5, won: 1, lost: 4, points: 3 },
];

// In a real app, you'd fetch standings and determine the user's team ID
const currentUserTeamName = 'Your Team';

export default function StandingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">League Standings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Group A Standings</CardTitle>
          <CardDescription>Current rankings based on match results.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-right">Played</TableHead>
                <TableHead className="text-right">Won</TableHead>
                <TableHead className="text-right">Lost</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((team) => (
                <TableRow key={team.rank} className={team.team === currentUserTeamName ? 'bg-accent/10' : ''}>
                  <TableCell className="font-medium">{team.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {team.team}
                      {team.team === currentUserTeamName && <Badge variant="default" className="ml-2">You</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{team.played}</TableCell>
                  <TableCell className="text-right">{team.won}</TableCell>
                  <TableCell className="text-right">{team.lost}</TableCell>
                  <TableCell className="text-right font-semibold">{team.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
