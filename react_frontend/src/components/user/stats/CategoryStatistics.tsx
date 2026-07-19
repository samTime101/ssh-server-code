import { Target, CheckCircle2, Clock } from "lucide-react";
import type { CategoryPerformance } from "@/types/statistics";
import { StatCard } from "./StatCard";
import { formatAccuracy, formatTime, STAT_COLORS } from "@/utils/statisticsUtils";

interface CategoryStatisticsProps {
  category: CategoryPerformance;
}

export const CategoryStatistics = ({ category }: CategoryStatisticsProps) => {
  const correctCount = Math.round((category.accuracy / 100) * category.questions_attempted);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Accuracy"
        value={formatAccuracy(category.accuracy)}
        icon={Target}
        subtitle={`${category.category_name} performance`}
        valueClassName={STAT_COLORS.emphasis}
      />
      <StatCard
        title="Questions Attempted"
        value={category.questions_attempted.toLocaleString()}
        icon={CheckCircle2}
        subtitle={`${correctCount} correct`}
      />
      <StatCard
        title="Avg Response Time"
        value={formatTime(category.average_time)}
        icon={Clock}
        subtitle="Per question"
      />
    </div>
  );
};
