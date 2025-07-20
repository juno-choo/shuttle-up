"use client";

import React from "react";

interface SearchCardProps {
  name: string;
  profilePic: string;
  totalWins: number;
}

const SearchCard: React.FC<SearchCardProps> = ({
  name,
  profilePic,
  totalWins,
}) => {
  return (
    <div className="flex items-center p-4 border rounded mb-2">
      <img
        src={profilePic}
        alt={name}
        className="w-12 h-12 rounded-full mr-4"
      />
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-gray-600">Total Wins: {totalWins}</p>
      </div>
    </div>
  );
};

export default SearchCard;
