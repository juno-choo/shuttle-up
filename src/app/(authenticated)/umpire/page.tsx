// src/app/(authenticated)/umpire/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, RotateCcw, CheckSquare } from 'lucide-react';
import { RacketIcon } from '@/components/icons/racket-icon';
import { useToast } from "@/hooks/use-toast";

// Mock data for selectable matches (replace with actual data fetching)
const availableMatches = [
  { id: 1, teamA: 'Team Alpha', teamB: 'Team Bravo', court: 'Court 1' },
  { id: 2, teamA: 'Team Charlie', teamB: 'Team Delta', court: 'Court 2' },
  { id: 3, teamA: 'Your Team', teamB: 'Team Echo', court: 'Court 1' }, // Assuming this is the user's team
];

export default function UmpirePage() {
  const [selectedMatchId, setSelectedMatchId] = useState<string | undefined>(undefined); // Use undefined for initial state
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [gameA, setGameA] = useState(0);
  const [gameB, setGameB] = useState(0);
  const { toast } = useToast();


  const selectedMatch = availableMatches.find(match => match.id.toString() === selectedMatchId);

  const handleMatchSelection = (value: string) => {
    setSelectedMatchId(value);
    // Reset scores when a new match is selected
    setScoreA(0);
    setScoreB(0);
    setGameA(0);
    setGameB(0);
  }

  const incrementScore = (team: 'A' | 'B') => {
    if (!selectedMatch) return;
    if (team === 'A') setScoreA(s => s + 1);
    else setScoreB(s => s + 1);
  };

  const decrementScore = (team: 'A' | 'B') => {
    if (!selectedMatch) return;
    if (team === 'A') setScoreA(s => Math.max(0, s - 1));
    else setScoreB(s => Math.max(0, s - 1));
  };

   const resetScore = () => {
    if (!selectedMatch) return;
    setScoreA(0);
    setScoreB(0);
   };

  const handleGameEnd = (winner: 'A' | 'B') => {
     if (!selectedMatch) return;
     // Basic win condition check (can be more complex: e.g., win by 2)
     if (winner === 'A' && scoreA < 21 && scoreB < 21) return; // Ensure minimum score
     if (winner === 'B' && scoreB < 21 && scoreA < 21) return; // Ensure minimum score
     // TODO: Add more sophisticated win logic (e.g., win by 2, score cap)

     if (winner === 'A') setGameA(g => g + 1);
     else setGameB(g => g + 1);

     const winnerTeamName = winner === 'A' ? selectedMatch.teamA : selectedMatch.teamB;
     resetScore();
     toast({ title: `Game ${gameA + gameB + 1} ended`, description: `Winner: ${winnerTeamName}`});
     // TODO: Check for match end (e.g., best of 3 games)
  };

  const submitFinalScore = () => {
    if (!selectedMatch) return;
    // Basic validation: ensure at least one game was played
    if (gameA === 0 && gameB === 0) {
       toast({ title: "Cannot Submit", description: "No games have been recorded.", variant: "destructive" });
       return;
    }
    // TODO: Add check for match completion (e.g., best of 3 games won)

    // In a real app, this would send the score to the backend API/database
    console.log('Submitting final score:', { matchId: selectedMatchId, gameA, gameB });
    toast({
      title: "Score Submitted",
      description: `Final score for ${selectedMatch.teamA} vs ${selectedMatch.teamB}: ${gameA} - ${gameB} games.`,
      variant: 'default',
    });
    // Reset state after submission
    setSelectedMatchId(undefined); // Reset dropdown
    setScoreA(0);
    setScoreB(0);
    setGameA(0);
    setGameB(0);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Umpire Score Input</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Match</CardTitle>
          <CardDescription>Choose the match you are currently umpiring.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleMatchSelection} value={selectedMatchId}>
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder="Select a match..." />
            </SelectTrigger>
            <SelectContent>
              {availableMatches.map((match) => (
                <SelectItem key={match.id} value={match.id.toString()}>
                  {match.teamA} vs {match.teamB} ({match.court})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedMatch && (
        <Card>
          <CardHeader>
            <CardTitle>Live Scoring: {selectedMatch.teamA} vs {selectedMatch.teamB}</CardTitle>
            <CardDescription>Court: {selectedMatch.court} | Games: {gameA} - {gameB}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             {/* Current Game Score */}
             <div className="grid grid-cols-2 gap-4 items-center text-center">
               <div>
                 <Label className="text-lg font-semibold block mb-2">{selectedMatch.teamA}</Label>
                 <div className="text-6xl font-bold text-primary mb-4">{scoreA}</div>
                 <div className="flex justify-center gap-2">
                   <Button size="icon" variant="outline" onClick={() => decrementScore('A')} aria-label={`Decrease score for ${selectedMatch.teamA}`}>
                     <Minus className="h-5 w-5" />
                   </Button>
                   <Button size="icon" onClick={() => incrementScore('A')} aria-label={`Increase score for ${selectedMatch.teamA}`}>
                     <Plus className="h-5 w-5" />
                   </Button>
                 </div>
                 {/* Disable button until a valid game-ending score */}
                 <Button variant="outline" className="mt-4" onClick={() => handleGameEnd('A')} disabled={scoreA < 21 && scoreB < 21 /* Add win-by-2 logic later */}>
                   End Game for {selectedMatch.teamA}
                 </Button>
               </div>
               <div>
                  <Label className="text-lg font-semibold block mb-2">{selectedMatch.teamB}</Label>
                  <div className="text-6xl font-bold text-primary mb-4">{scoreB}</div>
                  <div className="flex justify-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => decrementScore('B')} aria-label={`Decrease score for ${selectedMatch.teamB}`}>
                      <Minus className="h-5 w-5" />
                    </Button>
                    <Button size="icon" onClick={() => incrementScore('B')} aria-label={`Increase score for ${selectedMatch.teamB}`}>
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                   {/* Disable button until a valid game-ending score */}
                   <Button variant="outline" className="mt-4" onClick={() => handleGameEnd('B')} disabled={scoreA < 21 && scoreB < 21 /* Add win-by-2 logic later */}>
                     End Game for {selectedMatch.teamB}
                   </Button>
               </div>
             </div>

             <Separator />

             {/* Game Score & Controls */}
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="text-center">
                 <Label className="text-sm font-medium text-muted-foreground">Game Score</Label>
                 <div className="text-2xl font-semibold">{gameA} - {gameB}</div>
               </div>
               <div className="flex gap-2 flex-wrap justify-center">
                  <Button variant="outline" onClick={resetScore}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset Point Score
                  </Button>
                  {/* Disable submit until match conditions met */}
                   <Button onClick={submitFinalScore} disabled={(gameA === 0 && gameB === 0) /* Add match completion logic */}>
                      <CheckSquare className="mr-2 h-4 w-4" /> Submit Final Score
                   </Button>
               </div>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
