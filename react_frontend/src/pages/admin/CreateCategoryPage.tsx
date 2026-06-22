import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import IconPicker from "@/components/IconPicker";
import { useCreateCategory } from "@/hooks/admin/useCreateCategory";

const CreateCategoryPage = () => {
  const {
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
  } = useCreateCategory();

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="text-foreground mb-6 text-3xl font-bold">Create New Category</h1>

        <div className="bg-card rounded-lg p-6 shadow-md">
          {/* Info Banner */}
          <div className="bg-primary/5 border-primary/20 mb-6 rounded-lg border p-4">
            <div className="flex items-center">
              <svg className="text-primary mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-foreground text-sm">
                <strong>Note:</strong> You must be a superuser to create categories.
              </p>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                messageType === "success"
                  ? "border border-green-200 bg-green-50 text-green-800"
                  : "bg-destructive/5 border-destructive/30 text-destructive border"
              }`}
            >
              <div className="flex items-center">
                {messageType === "success" ? (
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Category Name *
              </label>
              <Input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name (e.g., Computer Science)"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="categoryIcon"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Icon
              </label>
              <IconPicker
                value={categoryIcon}
                onChange={setCategoryIcon}
                disabled={isLoading}
                placeholder="Select category icon"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !categoryName.trim()}
                className={`rounded-md px-6 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                  isLoading || !categoryName.trim()
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
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
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Select Category *
              </label>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Select Category --" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-6">
              <label
                htmlFor="subCategoryName"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Subcategory Name *
              </label>
              <Input
                type="text"
                id="subCategoryName"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                placeholder="Enter subcategory name"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="subCategoryIcon"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Icon
              </label>
              <IconPicker
                value={subCategoryIcon}
                onChange={setSubCategoryIcon}
                disabled={isLoading}
                placeholder="Select subcategory icon"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !selectedCategoryId || !subCategoryName.trim()}
                className={`rounded-md px-6 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                  isLoading || !selectedCategoryId || !subCategoryName.trim()
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
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
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Select Subcategory *
              </label>
              <Select
                value={selectedSubCategoryId}
                onValueChange={setSelectedSubCategoryId}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Select Subcategory --" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .find((cat) => cat.categoryId === selectedCategoryId)
                    ?.subCategories?.map((subcat: any) => (
                      <SelectItem key={subcat.subCategoryId} value={subcat.subCategoryId}>
                        {subcat.subCategoryName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-6">
              <label
                htmlFor="subSubCategoryName"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Subsubcategory Name *
              </label>
              <Input
                type="text"
                id="subSubCategoryName"
                value={subSubCategoryName}
                onChange={(e) => setSubSubCategoryName(e.target.value)}
                placeholder="Enter subsubcategory name"
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !selectedSubCategoryId || !subSubCategoryName.trim()}
                className={`rounded-md px-6 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                  isLoading || !selectedSubCategoryId || !subSubCategoryName.trim()
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
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
