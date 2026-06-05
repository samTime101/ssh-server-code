import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Paginator from "@/components/Paginator";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { useManageQuestionFeedbacks } from "@/hooks/admin/useManageQuestionFeedbacks";
import Modal from "@/components/Modal";
import EditorRenderer from "@/components/EditorRenderer";
import { getImageUrl } from "@/config/apiConfig";
import { Check, AlertCircle } from "lucide-react";
import type { Question } from "@/types/question";

const QuestionFeedbackPage = () => {
  const {
    feedbacks,
    pagination,
    currentPage,
    pageSize,
    isLoading,
    handlePageChange,
    handlePageSizeChange,
  } = useManageQuestionFeedbacks();

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleOpenDetailModal = (questionObj: Question | undefined) => {
    if (questionObj) {
      setSelectedQuestion(questionObj);
      setIsDetailModalOpen(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "hard":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-foreground text-2xl font-bold">Question Feedback</h1>
        <p className="text-muted-foreground mt-1">
          Review feedback submitted by users on individual quiz questions.
        </p>
      </div>

      <div className="border-border bg-card mt-4 rounded-md border p-4 shadow-md">
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>{isLoading ? "" : `Total feedback records: ${pagination.count}`}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Question</TableHead>
                <TableHead className="w-[20%]">Submitted By</TableHead>
                <TableHead className="w-[35%]">Feedback</TableHead>
                <TableHead className="w-[15%]">Submitted Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonLoader rows={5} columns={4} />
              ) : feedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No question feedback submitted yet.
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks.map((entry) => (
                  <TableRow key={entry.id} className="text-muted-foreground hover:bg-muted/40 transition-colors">
                    <TableCell>
                      {entry.questionObj ? (
                        <button
                          type="button"
                          onClick={() => handleOpenDetailModal(entry.questionObj)}
                          className="text-left font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline cursor-pointer transition-all line-clamp-2"
                        >
                          {entry.questionObj.question_text}
                        </button>
                      ) : (
                        <span className="text-muted-foreground/60 italic">
                          Question ID: {entry.question} (Not found)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground/90">
                      {entry.username}
                    </TableCell>
                    <TableCell className="whitespace-pre-wrap text-sm text-foreground/80 break-words max-w-md">
                      {entry.feedback}
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(entry.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Paginator
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            pageSize={pageSize}
            totalCount={pagination.count}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Detailed Question Modal */}
      <Modal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        title="Question Details"
        contentClassName="w-full sm:max-w-3xl lg:max-w-4xl p-6"
      >
        {selectedQuestion && (
          <div className="space-y-6 text-foreground max-w-4xl mx-auto">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-md uppercase ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                {selectedQuestion.difficulty}
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-md uppercase bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                {selectedQuestion.option_type === "multiple" ? "Multiple Choice" : "Single Choice"}
              </span>
              {selectedQuestion.category_names && selectedQuestion.category_names.map((cat: string) => (
                <span key={cat} className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {cat}
                </span>
              ))}
            </div>

            {/* Question Text & Image */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold leading-relaxed">{selectedQuestion.question_text}</h2>
              {selectedQuestion.question_image_url && (
                <div className="flex justify-center max-w-full">
                  <img
                    src={getImageUrl(selectedQuestion.question_image_url)}
                    alt="Question"
                    className="max-h-60 w-auto rounded-lg border object-contain shadow-xs"
                  />
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Options</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedQuestion.options.map((option) => (
                  <div
                    key={option.label}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all ${
                      option.is_true
                        ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-900 dark:text-green-300 font-semibold"
                        : "border-border bg-background"
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      option.is_true
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {option.label}
                    </span>
                    <span className="text-sm leading-tight pt-0.5">{option.text}</span>
                    {option.is_true && <Check className="ml-auto h-4 w-4 shrink-0 text-green-600 dark:text-green-400 self-center" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation / Description */}
            {selectedQuestion.description && (
              <div className="border-t border-border pt-5 space-y-3">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-indigo-500" />
                  Explanation
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/80">
                  <EditorRenderer data={selectedQuestion.description} className="text-sm leading-relaxed" />
                  {selectedQuestion.description_image_url && (
                    <div className="flex justify-center mt-4">
                      <img
                        src={getImageUrl(selectedQuestion.description_image_url)}
                        alt="Explanation"
                        className="max-h-60 w-auto rounded-lg border object-contain shadow-xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contributor Info */}
            {selectedQuestion.contributor && (
              <div className="border-t border-border pt-4 flex flex-wrap justify-between text-xs text-muted-foreground">
                <span>Contributor: <strong className="text-foreground/80">{selectedQuestion.contributor}</strong></span>
                {selectedQuestion.contributor_specialization && (
                  <span>Specialization: <strong className="text-foreground/80">{selectedQuestion.contributor_specialization}</strong></span>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuestionFeedbackPage;
