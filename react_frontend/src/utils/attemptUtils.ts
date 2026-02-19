import type { User } from "@/types/auth";
import type { GetCategoriesResponse } from "@/types/category";

export const getAttemptStats = (
  user: User | null,
  categories: GetCategoriesResponse | undefined
) => {
  const totalQuestions = Number(categories?.total_questions) || 0;
  const totalAttempts = Number(user?.total_attempts) || 0;
  const totalRight = Number(user?.total_right_attempts) || 0;
  const progressPercent = totalQuestions > 0 ? (totalAttempts / totalQuestions) * 100 : 0;
  const correctPercent = totalAttempts > 0 ? (totalRight / totalAttempts) * 100 : 0;

  return {
    totalQuestions,
    totalAttempts,
    totalRight,
    progressPercent,
    correctPercent,
  };
};
