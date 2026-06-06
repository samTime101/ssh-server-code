import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { fetchQuestionFeedbacks } from "@/services/admin/feedback-service";
import { getQuestionsByIds } from "@/services/user/question-service";
import axiosInstance from "@/services/axios";
import type { Question } from "@/types/question";

export interface QuestionFeedbackEntry {
  id: string;
  feedback: string;
  created_at: string;
  user_guid: string;
  question: string; // question ID
  
  // Resolved details
  questionObj?: Question;
  username?: string;
}

export const useManageQuestionFeedbacks = () => {
  const { token } = useAuth();
  const [feedbacks, setFeedbacks] = useState<QuestionFeedbackEntry[]>([]);
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
      const response = await fetchQuestionFeedbacks(currentPage, pageSize);
      const results = response.results || [];
      
      // Batch fetch questions and users to resolve details
      const questionIds = Array.from(new Set(results.map((r: any) => r.question).filter(Boolean))) as string[];
      const userGuids = Array.from(new Set(results.map((r: any) => r.user_guid).filter(Boolean))) as string[];

      // Resolve questions
      let resolvedQuestionsMap: Record<string, Question> = {};
      if (questionIds.length > 0) {
        try {
          const questions = await getQuestionsByIds(questionIds);
          resolvedQuestionsMap = questions.reduce((acc, q) => {
            acc[q.id] = q;
            return acc;
          }, {} as Record<string, Question>);
        } catch (err) {
          console.error("Failed to load questions details:", err);
        }
      }

      // Resolve users in parallel - prefer email, fallback to username
      const resolvedUsersMap: Record<string, string> = {};
      if (userGuids.length > 0) {
        try {
          await Promise.all(
            userGuids.map(async (guid) => {
              try {
                const res = await axiosInstance.get(`/users/${guid}/`);
                // Use email when available; fall back to username, then a generic label
                resolvedUsersMap[guid] = res.data.email || res.data.username || "Unknown";
              } catch (userErr) {
                console.error(`Failed to load user info for guid ${guid}:`, userErr);
                resolvedUsersMap[guid] = `User (${guid.slice(0, 8)})`;
              }
            })
          );
        } catch (err) {
          console.error("Failed to load user details:", err);
        }
      }

      // Map resolved fields back to results
      const mappedFeedbacks = results.map((entry: any) => ({
        ...entry,
        questionObj: resolvedQuestionsMap[entry.question],
        username: resolvedUsersMap[entry.user_guid] || "Unknown User",
      }));

      setFeedbacks(mappedFeedbacks);
      setPagination({
        count: response.count,
        total_pages: response.total_pages,
        next: response.next,
        previous: response.previous,
      });
    } catch (error) {
      toast.error("Failed to load question feedback.");
      console.error("Error fetching question feedback:", error);
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
