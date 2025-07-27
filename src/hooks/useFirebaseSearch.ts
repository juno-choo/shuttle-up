// hooks/useFirebaseSearch.ts
import { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase/client"; 
import { User } from '../types/PlayerCard'; 
import { useAuth } from '../context/auth-context';

const useFirebaseSearch = () => {
  const { user: currentUser } = useAuth();
  // 1. State to hold all users fetched from Firestore
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch all users once when the hook is first used
  useEffect(() => {
    const fetchAllUsers = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef);
      try {
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching all users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // 3. Filter the cached list of users based on the search query
  const searchUsersByName = (nameQuery: string): User[] => {
    if (!nameQuery.trim() || isLoading) {
      return [];
    }
  
    const lowerCaseQuery = nameQuery.toLowerCase();
  
    // Filter the list we have in memory
    const results = allUsers.filter(user => 
      // Use .includes() for a "contains" search on the lowercase name
      user.displayName_lowercase?.includes(lowerCaseQuery)
    );
  
    // Also filter out the currently logged-in user
    if (currentUser) {
      return results.filter(user => user.id !== currentUser.uid);
    }
  
    return results;
  };

  return { searchUsersByName, isLoading };
};

export default useFirebaseSearch;