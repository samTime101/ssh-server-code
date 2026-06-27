import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { fetchCategoriesWithHierarchy } from "@/services/admin/category-service";
import { createSubCategory } from "@/services/admin/subcategory-service";
import { createSubSubCategory } from "@/services/admin/subsubcategory-service";
import type { Category } from "@/types/category";
import axiosInstance from "@/services/axios";

export const useCreateCategory = () => {
  const { token } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryIcon, setSubCategoryIcon] = useState("");
  const [subSubCategoryName, setSubSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const refreshCategories = async () => {
    const data = await fetchCategoriesWithHierarchy();
    setCategories(data.categories);
  };

  useEffect(() => {
    if (!token) return;
    refreshCategories().catch(() => {
      setMessage("Failed to fetch categories");
      setMessageType("error");
    });
  }, [token]);

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setMessage("Please enter a category name");
      setMessageType("error");
      return;
    }
    setIsLoading(true);
    setMessage("");
    setMessageType("");
    try {
      if (!token) throw new Error("Authentication token not found");
      const result = await axiosInstance.post(API_ENDPOINTS.createCategory, {
        name: categoryName,
        ...(categoryIcon ? { icon: categoryIcon } : {}),
      });
      setMessage(`Category "${result.data.name}" created successfully!`);
      setMessageType("success");
      setCategoryName("");
      setCategoryIcon("");
      await refreshCategories();
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail ||
          error.response?.data?.name?.[0] ||
          error.message ||
          "Failed to create category. Please try again."
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || !subCategoryName.trim()) {
      setMessage("Select category and enter subcategory name");
      setMessageType("error");
      return;
    }
    setIsLoading(true);
    setMessage("");
    setMessageType("");
    try {
      if (!token) throw new Error("Authentication token not found");
      const result = await createSubCategory(selectedCategoryId, subCategoryName, subCategoryIcon);
      setMessage(`Subcategory "${result.name}" created successfully!`);
      setMessageType("success");
      setSubCategoryName("");
      setSubCategoryIcon("");
      await refreshCategories();
    } catch (error: any) {
      setMessage(error.message || "Failed to create subcategory. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubCategoryId || !subSubCategoryName.trim()) {
      setMessage("Select subcategory and enter subsubcategory name");
      setMessageType("error");
      return;
    }
    setIsLoading(true);
    setMessage("");
    setMessageType("");
    try {
      if (!token) throw new Error("Authentication token not found");
      const result = await createSubSubCategory(selectedSubCategoryId, subSubCategoryName);
      setMessage(
        `Subsubcategory "${result.subsubcategory.subSubCategoryName}" created successfully!`
      );
      setMessageType("success");
      setSubSubCategoryName("");
      await refreshCategories();
    } catch (error: any) {
      setMessage(error.message || "Failed to create subsubcategory. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    categoryName,
    setCategoryName,
    categoryIcon,
    setCategoryIcon,
    subCategoryName,
    setSubCategoryName,
    subCategoryIcon,
    setSubCategoryIcon,
    subSubCategoryName,
    setSubSubCategoryName,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
    isLoading,
    message,
    messageType,
    handleCategorySubmit,
    handleSubCategorySubmit,
    handleSubSubCategorySubmit,
  };
};
