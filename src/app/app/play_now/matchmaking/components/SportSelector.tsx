"use client";

import React from "react";

interface SportSelectorProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
}

const SportSelector: React.FC<SportSelectorProps> = ({
  selectedSport,
  onSportChange,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select Sport</h3>
      <button
        onClick={() => onSportChange("badminton")}
        className={`px-4 py-2 mr-2 rounded ${
          selectedSport === "badminton"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
      >
        Badminton
      </button>
      <button
        onClick={() => onSportChange("pickleball")}
        className={`px-4 py-2 rounded ${
          selectedSport === "pickleball"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
      >
        Pickleball
      </button>
    </div>
  );
};

export default SportSelector;
