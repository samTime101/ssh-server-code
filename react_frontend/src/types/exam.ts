export interface ExamModeSettings {
  questionCount: number;
  durationMinutes: number;
}

export interface ExamResultSummaryProps {
  totalQuestions: number;
  attemptedQuestionsCount: number;
  correctCount: number;
}