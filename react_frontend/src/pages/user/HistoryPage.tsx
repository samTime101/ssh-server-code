import { fetchSubmissionHistoryPage, getSubmissionHistory } from "@/services/user/history-service";
import type { SubmissionHistoryItem, SubmissionOverview } from "@/types/history";
import {
  formatHistoryDateTime,
  getSubmissionMetrics,
  getSubmissionOverview,
} from "@/utils/historyUtils";
import {
  fetchResumedSession,
  applyResumedSession,
  isContinuableSubmission,
} from "@/utils/sessionResume";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import Paginator from "@/components/Paginator";
import { isAxiosError } from "axios";
import { useQuestions } from "@/hooks/useQuestions";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { setSessionQuestions, clearSessionTimer, setIsExamModeEnabled } = useQuestions();
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistoryItem[]>([]);
  const [overview, setOverview] = useState<SubmissionOverview>({
    totalSubmissions: 0,
    totalAttempts: 0,
    correctAttempts: 0,
    incorrectAttempts: 0,
  });
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionHistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContinuing, setIsContinuing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({ count: 0, total_pages: 0 });

  useEffect(() => {
    const controller = new AbortController();

    const fetchPage = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSubmissionHistoryPage(currentPage, pageSize, {
          showZeroAttempts: false,
          signal: controller.signal,
        });
        setSubmissionHistory(data.results);
        setPagination({ count: data.count, total_pages: data.total_pages });
      } catch (error) {
        if (
          isAxiosError(error) &&
          (error.code === "ERR_CANCELED" || error.name === "CanceledError")
        ) {
          return;
        }
        console.error("Failed to fetch submission history page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
    return () => controller.abort();
  }, [currentPage, pageSize]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOverview = async () => {
      try {
        const all = await getSubmissionHistory(undefined, {
          pageSize: 50,
          maxPages: 10,
          showZeroAttempts: true,
          signal: controller.signal,
        });
        setOverview(getSubmissionOverview(all));
      } catch (error) {
        if (
          isAxiosError(error) &&
          (error.code === "ERR_CANCELED" || error.name === "CanceledError")
        ) {
          return;
        }
        console.error("Failed to fetch submission overview:", error);
      }
    };

    fetchOverview();
    return () => controller.abort();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleContinue = async () => {
    if (!selectedSubmission || !isContinuableSubmission(selectedSubmission)) return;

    setIsContinuing(true);
    try {
      const resumed = await fetchResumedSession(selectedSubmission.submission_id);
      if (!resumed) {
        toast.error("Failed to continue this session.");
        return;
      }

      clearSessionTimer();
      setIsExamModeEnabled(false);
      applyResumedSession(setSessionQuestions, resumed);
      setSelectedSubmission(null);
      navigate(
        selectedSubmission.type === "question_bank"
          ? "/userpanel/question"
          : "/userpanel/cee-question"
      );
    } catch (error) {
      console.error("Failed to continue submission:", error);
      toast.error("Failed to continue this session.");
    } finally {
      setIsContinuing(false);
    }
  };

  const canContinue = selectedSubmission != null && isContinuableSubmission(selectedSubmission);

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{overview.totalSubmissions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{overview.totalAttempts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Correct Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{overview.correctAttempts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incorrect Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive text-2xl font-bold">{overview.incorrectAttempts}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Submission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Correct</TableHead>
                <TableHead>Incorrect</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonLoader rows={6} columns={8} />
              ) : (
                submissionHistory.map((submission, index) => {
                  const metrics = getSubmissionMetrics(submission);
                  const rowNumber = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <TableRow
                      key={submission.submission_id}
                      className="cursor-pointer"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <TableCell className="font-medium">{rowNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{submission.submission_label || "-"}</Badge>
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
                })
              )}
            </TableBody>
          </Table>
          {submissionHistory.length === 0 && !isLoading && (
            <div className="text-muted-foreground py-8 text-center">
              No submission history found.
            </div>
          )}
          {!isLoading && pagination.total_pages > 0 && (
            <Paginator
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              pageSize={pageSize}
              totalCount={pagination.count}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedSubmission)} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="bg-card max-h-[90vh] w-[96vw] sm:max-w-[96vw] lg:max-w-[1200px]">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
              <DialogTitle>Submission Details</DialogTitle>
              {canContinue && (
                <Button onClick={handleContinue} disabled={isContinuing}>
                  {isContinuing ? "Continuing..." : "Continue session"}
                </Button>
              )}
            </div>
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
              {(selectedSubmission?.attempts ?? []).map((attempt) => (
                <TableRow
                  key={`${selectedSubmission?.submission_id}-${attempt.question_text}`}
                  className="hover:bg-muted transition-colors"
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
                      <Badge key={ans} className="mr-1 mb-1 whitespace-normal">
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
    </div>
  );
};

export default HistoryPage;
