import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Target,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  Calendar,
  BarChart3,
  Brain,
  RefreshCw,
  Trophy,
  AlertCircle,
} from "lucide-react";

import { StatCard } from "./stats/StatCard";
import { ChartCard } from "./stats/ChartCard";
import { DetailedStatItem } from "./stats/DetailedStatItem";
import { AccuracyTrendChart } from "./stats/AccuracyTrendChart";
import { WeeklyActivityChart } from "./stats/WeeklyActivityChart";
import { CorrectIncorrectChart } from "./stats/CorrectIncorrectChart";
import { CategoryPerformanceChart } from "./stats/CategoryPerformanceChart";
import { formatAccuracy, formatStudyTime, formatTime, STAT_COLORS } from "@/utils/statisticsUtils";
import type { UseUserStatisticsReturn } from "@/hooks/user/useUserStatistics";

interface UserStatisticsProps {
  statisticsState: UseUserStatisticsReturn;
}

const UserStatistics = ({ statisticsState }: UserStatisticsProps) => {
  const navigate = useNavigate();
  const { statistics, isLoading, error, isEmpty, refetch } = statisticsState;

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (isEmpty) {
    return <EmptyState onStart={() => navigate("/userpanel/question-bank")} />;
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Overall Accuracy"
          value={formatAccuracy(statistics.overall_accuracy)}
          icon={Target}
          subtitle="Average performance"
          valueClassName={STAT_COLORS.emphasis}
        />
        <StatCard
          title="Questions Attempted"
          value={statistics.total_questions_attempted.toLocaleString()}
          icon={CheckCircle2}
          subtitle={`${statistics.total_correct_answers} correct`}
        />
        <StatCard
          title="Total Study Time"
          value={formatStudyTime(statistics.total_study_time)}
          icon={Clock}
          subtitle={`${formatStudyTime(statistics.average_daily_study_time)} per day`}
        />
        <StatCard
          title="Current Streak"
          value={`${statistics.current_streak} days`}
          icon={Flame}
          subtitle={`Best: ${statistics.longest_streak} days`}
          valueClassName={STAT_COLORS.emphasis}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard title="Accuracy Trend" description="Your accuracy over time" icon={TrendingUp}>
          <AccuracyTrendChart data={statistics.accuracy_trend} />
        </ChartCard>

        <ChartCard
          title="Weekly Activity"
          description="Questions solved and study time"
          icon={Calendar}
        >
          <WeeklyActivityChart data={statistics.weekly_activity} />
        </ChartCard>

        <ChartCard
          title="Answer Distribution"
          description="Correct vs incorrect answers"
          icon={BarChart3}
        >
          <CorrectIncorrectChart data={statistics.correct_vs_incorrect} />
        </ChartCard>

        <ChartCard title="Category Performance" description="Accuracy by category" icon={Brain}>
          <CategoryPerformanceChart data={statistics.category_performance} />
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-primary h-5 w-5" />
            Detailed Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <DetailedStatItem
              label="Questions Solved Today"
              value={statistics.questions_solved_today}
              icon={Calendar}
            />
            <DetailedStatItem
              label="Questions This Week"
              value={statistics.questions_solved_this_week}
              icon={TrendingUp}
            />
            <DetailedStatItem
              label="Total Correct Answers"
              value={statistics.total_correct_answers}
              icon={CheckCircle2}
            />
            <DetailedStatItem
              label="Total Incorrect Answers"
              value={statistics.total_incorrect_answers}
              icon={AlertCircle}
              valueClassName={STAT_COLORS.negative}
            />
            <DetailedStatItem
              label="Average Time per Question"
              value={formatTime(statistics.average_time_per_question)}
              icon={Clock}
            />
            <DetailedStatItem
              label="Categories Practiced"
              value={statistics.total_categories_practiced}
              icon={Brain}
            />
            {statistics.favorite_category && (
              <DetailedStatItem
                label="Favorite Category"
                value={statistics.favorite_category.category_name}
                icon={Trophy}
                valueClassName={STAT_COLORS.emphasis}
              />
            )}
            {statistics.strongest_category && (
              <DetailedStatItem
                label="Strongest Category"
                value={`${statistics.strongest_category.category_name} (${formatAccuracy(
                  statistics.strongest_category.accuracy
                )})`}
                icon={Target}
                valueClassName={STAT_COLORS.emphasis}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LoadingState = () => (
  <div className="space-y-8">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="mb-1 h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <Card className="border-destructive/50">
    <CardContent className="flex flex-col items-center justify-center py-12">
      <div className="bg-destructive/10 mb-4 rounded-full p-3">
        <AlertCircle className="text-destructive h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">Failed to Load Statistics</h3>
      <p className="text-muted-foreground mb-4 max-w-md text-center text-sm">{error}</p>
      <Button onClick={onRetry} variant="default">
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </CardContent>
  </Card>
);

const EmptyState = ({ onStart }: { onStart: () => void }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12">
      <div className="bg-muted mb-4 rounded-full p-4">
        <BarChart3 className="text-muted-foreground h-10 w-10" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No Statistics Available</h3>
      <p className="text-muted-foreground mb-6 max-w-md text-center text-sm">
        Start solving questions to see your performance statistics and track your progress over
        time.
      </p>
      <Button onClick={onStart}>Start Learning</Button>
    </CardContent>
  </Card>
);

export default UserStatistics;
