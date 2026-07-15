import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { User } from "@/types/auth";

interface MyStatisticsProps {
  user: User;
}

const MyStatistics = ({ user }: MyStatisticsProps) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">Performance Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Overall Performance</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label className="text-muted-foreground text-xs font-semibold uppercase">
                  Total Attempts
                </Label>
                <p className="text-foreground text-2xl font-bold">{user.total_attempts}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs font-semibold uppercase">
                  Correct Answers
                </Label>
                <p className="text-2xl font-bold text-green-600">{user.total_right_attempts}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs font-semibold uppercase">
                  Accuracy
                </Label>
                <p className="text-primary text-2xl font-bold">
                  {parseFloat(user.accuracy_percent).toFixed(2)}%
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs font-semibold uppercase">
                  Completion
                </Label>
                <p className="text-2xl font-bold text-purple-600">{parseFloat(user.completion_percent).toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyStatistics;
