"use client";

import React from "react";
import SearchCard from "./SearchCard";

interface SearchResultsProps {
  results: {
    id: string;
    name: string;
    profilePic: string;
    totalWins: number;
  }[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Search Results</h3>
      {results.length > 0 ? (
        results.map((result) => (
          <SearchCard
            key={result.id}
            name={result.name}
            profilePic={result.profilePic}
            totalWins={result.totalWins}
          />
        ))
      ) : (
        <p className="text-gray-600">No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
