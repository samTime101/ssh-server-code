import { Input } from "@/components/ui/input";
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
import { PenIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Paginator from "@/components/Paginator";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { LOCALE } from "@/utils/dateUtils";
import Modal from "@/components/Modal";
import EditQuestionForm from "@/pages/admin/EditQuestionPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuestionBank } from "@/hooks/admin/useQuestionBank";
import StatusBadge from "@/components/StatusBadge";

const QuestionBankPage = () => {
  const {
    questionList,
    pagination,
    currentPage,
    pageSize,
    isLoading,
    categories,
    subCategories,
    selectedCategoryId,
    selectedSubCategoryId,
    searchQuery,
    editModalOpen,
    setEditModalOpen,
    selectedQuestion,
    handlePageChange,
    handlePageSizeChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleSearchChange,
    handleEditClick,
    handleEditSuccess,
    handleDeleteClick,
  } = useQuestionBank();

  const convertToLocalDateTime = (utcDateTime: string) => {
    try {
      const date = new Date(utcDateTime);
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    } catch {
      return utcDateTime;
    }
  };

  return (
    <div className="min-w-0">
      <div className="manage-questions-header">
        <h1 className="manage-questions-title text-foreground text-2xl font-bold">
          Manage Questions
        </h1>
      </div>
      <div className="manage-questions-content text-muted-foreground mt-1">
        <p>This is where admin can manage questions.</p>
      </div>
      <div className="manage-questions-main-content border-border bg-card mt-4 min-w-0 overflow-hidden rounded-md border p-4 shadow-md">
        <div className="questions-search-section flex flex-wrap gap-3">
          <Input
            placeholder="Search by question text or description"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCategoryId !== "all" && (
            <Select value={selectedSubCategoryId} onValueChange={handleSubCategoryChange}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Filter by subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                {subCategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="questions-list-section mt-4 min-w-0 overflow-x-auto">
          <Table className="table-fixed">
            <TableCaption>{isLoading ? "" : `Total Questions: ${pagination.count}`}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">Question Text</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
                <TableHead className="w-[15%]">Created At</TableHead>
                <TableHead className="w-[15%]">Category</TableHead>
                <TableHead className="w-[15%]">Subcategory</TableHead>
                <TableHead className="w-[10%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonLoader rows={5} columns={6} />
              ) : questionList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No questions found
                  </TableCell>
                </TableRow>
              ) : (
                questionList.map((question: any) => (
                  <TableRow
                    className="text-muted-foreground"
                    key={question.id || question.question_text}
                  >
                    <TableCell className="max-w-0 break-words whitespace-normal">
                      <p className="line-clamp-3 font-normal">{question.question_text}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={question.status} />
                    </TableCell>
                    <TableCell>
                      {convertToLocalDateTime(question.created_at).toLocaleString(LOCALE)}
                    </TableCell>
                    <TableCell className="whitespace-normal">
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
                    <TableCell className="whitespace-normal">
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
                    <TableCell className="whitespace-nowrap">
                      <div className="flex gap-2">
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
                      </div>
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
