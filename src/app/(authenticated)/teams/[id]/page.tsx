
// src/app/(authenticated)/teams/[id]/page.tsx
'use client'; // Keep as client component for potential future actions

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Users, CalendarDays, Trophy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RacketIcon } from '@/components/icons/racket-icon';
import { useAuth } from '@/context/auth-context'; // Import useAuth

// Mock data store (replace with actual data fetching based on params.id)
const teamsData: { [key: string]: any } = {
  '1': {
    id: 1,
    name: 'Team Alpha',
    members: ['Alice Smith', 'Bob Brown'],
    avatar: 'https://picsum.photos/seed/alpha/100/100',
    stats: { played: 5, won: 4, lost: 1, winRate: '80%', rank: 1, group: 'A' },
    recentMatches: [ { id: 4, opponent: 'Your Team', result: 'Win', score: '21-15', date: '2024-08-08' }, /* more matches */ ],
  },
  '2': {
    id: 2,
    name: 'Your Team', // This name might be dynamic based on who's logged in
    members: ['Current User', 'Partner Name'], // Replace 'Current User' dynamically
    avatar: 'https://picsum.photos/seed/yourteam/100/100',
    stats: { played: 5, won: 3, lost: 2, winRate: '60%', rank: 2, group: 'A' },
    recentMatches: [
      { id: 4, opponent: 'Team Alpha', result: 'Loss', score: '15-21', date: '2024-08-08' },
      { id: 7, opponent: 'Team Charlie', result: 'Win', score: '21-18', date: '2024-08-01' },
      { id: 8, opponent: 'Team Delta', result: 'Win', score: '21-19', date: '2024-07-25' },
    ],
  },
  // Add other teams...
};

// Mock user's team ID (in real app, get this from user's profile data)
const currentUserTeamId = 2;


export default function TeamDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth(); // Get current user info
  const team = teamsData[params.id]; // Fetch team data based on ID
  const isCurrentUserTeam = team && team.id === currentUserTeamId;

  if (!team) {
    // TODO: Improve not found handling, maybe redirect or show a dedicated component
    return <div className="container mx-auto py-8">Team not found</div>;
  }

   // Dynamically replace placeholder member name with actual user name
   const members = team.members.map((member: string) =>
    member === 'Current User' && user ? user.displayName ?? 'You' : member
   );

  return (
    <div className="container mx-auto py-8">
       <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-4">
           <Avatar className="h-16 w-16">
             {team.avatar && <AvatarImage src={team.avatar} alt={`${team.name} logo`} />}
             <AvatarFallback><Users className="h-8 w-8" /></AvatarFallback>
           </Avatar>
           <div>
             {/* Use team name, potentially customize if it's "Your Team" */}
             <h1 className="text-3xl font-bold">{isCurrentUserTeam ? `${user?.displayName?.split(' ')[0]}'s Team` : team.name}</h1>
             {isCurrentUserTeam && <Badge variant="default">Your Team</Badge>}
           </div>
         </div>
         {isCurrentUserTeam && <Button variant="outline">Edit Team</Button>} {/* Add functionality later */}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Members Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Members</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {members.map((member: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{member}</span>
                </li>
              ))}
            </ul>
             {isCurrentUserTeam && <Button variant="outline" size="sm" className="mt-4 w-full">Manage Members</Button>} {/* Add functionality */}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><RacketIcon className="h-5 w-5" /> Performance Stats</CardTitle>
            <CardDescription>Group {team.stats.group} | Rank #{team.stats.rank}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
             <div>
                <p className="text-sm text-muted-foreground">Played</p>
                <p className="text-2xl font-semibold">{team.stats.played}</p>
             </div>
              <div>
                <p className="text-sm text-muted-foreground">Won</p>
                <p className="text-2xl font-semibold text-green-600">{team.stats.won}</p>
             </div>
              <div>
                <p className="text-sm text-muted-foreground">Lost</p>
                <p className="text-2xl font-semibold text-red-600">{team.stats.lost}</p>
             </div>
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-semibold">{team.stats.winRate}</p>
             </div>
          </CardContent>
        </Card>

        {/* Recent Matches Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> Recent Matches</CardTitle>
            <CardDescription>Last {team.recentMatches.length} matches played.</CardDescription>
          </CardHeader>
          <CardContent>
             {team.recentMatches.length > 0 ? (
               <ul className="space-y-4">
                 {team.recentMatches.map((match: any, index: number) => (
                   <li key={match.id}>
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                       <div className="flex-1">
                          <span className="font-medium">vs {match.opponent}</span>
                          <p className="text-sm text-muted-foreground">
                             {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                       </div>
                       <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">{match.score}</Badge>
                           <Badge variant={match.result === 'Win' ? 'default' : 'destructive'} className={match.result === 'Win' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                              {match.result === 'Win' ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                              {match.result}
                           </Badge>
                       </div>
                     </div>
                     {index < team.recentMatches.length - 1 && <Separator className="my-3" />}
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="text-muted-foreground">No recent matches recorded.</p>
             )}
             <Button variant="link" className="mt-4 px-0" asChild>
                <Link href="/schedule">View Full Schedule</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
