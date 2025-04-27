
// src/app/(authenticated)/teams/page.tsx
'use client'; // Keep as client component for potential future actions

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context'; // Import useAuth


// Mock data for teams (replace with actual data fetching)
// You'd fetch teams and potentially check if the current user is part of a team
const teams = [
  { id: 1, name: 'Team Alpha', members: ['Alice', 'Bob'], avatar: 'https://picsum.photos/seed/alpha/40/40' },
  { id: 2, name: 'Your Team', members: ['You', 'Partner'], avatar: 'https://picsum.photos/seed/yourteam/40/40', isCurrentUserTeam: true }, // Example property
  { id: 3, name: 'Team Bravo', members: ['Charlie', 'Dana'], avatar: 'https://picsum.photos/seed/bravo/40/40' },
  { id: 4, name: 'Team Charlie', members: ['Eve', 'Frank'], avatar: 'https://picsum.photos/seed/charlie/40/40' },
  { id: 5, name: 'Team Delta', members: ['Grace', 'Heidi'], avatar: 'https://picsum.photos/seed/delta/40/40' },
  { id: 6, name: 'Team Echo', members: ['Ivan', 'Judy'], avatar: 'https://picsum.photos/seed/echo/40/40' },
];

// Determine which team is the current user's team based on fetched data
const currentUserTeamId = 2; // Example: fetched from user profile data

export default function TeamsPage() {
  const { user } = useAuth(); // Access user info if needed for permissions etc.

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Button>Create New Team</Button> {/* Add functionality later */}
      </div>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className={team.id === currentUserTeamId ? 'border-primary' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
              <Avatar className="h-10 w-10">
                 {team.avatar && <AvatarImage src={team.avatar} alt={`${team.name} logo`} />}
                 <AvatarFallback><Users className="h-5 w-5" /></AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Members:</span>
              </div>
              <ul className="space-y-1 list-disc list-inside text-sm mb-4">
                {team.members.map((member, index) => (
                   // Replace 'You' based on actual user ID match if possible
                  <li key={index}>{member === 'You' && team.id === currentUserTeamId ? user?.displayName?.split(' ')[0] ?? 'You' : member}</li>
                ))}
              </ul>
               {team.id === currentUserTeamId && <Badge variant="default">Your Team</Badge>}
               <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                  <Link href={`/teams/${team.id}`}>View Team</Link>
               </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

