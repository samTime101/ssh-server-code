import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PenIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Paginator from "@/components/Paginator";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
// import { DATE_OPTIONS, LOCALE } from "@/utils/dateUtils";
import { LOCALE } from "@/utils/dateUtils";
import Modal from "@/components/Modal";
import EditQuestionForm from "@/pages/admin/EditQuestionPage";
import { fetchQuestions, deleteQuestion } from "@/services/admin/addquestion-service";

const QuestionBankPage = () => {
  const { token } = useAuth();

  const [questionList, setQuestionList] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  // modal ko lagi ra question  ko lagi
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  useEffect(() => {
    if (token) {
      loadQuestions();
    }
  }, [token, currentPage, pageSize]);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchQuestions(currentPage, pageSize);

      setQuestionList(data.results);
      setPagination({
        total_pages: data.total_pages,
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (error) {
      toast.error("An error occurred while fetching questions");
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // edit button click garda, question set garne ra model open garne
  const handleEditClick = (question: any) => {
    setSelectedQuestion(question);
    setEditModalOpen(true);
    console.log("Editing question:", selectedQuestion);
  };
  // reset garne ani question refresh garne
  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSelectedQuestion(null);
    loadQuestions();
  };

  const handleDeleteClick = async (question: any) => {
    if (
      window.confirm(`Are you sure you want to delete the question: "${question.question_text}"?`)
    ) {
      try {
        await deleteQuestion(question.id);
        toast.success("Question deleted successfully");
        loadQuestions();
      } catch (error) {
        toast.error("Failed to delete question");
        console.error("Error deleting question:", error);
      }
    }
  };

  const convertToLocalDateTime = (utcDateTime: string) => {
    try {
      const date = new Date(utcDateTime);
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    } catch (error) {
      console.error("Error converting date:", error);
      return utcDateTime;
    }
  };

  return (
    <div>
      <div className="manage-questions-header">
        <h1 className="manage-questions-title text-2xl font-bold text-foreground">Manage Questions</h1>
      </div>
      <div className="manage-questions-content text-muted-foreground mt-1">
        {/* User management functionalities will go here */}
        <p>This is where admin can manage questions.</p>
      </div>
      <div className="manage-questions-main-content border-border bg-card mt-4 rounded-md border p-4 shadow-md">
        <div className="questions-search-section">
          <Input placeholder="Search questions by name or email" />
        </div>
        <div className="questions-list-section mt-4">
          <Table>
            <TableCaption>{isLoading ? "" : `Total Questions: ${pagination.count}`}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Question Text</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonLoader rows={5} columns={5} />
              ) : questionList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No questions found
                  </TableCell>
                </TableRow>
              ) : (
                questionList.map((question: any, index) => (
                  <TableRow className="text-muted-foreground" key={index + question.question_text}>
                    <TableCell>
                      <p className="font-normal">{question.question_text}</p>
                    </TableCell>
                    {/* <TableCell>
                      {convertToLocalDateTime(
                        question.createdAt
                      ).toLocaleString(LOCALE, DATE_OPTIONS)}
                    </TableCell> */}
                    <TableCell>
                      {convertToLocalDateTime(question.created_at).toLocaleString(LOCALE)}
                    </TableCell>
                    <TableCell>
                      {/* Array ma aauxa tesaile map gareko */}
                      <div className="flex flex-wrap gap-2">
                        {question.category_names.map((cat: string) => (
                          <Badge
                            key={cat}
                            className="bg-primary text-primary-foreground rounded-md px-3 py-1 text-sm"
                          >
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {question.subcategory_names.map((subcat: string) => (
                          <Badge
                            key={subcat}
                            className="bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm"
                          >
                            {subcat}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        className="btn-edit bg-primary text-primary-foreground cursor-pointer rounded"
                        onClick={() => handleEditClick(question)}
                      >
                        <PenIcon size={12} />
                      </Button>
                      <Button
                        className="btn-delete bg-destructive text-primary-foreground cursor-pointer rounded"
                        onClick={() => handleDeleteClick(question)}
                      >
                        <TrashIcon size={12} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
      <Modal open={editModalOpen} onOpenChange={setEditModalOpen} title="Edit Question">
        {/* Passed as children to Modal */}
        {selectedQuestion && (
          <EditQuestionForm
            selectedQuestion={selectedQuestion}
            handleEditSuccess={handleEditSuccess}
          />
        )}
      </Modal>
    </div>
  );
};

export default QuestionBankPage;
