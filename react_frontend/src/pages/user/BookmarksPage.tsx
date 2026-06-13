import { useState, useEffect, useCallback } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark as BookmarkIcon, Eye, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookmarks, removeBookmark, getQuestionById } from "@/services/user/bookmark-service";
import { getSubmissionHistory } from "@/services/user/history-service";
import { getImageUrl } from "@/config/apiConfig";
import type { Attempt } from "@/types/history";
import type { Question } from "@/types/question";
import { toast } from "sonner";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import Paginator from "@/components/Paginator";
import Loader from "@/components/ui/Loader";

interface BookmarkItem {
  question_id: string;
  question: Question | null;
  created_at: string;
}

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    next: null as string | null,
    previous: null as string | null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookmarks(currentPage, pageSize);
      if (data && data.results) {
        // API only returns question_id + created_at — fetch each question in parallel
        const enriched = await Promise.all(
          data.results.map(async (item: { question_id: string; created_at: string }) => {
            const question = await getQuestionById(item.question_id);
            return {
              question_id: item.question_id,
              created_at: item.created_at,
              question: question ?? null,
            };
          })
        );
        setBookmarks(enriched);
        setPagination({
          count: data.count,
          total_pages: data.total_pages,
          next: data.next,
          previous: data.previous,
        });
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const [historyAttempts, setHistoryAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await getSubmissionHistory();
        const allAttempts = historyData.flatMap((h) => h.attempts || []);
        setHistoryAttempts(allAttempts);
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };
    fetchHistory();
  }, []);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleRemoveBookmark = async (questionId: string) => {
    try {
      await removeBookmark(questionId);
      toast.success("Bookmark removed");
      if (viewingQuestion?.id === questionId) setViewingQuestion(null);
      // Refresh current page; if it becomes empty go to previous page
      const remainingOnPage = bookmarks.filter((b) => b.question_id !== questionId).length;
      if (remainingOnPage === 0 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchBookmarks();
      }
    } catch {
      toast.error("Failed to remove bookmark");
    }
  };

  const handleViewQuestion = (question: Question) => {
    setViewingQuestion(question);
  };

  const handleCloseModal = () => {
    setViewingQuestion(null);
  };

  const currentAttempt = viewingQuestion
    ? historyAttempts.find((a) => a.question_text === viewingQuestion.question_text)
    : null;
  const isAttempted = !!currentAttempt;

  // We assert any because `Question.options` does not explicitly list `is_true` in the current interface,
  // but it is coming from the API (OptionSerializer).
  const correctOptions =
    viewingQuestion?.options
      .filter((o: { label: string; text: string; is_true?: boolean }) => o.is_true)
      .map((o) => o.label) || [];

  const attemptSelectedOptions = currentAttempt?.selected_options_labels || [];
  const attemptSelectedOptionString =
    attemptSelectedOptions.length > 0 ? attemptSelectedOptions[0] : "";



  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <BookmarkIcon className="text-primary h-6 w-6" /> Bookmarked Questions
          </CardTitle>
          {!isLoading && pagination.count > 0 && (
            <span className="text-muted-foreground text-sm">
              {pagination.count} bookmark{pagination.count !== 1 ? "s" : ""}
            </span>
          )}
        </CardHeader>
        <CardContent>
          <div className="mt-4 space-y-4">
            {isLoading && (
              <div className="text-muted-foreground py-8 text-center">
                Loading your bookmarks...
              </div>
            )}
            {!isLoading && bookmarks.length === 0 && (
              <div className="text-muted-foreground py-8 text-center">
                You haven't bookmarked any questions yet.
              </div>
            )}
            {!isLoading &&
              bookmarks.map((bookmark) => {
                const question = bookmark.question;
                if (!question) return null;
                const categoryNames = question.category_names || [];
                return (
                  <Card key={bookmark.question_id} className="bg-card border">
                    <CardContent className="flex flex-col items-start justify-between gap-4 p-4 md:flex-row">
                      <div className="flex-1">
                        <h3 className="line-clamp-2 text-lg font-semibold">
                          {question.question_text}
                        </h3>
                        {question.question_image_url && (
                          <div className="mt-2">
                            <img
                              src={getImageUrl(question.question_image_url)}
                              alt="Question"
                              className="max-h-24 rounded object-contain"
                            />
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {categoryNames.map((cat: string) => (
                            <span
                              key={cat}
                              className="bg-muted text-muted-foreground rounded-md border px-2 py-1 text-xs font-semibold"
                            >
                              {cat}
                            </span>
                          ))}
                          <span className="text-muted-foreground ml-auto text-xs">
                            Bookmarked on {new Date(bookmark.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex shrink-0 flex-row gap-2 md:mt-0 md:w-32 md:flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleViewQuestion(question)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive w-full hover:text-white"
                          onClick={() => handleRemoveBookmark(bookmark.question_id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* Paginator */}
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

      {/* Question View Modal */}
      {viewingQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-background max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Question Preview</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* Question Text */}
              <div>
                <h3 className="text-foreground text-xl leading-relaxed font-semibold">
                  {viewingQuestion.question_text}
                </h3>
                {viewingQuestion.question_image_url && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={getImageUrl(viewingQuestion.question_image_url)}
                      alt="Question illustration"
                      className="max-h-72 w-auto max-w-full rounded-lg border object-contain shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Options */}
              {isAttempted ? (
                <div className="space-y-4">
                  {viewingQuestion.options.map((option) => (
                    <div key={option.label}>
                      {viewingQuestion.option_type === "multiple" ? (
                        <MultipleChoiceOption
                          option={option}
                          selectedOptions={attemptSelectedOptions}
                          disabled={true}
                          correctOptions={correctOptions}
                          handleOptionSelect={() => {}}
                        />
                      ) : (
                        <SingleChoiceOption
                          option={option}
                          selectedOption={attemptSelectedOptionString}
                          disabled={true}
                          correctOptions={correctOptions}
                          handleOptionSelect={() => {}}
                        />
                      )}
                    </div>
                  ))}
                  {(viewingQuestion.description || viewingQuestion.description_image_url) && (
                    <div className="mt-4 p-4 rounded bg-muted/50 border">
                      <h4 className="font-semibold mb-2">Explanation</h4>
                      {viewingQuestion.description && <p className="text-sm">{viewingQuestion.description}</p>}
                      {viewingQuestion.description_image_url && (
                        <div className="mt-3 flex justify-center">
                          <img
                            src={getImageUrl(viewingQuestion.description_image_url)}
                            alt="Explanation"
                            className="max-h-48 w-auto max-w-full rounded border object-contain shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {viewingQuestion.options.map((option) => (
                    <div key={option.label}>
                      {viewingQuestion.option_type === "multiple" ? (
                        <MultipleChoiceOption
                          option={option}
                          selectedOptions={[]}
                          disabled={true}
                          correctOptions={[]}
                          handleOptionSelect={() => {}}
                        />
                      ) : (
                        <SingleChoiceOption
                          option={option}
                          selectedOption={""}
                          disabled={true}
                          correctOptions={[]}
                          handleOptionSelect={() => {}}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Category tags */}
              {viewingQuestion.category_names && viewingQuestion.category_names.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t pt-2">
                  {viewingQuestion.category_names.map((cat: string) => (
                    <span
                      key={cat}
                      className="bg-primary/10 text-primary border-primary/20 rounded-md border px-2 py-1 text-xs font-semibold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
