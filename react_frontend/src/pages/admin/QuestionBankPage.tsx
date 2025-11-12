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
import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PenIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Paginator from "@/components/Paginator";
// import { DATE_OPTIONS, LOCALE } from "@/utils/dateUtils";
import { LOCALE } from "@/utils/dateUtils";
import QuestionEditModal from "@/components/modal/QuestionEditModal";

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
      fetchQuestions();
    }
  }, [token, currentPage, pageSize]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.adminQuestions,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            page_size: pageSize,
          },
        }
      );

      if (!response) {
        console.error("No response from server");
        throw new Error("No response from server");
      }

      setQuestionList(response.data.results);
      setPagination({
        total_pages: response.data.total_pages,
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
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
    console.log("Editing question:", selectedQuestion)
  };
  // reset garne ani question refresh garne
  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSelectedQuestion(null);
    fetchQuestions();
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
        <h1 className="manage-questions-title text-2xl font-bold">
          Manage Questions
        </h1>
      </div>
      <div className="manage-questions-content">
        {/* User management functionalities will go here */}
        <p>This is where admin can manage questions.</p>
      </div>
      <div className="manage-questions-main-content p-4 rounded-md shadow-md bg-white mt-4 border">
        <div className="questions-search-section">
          <Input placeholder="Search questions by name or email" />
        </div>
        <div className="questions-list-section mt-4">
          <Table>
            <TableCaption>
              {isLoading ? "" : `Total Questions: ${pagination.count}`}
            </TableCaption>
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
                // <TableRow>
                //   <TableCell colSpan={5} className="text-center">
                //     Loading...
                //   </TableCell>
                // </TableRow>

                // 5 rows ko 5 each cells
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                    {Array.from({ length: 5 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-8 bg-gray-300 rounded-md animate-pulse w-full"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))

              ) : questionList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No questions found
                  </TableCell>
                </TableRow>
              ) : (
                questionList.map((question: any, index) => (
                  <TableRow key={index + question.question_text}>
                    <TableCell>
                      <p className="font-normal">{question.question_text}</p>
                    </TableCell>
                    {/* <TableCell>
                      {convertToLocalDateTime(
                        question.createdAt
                      ).toLocaleString(LOCALE, DATE_OPTIONS)}
                    </TableCell> */}
                    <TableCell>
                      {convertToLocalDateTime(
                        question.created_at
                      ).toLocaleString(LOCALE)}
                    </TableCell>
                    <TableCell>
                      {/* Array ma aauxa tesaile map gareko */}
                      <div className="flex flex-wrap gap-2">
                        {question.category_names.map((cat: string) => (
                          <Badge
                            key={cat}
                            className="py-1 px-3 text-sm bg-blue-400 text-white rounded-md"
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
                            className="py-1 px-3 text-sm bg-green-800 text-white rounded-md"
                          >
                            {subcat}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button className="btn-edit bg-blue-500 text-white rounded cursor-pointer"
                        onClick={() =>
                          handleEditClick(question)
                        }
                      >
                        <PenIcon size={12} />
                      </Button>
                      <Button className="btn-delete bg-red-500 text-white rounded cursor-pointer">
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
      <QuestionEditModal
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        selectedQuestion={selectedQuestion}
        handleEditSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default QuestionBankPage;
