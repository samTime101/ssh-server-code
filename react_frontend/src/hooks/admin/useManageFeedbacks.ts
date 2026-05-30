import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { fetchFeedbacks } from "@/services/admin/feedback-service";
import type { FeedbackEntry } from "@/types/feedback";

export const useManageFeedbacks = () => {
  const { token } = useAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    next: null as string | null,
    previous: null as string | null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadFeedbacks();
    }
  }, [token, currentPage, pageSize]);

  const loadFeedbacks = async () => {
    setIsLoading(true);
    try {
      const response = await fetchFeedbacks(currentPage, pageSize);
      setFeedbacks(response.results || []);
      setPagination({
        count: response.count,
        total_pages: response.total_pages,
        next: response.next,
        previous: response.previous,
      });
    } catch (error) {
      toast.error("Failed to load feedback.");
      console.error("Error fetching feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return {
    feedbacks,
    pagination,
    currentPage,
    pageSize,
    isLoading,
    handlePageChange,
    handlePageSizeChange,
  };
};
