"use client";

import React, { useState } from "react";
import SportSelector from "./components/SportSelector";
import MatchTypeSelector from "./components/MatchTypeSelector";
import SearchResults from "./components/SearchResults";
import useFirebaseSearch from "../../../../hooks/useFirebaseSearch";

const MatchmakingPage: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>("badminton");
  const [matchType, setMatchType] = useState<"singles" | "doubles">("singles");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [lookingForTeammate, setLookingForTeammate] = useState<boolean>(false);
  const [lookingForOpponent, setLookingForOpponent] = useState<boolean>(false);
  const { searchUsers } = useFirebaseSearch();

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

  const handleSearchTeammate = async () => {
    const results = await searchUsers(selectedSport, "teammate");
    setSearchResults(results);
    setLookingForTeammate(false);
    setLookingForOpponent(true);
  };

  const handleSearchOpponent = async () => {
    const results = await searchUsers(selectedSport, "opponent");
    setSearchResults(results);
    setLookingForOpponent(false);
  };

  const resetSearch = () => {
    setSearchResults([]);
    setLookingForTeammate(false);
    setLookingForOpponent(false);
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
          <button
            onClick={handleSearchTeammate}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          >
            Look For Teammate
          </button>
        )}
        {lookingForOpponent && (
          <button
            onClick={handleSearchOpponent}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Look For Opponent(s)
          </button>
        )}
      </div>
      <div className="mt-8">
        <SearchResults results={searchResults} />
      </div>
    </div>
  );
};

export default MatchmakingPage;
