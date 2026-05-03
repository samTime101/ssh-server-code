import { getSubmissionHistory } from "@/services/user/history-service";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SubmissionHistoryItem, Attempt } from "@/types/history";
import {
  formatHistoryDateTime,
  getSubmissionMetrics,
  getSubmissionOverview,
} from "@/utils/historyUtils";
import AttemptDetailModal from "@/components/user/AttemptDetailModal";

const HistoryPage = () => {
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistoryItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionHistoryItem | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);

  useEffect(() => {
    async function fetchSubmissionHistory() {
      try {
        const data = await getSubmissionHistory();
        // Filter submissions with at least one attempt
        const filtered = data.filter((s) => (s.attempts?.length ?? 0) > 0);
        setSubmissionHistory(filtered);
      } catch (error) {
        console.error("Error fetching submission history:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissionHistory();
  }, []);

  const { totalSubmissions, totalAttempts, correctAttempts, incorrectAttempts } =
    getSubmissionOverview(submissionHistory);

  return (
    <div className="space-y-8 p-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{totalSubmissions}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{totalAttempts}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Correct</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">{correctAttempts}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incorrect</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-destructive text-2xl font-bold">{incorrectAttempts}</span>
          </CardContent>
        </Card>
      </div>

      {/* Submission Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Correct</TableHead>
                <TableHead>Incorrect</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissionHistory.map((submission, index) => {
                const metrics = getSubmissionMetrics(submission);
                return (
                  <TableRow
                    key={submission.submission_id}
                    className="cursor-pointer"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    {/* <TableCell className="font-medium">{submission.submission_id}</TableCell> */}
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell>{submission.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{submission.type || "question_bank"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={submission.status === "submitted" ? "default" : "secondary"}
                        className={
                          submission.status === "submitted"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatHistoryDateTime(submission.started_at)}</TableCell>
                    <TableCell>{formatHistoryDateTime(submission.submitted_at)}</TableCell>
                    <TableCell>{metrics.total}</TableCell>
                    <TableCell className="text-green-600">{metrics.correct}</TableCell>
                    <TableCell className="text-destructive">{metrics.incorrect}</TableCell>
                  </TableRow>
                );
              })}
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

      <Dialog open={Boolean(selectedSubmission)} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="bg-card max-h-[90vh] w-[96vw] sm:max-w-[96vw] lg:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>
              Submission Details {selectedSubmission ? `- ${selectedSubmission.submission_id}` : ""}
            </DialogTitle>
          </DialogHeader>

          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[38%] whitespace-normal">Question</TableHead>
                <TableHead className="w-[16%] whitespace-normal">Category</TableHead>
                <TableHead className="w-[16%] whitespace-normal">SubCategory</TableHead>
                <TableHead className="w-[20%] whitespace-normal">Selected Answers</TableHead>
                <TableHead className="w-[10%] whitespace-normal">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(selectedSubmission?.attempts ?? []).map((attempt, idx) => (
                <TableRow
                  key={`${selectedSubmission?.submission_id}-${idx}`}
                  className="hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => setSelectedAttempt(attempt)}
                >
                  <TableCell className="w-[38%] break-words whitespace-normal">
                    {attempt.question_text}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    {(attempt.categories ?? []).map((cat) => (
                      <Badge key={cat} className="mr-1">
                        {cat}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    {(attempt.subcategories ?? []).map((subcat) => (
                      <Badge key={subcat} className="mr-1">
                        {subcat}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    {(attempt.selected_answers ?? []).map((ans, i) => (
                      <Badge key={i} className="mr-1 mb-1 whitespace-normal">
                        {ans}: {attempt.selected_options_labels?.[i] ?? ""}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    {attempt.is_correct ? (
                      <Badge variant="default" className="bg-green-100 text-green-700">
                        Correct
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive">
                        Incorrect
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(selectedSubmission?.attempts.length ?? 0) === 0 && (
            <div className="text-muted-foreground py-8 text-center">
              No attempts found for this submission.
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AttemptDetailModal
        attempt={selectedAttempt}
        isOpen={Boolean(selectedAttempt)}
        onClose={() => setSelectedAttempt(null)}
      />
    </div>
  );
};

export default HistoryPage;
