import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { fetchQuestions, deleteQuestion } from "@/services/admin/addquestion-service";
import { fetchCategoriesWithHierarchy } from "@/services/admin/category-service";
import type { Category, SubCategory } from "@/types/category";

export const useQuestionBank = () => {
  const { token } = useAuth();

  const [questionList, setQuestionList] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    next: null as string | null,
    previous: null as string | null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const subCategories: SubCategory[] =
    categories.find((c) => c.id === selectedCategoryId)?.sub_categories ?? [];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategoriesWithHierarchy();
        setCategories(data.categories);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (token) loadQuestions();
  }, [
    token,
    currentPage,
    pageSize,
    selectedCategoryId,
    selectedSubCategoryId,
    debouncedSearchQuery,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchQuestions(
        currentPage,
        pageSize,
        selectedCategoryId === "all" ? undefined : selectedCategoryId,
        selectedSubCategoryId === "all" ? undefined : selectedSubCategoryId,
        debouncedSearchQuery || undefined
      );
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

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    setSelectedSubCategoryId("all");
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (value: string) => {
    setSelectedSubCategoryId(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleEditClick = (question: any) => {
    setSelectedQuestion(question);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSelectedQuestion(null);
    loadQuestions();
  };

  const handleDeleteClick = async (question: any) => {
    if (
      !window.confirm(`Are you sure you want to delete the question: "${question.question_text}"?`)
    )
      return;
    try {
      await deleteQuestion(question.id);
      toast.success("Question deleted successfully");
      if (questionList.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        loadQuestions();
      }
    } catch (error) {
      toast.error("Failed to delete question");
      console.error("Error deleting question:", error);
    }
  };

  return {
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
  };
};
