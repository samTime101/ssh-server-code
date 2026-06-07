import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { QuestionBankAnalytics } from "@/types/analytics";

const emptyAnalytics: QuestionBankAnalytics = {
  total_questions: 0,
  question_bank_submissions: 0,
  latest_attempts_count: 0,
  latest_correct_attempts: 0,
  latest_incorrect_attempts: 0,
  unique_questions_attempted: 0,
  questions_coverage_percent: 0,
  accuracy_percent: 0,
};

export const getQuestionBankAnalytics = async (): Promise<QuestionBankAnalytics> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.analytics);
    if (!response) return emptyAnalytics;
    return response.data as QuestionBankAnalytics;
  } catch (error) {
    console.error("Error fetching question bank analytics:", error);
    return emptyAnalytics;
  }
};
