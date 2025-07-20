import { useCallback } from 'react';
import { PlayerCard } from '../types/PlayerCard';

const useFirebaseSearch = () => {
    const searchUsers = useCallback(async (sport: string, type: 'teammate' | 'opponent'): Promise<PlayerCard[]> => {
        // Simulate Firebase search logic
        const mockResults: PlayerCard[] = [
            { id: '1', name: 'Alice', profilePic: '/images/alice.jpg', totalWins: 10 },
            { id: '2', name: 'Bob', profilePic: '/images/bob.jpg', totalWins: 15 },
        ];

        // Example filter logic based on sport and type
        return mockResults.filter((user) => user.totalWins > 5); // Replace with actual Firebase query
    }, []);

    return { searchUsers };
};

export default useFirebaseSearch;