import { getSubmissionHistory } from "@/services/user/history-service";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Attempt } from "@/types/history";

const HistoryPage = () => {
  const [submissionHistory, setSubmissionHistory] = useState<Attempt[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissionHistory() {
      try {
        const data = await getSubmissionHistory();
        setSubmissionHistory(data.attempts);
      } catch (error) {
        console.error("Error fetching submission history:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissionHistory();
  }, []);

  const total = submissionHistory.length;
  const correct = submissionHistory.filter((a) => a.is_correct).length;
  const incorrect = total - correct;

  return (
    <div className="space-y-8 p-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{total}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Correct</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">{correct}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incorrect</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-red-600">{incorrect}</span>
          </CardContent>
        </Card>
      </div>

      {/* Attempts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>SubCategory</TableHead>
                <TableHead>Selected Answers</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissionHistory.map((attempt, idx) => (
                <TableRow key={idx}>
                  <TableCell>{attempt.question_text}</TableCell>
                  <TableCell>
                    {attempt.categories.map((cat) => (
                      <Badge key={cat} className="mr-1">
                        {cat}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    {attempt.subcategories.map((subcat) => (
                      <Badge key={subcat} className="mr-1">
                        {subcat}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    {attempt.selected_answers.map((ans, i) => (
                      <Badge key={i} className="mr-1">
                        {ans}: {attempt.selected_options_labels[i]}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    {attempt.is_correct ? (
                      <Badge variant="default" className="bg-green-100 text-green-700">
                        Correct
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-700">
                        Incorrect
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isLoading && (
            <div className="text-muted-foreground py-8 text-center">
              Loading submission history...
            </div>
          )}
          {submissionHistory.length === 0 && !isLoading && (
            <div className="text-muted-foreground py-8 text-center">
              No submission history found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
