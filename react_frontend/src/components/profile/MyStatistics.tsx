import { useState, useCallback, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserStatistics from "@/components/user/UserStatistics";
import { CategoryStatistics } from "@/components/user/stats/CategoryStatistics";
import { useUserStatistics } from "@/hooks/user/useUserStatistics";
import { OVERALL_STATS_SCOPE } from "@/utils/statisticsUtils";

const MyStatistics = () => {
  const [selectedScope, setSelectedScope] = useState<string>(OVERALL_STATS_SCOPE);
  const statisticsState = useUserStatistics();
  const { statistics, refetch } = statisticsState;

  const categories = statistics?.category_performance ?? [];
  const isOverall = selectedScope === OVERALL_STATS_SCOPE;
  const selectedCategory = isOverall
    ? undefined
    : categories.find((item) => item.category_name === selectedScope);

  // Fall back to overall if the selected category is no longer available
  useEffect(() => {
    if (!isOverall && statistics && !selectedCategory) {
      setSelectedScope(OVERALL_STATS_SCOPE);
    }
  }, [isOverall, statistics, selectedCategory]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Statistics</h2>
          <p className="text-muted-foreground mt-1">
            {isOverall
              ? "Track your learning progress and performance"
              : `Topic breakdown for ${selectedScope}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedScope} onValueChange={setSelectedScope}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OVERALL_STATS_SCOPE}>Overall</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item.category_name} value={item.category_name}>
                  {item.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => void handleRefresh()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {isOverall ? (
        <UserStatistics statisticsState={statisticsState} />
      ) : selectedCategory ? (
        <CategoryStatistics category={selectedCategory} />
      ) : (
        <Card>
          <CardContent className="text-muted-foreground py-8 text-center text-sm">
            No data available for this topic.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyStatistics;
