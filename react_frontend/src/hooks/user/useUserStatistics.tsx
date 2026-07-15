import { useState, useEffect, useCallback } from "react";
import { getUserStatistics } from "@/services/user/statistics-service";
import type { UserStatistics } from "@/types/statistics";

export interface UseUserStatisticsReturn {
  statistics: UserStatistics | null;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage user statistics
 */
export const useUserStatistics = (): UseUserStatisticsReturn => {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getUserStatistics();
      setStatistics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load statistics";
      setError(errorMessage);
      console.error("Error in useUserStatistics:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatistics();
  }, [fetchStatistics]);

  const isEmpty = !isLoading && 
    !error && 
    statistics !== null && 
    statistics.total_questions_attempted === 0;

  return {
    statistics,
    isLoading,
    error,
    isEmpty,
    refetch: fetchStatistics,
  };
};
