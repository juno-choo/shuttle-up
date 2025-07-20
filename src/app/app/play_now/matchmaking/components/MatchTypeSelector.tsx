"use client";

import React from "react";

interface MatchTypeSelectorProps {
  selectedMatchType: "singles" | "doubles";
  onMatchTypeChange: (matchType: "singles" | "doubles") => void;
}

const MatchTypeSelector: React.FC<MatchTypeSelectorProps> = ({
  selectedMatchType,
  onMatchTypeChange,
}) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Select Match Type</h3>
      <button
        onClick={() => onMatchTypeChange("singles")}
        className={`px-4 py-2 mr-2 rounded ${
          selectedMatchType === "singles"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
      >
        Singles
      </button>
      <button
        onClick={() => onMatchTypeChange("doubles")}
        className={`px-4 py-2 rounded ${
          selectedMatchType === "doubles"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
      >
        Doubles
      </button>
    </div>
  );
};

export default MatchTypeSelector;
