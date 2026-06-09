import type { ScoreData } from "@/utils/scoreCalculation";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  contentClassName?: string;
}

export interface ScoreSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreData: ScoreData;
  onReturnToHome: () => void;
  onReviewAnswers?: () => void;
}