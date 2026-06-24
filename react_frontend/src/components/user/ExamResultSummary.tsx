import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle, HelpCircle, BarChart } from "lucide-react";
import type { ExamResultSummaryProps } from "@/types/exam";



const ExamResultSummary = ({
  totalQuestions,
  attemptedQuestionsCount,
  correctCount,
}: ExamResultSummaryProps) => {
  const TotalPoints = correctCount + (attemptedQuestionsCount - correctCount) * -0.25;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="mt-4 space-y-2 text-center">
        <h2 className="text-foreground text-3xl font-extrabold tracking-tight">Exam Completed!</h2>
        <p className="text-muted-foreground text-lg">Here is the summary of your performance.</p>
      </div>

      <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-semibold">
              Total Questions
            </CardTitle>
            <HelpCircle className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{totalQuestions}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-semibold">Attempted</CardTitle>
            <Target className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{attemptedQuestionsCount}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/10 shadow-md dark:border-green-900 dark:bg-green-950/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-400">
              Correct Answers
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600 dark:text-green-400">
              {correctCount}
            </div>
            <div className="mt-1 text-sm text-green-600/70">
              out of {attemptedQuestionsCount} chosen
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-primary text-sm font-semibold">Final Score</CardTitle>
            <BarChart className="text-primary h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-primary text-3xl font-black">{TotalPoints.toFixed(2)}</div>
            <div className="text-primary/70 mt-1 text-sm">Total Points</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamResultSummary;
