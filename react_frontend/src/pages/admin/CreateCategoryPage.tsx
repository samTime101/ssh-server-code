import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { useAuth } from "@/hooks/useAuth";
import { getCategories } from "@/services/admin/subcategory-service";
import { createSubCategory } from "@/services/admin/subcategory-service";
import { createSubSubCategory } from "@/services/admin/subsubcategory-service";
import axiosInstance from "@/services/axios";

const CreateCategoryPage = () => {
  const { token } = useAuth();

  const [categories, setCategories] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subSubCategoryName, setSubSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  

  // Fetch categories and subcategories
  useEffect(() => {
    async function fetchCategories() {
      if (!token) return;
      try {
        const data = await getCategories();
        console.log("The data is :", data );
        setCategories(data.categories);
      } catch (err) {
        setMessage("Failed to fetch categories");
        setMessageType("error");
      }
    }
    fetchCategories();
  }, [token]);

  // Create Category
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
      const categoryData = { name: categoryName };
      
      const result = await axiosInstance.post(
        API_ENDPOINTS.createCategory,
        categoryData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Category \"${result.data.name}\" created successfully!`);
      setMessageType("success");
      setCategoryName("");
      // Refresh categories
      // TODO: Refactor to use fetchCategories function
      const data = await getCategories();
      setCategories(data.categories);
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.name?.[0] || error.message || "Failed to create category. Please try again.";
      setMessage(errorMsg);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Create SubCategory
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
      const result = await createSubCategory(selectedCategoryId, subCategoryName);
    

      setMessage(`Subcategory \"${result.message}\" created successfully!`);
      setMessageType("success");
      setSubCategoryName("");
      // Refresh categories
      const data = await getCategories();
      setCategories(data.categories);
    } catch (error: any) {
      setMessage(error.message || "Failed to create subcategory. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Create SubSubCategory
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
        `Subsubcategory \"${result.subsubcategory.subSubCategoryName}\" created successfully!`
      );
      setMessageType("success");
      setSubSubCategoryName("");
      // Refresh categories
      const data = await getCategories();
      setCategories(data.categories);
    } catch (error: any) {
      setMessage(error.message || "Failed to create subsubcategory. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Category</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Info Banner */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You must be a superuser to create categories.
              </p>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                messageType === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center">
                {messageType === "success" ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          {/* Category Form */}
          <form onSubmit={handleCategorySubmit}>
            <div className="mb-6">
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Name *
              </label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category name (e.g., Computer Science)"
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !categoryName.trim()}
                className={`px-6 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading || !categoryName.trim()
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>

          {/* SubCategory Form */}
          <form onSubmit={handleSubCategorySubmit} className="mt-8">
            <div className="mb-6">
              <label
                htmlFor="categorySelect"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Category *
              </label>
              <select
                id="categorySelect"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label
                htmlFor="subCategoryName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subcategory Name *
              </label>
              <input
                type="text"
                id="subCategoryName"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter subcategory name"
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !selectedCategoryId || !subCategoryName.trim()}
                className={`px-6 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading || !selectedCategoryId || !subCategoryName.trim()
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Creating..." : "Add Subcategory"}
              </button>
            </div>
          </form>

          {/* SubSubCategory Form */}
          <form onSubmit={handleSubSubCategorySubmit} className="mt-8">
            <div className="mb-6">
              <label
                htmlFor="subCategorySelect"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Subcategory *
              </label>
              <select
                id="subCategorySelect"
                value={selectedSubCategoryId}
                onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value="">-- Select Subcategory --</option>
                {categories
                  .find((cat) => cat.categoryId === selectedCategoryId)
                  ?.subCategories?.map((subcat: any) => (
                    <option key={subcat.subCategoryId} value={subcat.subCategoryId}>
                      {subcat.subCategoryName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-6">
              <label
                htmlFor="subSubCategoryName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subsubcategory Name *
              </label>
              <input
                type="text"
                id="subSubCategoryName"
                value={subSubCategoryName}
                onChange={(e) => setSubSubCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter subsubcategory name"
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !selectedSubCategoryId || !subSubCategoryName.trim()}
                className={`px-6 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading || !selectedSubCategoryId || !subSubCategoryName.trim()
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Creating..." : "Add Subsubcategory"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryPage;
