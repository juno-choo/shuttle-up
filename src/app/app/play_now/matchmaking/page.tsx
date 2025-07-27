"use client";

import React, { useState } from "react";
import SportSelector from "./components/SportSelector";
import MatchTypeSelector from "./components/MatchTypeSelector";
import OpponentSearch from "./components/OpponentSearch";
import { Button } from "@/components/ui/button";
import useFirebaseSearch from "../../../../hooks/useFirebaseSearch";
import { User } from "../../../../types/PlayerCard"; // Corrected import path

const MatchmakingPage: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>("badminton");
  const [matchType, setMatchType] = useState<"singles" | "doubles">("singles");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [lookingForTeammate, setLookingForTeammate] = useState<boolean>(false);
  const [lookingForOpponent, setLookingForOpponent] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOpponent, setSelectedOpponent] = useState<User | null>(null);

  // 👇 Get the synchronous search function and the initial loading state from the hook
  const { searchUsersByName, isLoading: isSearchLoading } = useFirebaseSearch();

  const handleSportChange = (sport: string) => {
    setSelectedSport(sport);
    resetSearch();
  };

  const handleMatchTypeChange = (type: "singles" | "doubles") => {
    setMatchType(type);
    resetSearch();
    if (type === "singles") {
      setLookingForOpponent(true);
    } else {
      setLookingForTeammate(true);
    }
  };

  // 👇 This function is now synchronous and much faster
  const handleSearchTermChange = (query: string) => {
    setSearchTerm(query);
    if (query) {
      const results = searchUsersByName(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectOpponent = (user: User) => {
    setSelectedOpponent(user);
    setSearchTerm("");
    setSearchResults([]);
    setLookingForOpponent(false);
  };

  const handleChallenge = () => {
    if (selectedOpponent) {
      alert(`Challenging ${selectedOpponent.displayName}!`);
      // Implement challenge logic here
    }
  };

  const resetSearch = () => {
    setSearchResults([]);
    setLookingForTeammate(false);
    setLookingForOpponent(false);
    setSelectedOpponent(null);
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Matchmaking</h1>
      <SportSelector
        selectedSport={selectedSport}
        onSportChange={handleSportChange}
      />
      <MatchTypeSelector
        selectedMatchType={matchType}
        onMatchTypeChange={handleMatchTypeChange}
      />
      <div className="mt-4">
        {lookingForTeammate && (
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-4">
            Look For Teammate
          </button>
        )}

        {lookingForOpponent && (
          <div>
            {isSearchLoading ? (
              <p className="text-muted-foreground">Loading players...</p>
            ) : (
              <OpponentSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchTermChange}
                users={searchResults}
                onSelectOpponent={handleSelectOpponent}
              />
            )}
          </div>
        )}

        {selectedOpponent && (
          <div className="mt-6 p-4 border rounded-lg shadow-sm bg-secondary">
            <h3 className="text-lg font-semibold">Opponent Selected</h3>
            <p className="text-xl mt-2">{selectedOpponent.displayName}</p>
            <Button onClick={handleChallenge} className="mt-4">
              Challenge {selectedOpponent.displayName.split(" ")[0]}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchmakingPage;
