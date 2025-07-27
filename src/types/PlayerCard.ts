export type User = {
  id: string; // The Firestore document ID
  displayName: string;
  displayName_lowercase: string;
  email: string;
  skillLevel: string;
  stats: {
    team: string; // 👈 MOVED: team is inside stats
    badminton: {
      matchesPlayed: number;
      matchesWon: number;
    };
    pickleball: {
      matchesPlayed: number;
      matchesWon: number;
    };
  };
};