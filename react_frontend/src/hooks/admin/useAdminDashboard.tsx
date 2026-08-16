import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "@/services/admin/dashboard-service";
import type { AdminDashboardStats } from "@/types/dashboard";

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      setIsLoading(true);
      const data = await getAdminDashboardStats();
      if (!cancelled) {
        setStats(data);
        setIsLoading(false);
      }
    };

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, isLoading };
};
