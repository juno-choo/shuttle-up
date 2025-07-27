"use client";

import React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "../../../../../components/ui/command";

interface OpponentSearchProps {
  searchTerm: string;
  onSearchChange: (search: string) => void;
  users: any[]; // You can create a proper User type for this
  onSelectOpponent: (user: any) => void;
}

const OpponentSearch: React.FC<OpponentSearchProps> = ({
  searchTerm,
  onSearchChange,
  users,
  onSelectOpponent,
}) => {
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Search for an opponent..."
        value={searchTerm}
        onValueChange={onSearchChange}
      />
      {/* Show the list only when there is a search term */}
      {searchTerm && (
        <CommandList>
          <CommandEmpty>No users found.</CommandEmpty>
          {users.map((user) => (
            <CommandItem
              key={user.id}
              onSelect={() => onSelectOpponent(user)}
              className="cursor-pointer"
            >
              {user.displayName}
            </CommandItem>
          ))}
        </CommandList>
      )}
    </Command>
  );
};

export default OpponentSearch;
