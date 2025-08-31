import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createCategory } from "@/services/category-service"
import {
  createSubCategory,
  getCategories,
  type Category,
} from "@/services/subcategory-service"
import type { AuthToken } from "@/types/auth"
import AdminPanel from "../admin-panel"


export function Categories() {
  const [categoryName, setCategoryName] = useState("")
  const [apiError, setApiError] = useState("")
  const [apiSuccess, setApiSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [subCategoryName, setSubCategoryName] = useState("")
  const [subCategoryApiError, setSubCategoryApiError] = useState("")
  const [subCategoryApiSuccess, setSubCategoryApiSuccess] = useState("")
  const [isSubCategoryLoading, setIsSubCategoryLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const tokenString = localStorage.getItem("accessToken")
        if (!tokenString) {
          throw new Error("Access token not found")
        }
        const token: AuthToken = { access: tokenString, refresh: "" }
        const result = await getCategories(token)
        setCategories(result.categories)
      } catch (error) {
        if (error instanceof Error) {
          console.error("Failed to fetch categories:", error.message)
        } else {
          console.error("An unexpected error occurred while fetching categories.")
        }
      }
    }
    fetchCategories()
  }, [])

  const handleCategoryNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCategoryName(e.target.value)
  }

  const handleSubCategoryNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSubCategoryName(e.target.value)
  }

  const handleCategorySelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategoryId(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setApiError("")
    setApiSuccess("")
    setIsLoading(true)

    try {
      const tokenString = localStorage.getItem("accessToken")
      if (!tokenString) {
        throw new Error("Access token not found")
      }
      const token: AuthToken = { access: tokenString, refresh: "" }

      const result = await createCategory(categoryName, token)
      setApiSuccess(result.message)
      setCategoryName("")
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message)
      } else {
        setApiError("An unexpected error occurred.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSubCategorySubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setSubCategoryApiError("")
    setSubCategoryApiSuccess("")
    setIsSubCategoryLoading(true)

    try {
      const tokenString = localStorage.getItem("accessToken")
      if (!tokenString) {
        throw new Error("Access token not found")
      }
      const token: AuthToken = { access: tokenString, refresh: "" }

      if (!selectedCategoryId) {
        throw new Error("Please select a category.")
      }

      const result = await createSubCategory(
        selectedCategoryId,
        subCategoryName,
        token
      )
      setSubCategoryApiSuccess(result.message)
      setSubCategoryName("")
      setSelectedCategoryId("")
    } catch (error) {
      if (error instanceof Error) {
        setSubCategoryApiError(error.message)
      } else {
        setSubCategoryApiError("An unexpected error occurred.")
      }
    } finally {
      setIsSubCategoryLoading(false)
    }
  }

  return (
    <><AdminPanel /><div className="flex flex-col gap-6">
          <Card>
              <CardHeader>
                  <CardTitle>Create Category</CardTitle>
                  <CardDescription>
                      Create a new category for questions.
                  </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                  <CardContent>
                      <div className="grid gap-3">
                          <Label htmlFor="categoryName">Category Name</Label>
                          <Input
                              id="categoryName"
                              type="text"
                              placeholder="e.g. Science"
                              required
                              value={categoryName}
                              onChange={handleCategoryNameChange} />
                      </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-4">
                      <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Creating..." : "Create Category"}
                      </Button>
                      {apiError && (
                          <p className="text-red-500 text-sm">{apiError}</p>
                      )}
                      {apiSuccess && (
                          <p className="text-green-500 text-sm">{apiSuccess}</p>
                      )}
                  </CardFooter>
              </form>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>Create Sub Category</CardTitle>
                  <CardDescription>
                      Create a new sub category for a selected category.
                  </CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateSubCategorySubmit}>
                  <CardContent>
                      <div className="grid gap-3">
                          <Label htmlFor="parentCategory">Parent Category</Label>
                          <select
                              id="parentCategory"
                              value={selectedCategoryId}
                              onChange={handleCategorySelect}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                              <option value="" disabled>
                                  Select a category
                              </option>
                              {categories.map((category) => (
                                  <option key={category.categoryId} value={category.categoryId}>
                                      {category.categoryName}
                                  </option>
                              ))}
                          </select>
                      </div>
                      <div className="grid gap-3 mt-4">
                          <Label htmlFor="subCategoryName">Sub Category Name</Label>
                          <Input
                              id="subCategoryName"
                              type="text"
                              placeholder="e.g. Physics"
                              required
                              value={subCategoryName}
                              onChange={handleSubCategoryNameChange} />
                      </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-4">
                      <Button type="submit" disabled={isSubCategoryLoading}>
                          {isSubCategoryLoading ? "Creating..." : "Create Sub Category"}
                      </Button>
                      {subCategoryApiError && (
                          <p className="text-red-500 text-sm">{subCategoryApiError}</p>
                      )}
                      {subCategoryApiSuccess && (
                          <p className="text-green-500 text-sm">{subCategoryApiSuccess}</p>
                      )}
                  </CardFooter>
              </form>
          </Card>
      </div></>
  )
}