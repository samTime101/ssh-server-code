// User Statistics Types

export interface UserStatistics {
  // Overview metrics
  overall_accuracy: number;
  total_questions_attempted: number;
  total_correct_answers: number;
  total_incorrect_answers: number;
  average_time_per_question: number | null; // in seconds
  total_study_time: number | null; // in minutes
  current_streak: number;
  longest_streak: number;
  
  // Additional metrics
  questions_solved_today: number;
  questions_solved_this_week: number;
  favorite_category: CategoryPerformance | null;
  strongest_category: CategoryPerformance | null;
  weakest_category: CategoryPerformance | null;
  average_daily_study_time: number | null; // in minutes
  total_categories_practiced: number;
  
  // Chart data
  accuracy_trend: AccuracyTrendData[];
  weekly_activity: WeeklyActivityData[];
  correct_vs_incorrect: CorrectIncorrectData;
  category_performance: CategoryPerformance[];
}

export interface AccuracyTrendData {
  date: string; // ISO date string
  accuracy: number;
  questions_attempted: number;
}

export interface WeeklyActivityData {
  day: string; // e.g., "Mon", "Tue", etc.
  questions: number;
  study_time: number | null; // in minutes
}

export interface CorrectIncorrectData {
  correct: number;
  incorrect: number;
  unattempted?: number;
}

export interface CategoryPerformance {
  category_name: string;
  accuracy: number;
  questions_attempted: number;
  total_questions: number;
  average_time: number | null; // in seconds
}

export interface StatisticsError {
  error: string;
  details?: string;
}
