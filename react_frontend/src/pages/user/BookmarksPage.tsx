import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark as BookmarkIcon, Eye, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookmarks, removeBookmark, getQuestionById } from "@/services/user/bookmark-service";
import type { Question } from "@/types/question";
import { toast } from "sonner";
import { getImageUrl } from "@/config/apiConfig";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import Paginator from "@/components/Paginator";

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
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

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

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

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
    } catch (error) {
      toast.error("Failed to remove bookmark");
    }
  };

  const handleViewQuestion = (question: Question) => {
    setViewingQuestion(question);
    setSelectedOption("");
    setSelectedOptions([]);
  };

  const handleCloseModal = () => {
    setViewingQuestion(null);
    setSelectedOption("");
    setSelectedOptions([]);
  };

  const handleOptionSelect = (label: string) => {
    if (viewingQuestion?.option_type === "multiple") {
      setSelectedOptions((prev) =>
        prev.includes(label) ? prev.filter((id) => id !== label) : [...prev, label]
      );
    } else {
      setSelectedOption(label);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BookmarkIcon className="h-6 w-6 text-primary" /> Bookmarked Questions
          </CardTitle>
          {!isLoading && pagination.count > 0 && (
            <span className="text-sm text-muted-foreground">
              {pagination.count} bookmark{pagination.count !== 1 ? "s" : ""}
            </span>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-4">
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
                  <Card key={bookmark.question_id} className="border bg-card">
                    <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {question.question_text}
                        </h3>
                        {question.question_image_url && (
                          <div className="mt-2">
                            <img
                              src={getImageUrl(question.question_image_url)}
                              alt="Question"
                              className="max-h-24 object-contain rounded"
                            />
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {categoryNames.map((cat: string) => (
                            <span
                              key={cat}
                              className="text-xs font-semibold bg-muted text-muted-foreground border px-2 py-1 rounded-md"
                            >
                              {cat}
                            </span>
                          ))}
                          <span className="text-xs text-muted-foreground ml-auto">
                            Bookmarked on {new Date(bookmark.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col gap-2 shrink-0 md:w-32 mt-4 md:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleViewQuestion(question)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-destructive hover:bg-destructive hover:text-white"
                          onClick={() => handleRemoveBookmark(bookmark.question_id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
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
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold">Question Preview</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Question Text */}
              <div>
                <h3 className="text-foreground text-xl leading-relaxed font-semibold">
                  {viewingQuestion.question_text}
                </h3>
                {viewingQuestion.question_image_url && (
                  <div className="flex justify-center mt-4">
                    <img
                      src={getImageUrl(viewingQuestion.question_image_url)}
                      alt="Question illustration"
                      className="max-h-72 w-auto max-w-full rounded-lg border object-contain shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-4">
                {viewingQuestion.options.map((option, index) => (
                  <div key={option.label || index}>
                    {viewingQuestion.option_type === "multiple" ? (
                      <MultipleChoiceOption
                        option={option}
                        selectedOptions={selectedOptions}
                        disabled={false}
                        correctOptions={[]}
                        handleOptionSelect={handleOptionSelect}
                      />
                    ) : (
                      <SingleChoiceOption
                        option={option}
                        selectedOption={selectedOption}
                        disabled={false}
                        correctOptions={[]}
                        handleOptionSelect={handleOptionSelect}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Category tags */}
              {viewingQuestion.category_names && viewingQuestion.category_names.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {viewingQuestion.category_names.map((cat: string) => (
                    <span
                      key={cat}
                      className="text-xs font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-md"
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
