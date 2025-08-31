import React, { type JSX } from 'react';
import { Link, useLocation } from 'react-router-dom';
//import { MenuItem } from '../types'; = () => 

export interface MenuItem {
  path: string;
  name: string;
  icon: JSX.Element;
}

export function AdminPanel(): React.FC {
  const location = useLocation();
  
  const menuItems: MenuItem[] = [
    {
      path: '/categories',
      name: 'Categories',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      path: '/add-questions',
      name: 'Add Questions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      path: '/logout',
      name: 'Logout',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gray-800 min-h-screen fixed left-0 top-0">
      <div className="p-5 text-white font-bold text-xl border-b border-gray-700">
        Admin Dashboard
      </div>
      <nav className="mt-5">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="px-5 py-2">
              <Link
                to={item.path}
                className={`flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 ${isActive(item.path) ? 'bg-gray-700' : ''}`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminPanel;



// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { useEffect, useState } from "react"
// import { createCategory } from "@/services/category-service"
// import {
//   createSubCategory,
//   getCategories,
//   type Category,
// } from "@/services/subcategory-service"
// import type { AuthToken } from "@/types/auth"


// export function AdminPanel() {
//   const [categoryName, setCategoryName] = useState("")
//   const [apiError, setApiError] = useState("")
//   const [apiSuccess, setApiSuccess] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const [categories, setCategories] = useState<Category[]>([])
//   const [selectedCategoryId, setSelectedCategoryId] = useState("")
//   const [subCategoryName, setSubCategoryName] = useState("")
//   const [subCategoryApiError, setSubCategoryApiError] = useState("")
//   const [subCategoryApiSuccess, setSubCategoryApiSuccess] = useState("")
//   const [isSubCategoryLoading, setIsSubCategoryLoading] = useState(false)

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const tokenString = localStorage.getItem("accessToken")
//         if (!tokenString) {
//           throw new Error("Access token not found")
//         }
//         const token: AuthToken = { access: tokenString, refresh: "" }
//         const result = await getCategories(token)
//         setCategories(result.categories)
//       } catch (error) {
//         if (error instanceof Error) {
//           console.error("Failed to fetch categories:", error.message)
//         } else {
//           console.error("An unexpected error occurred while fetching categories.")
//         }
//       }
//     }
//     fetchCategories()
//   }, [])

//   const handleCategoryNameChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setCategoryName(e.target.value)
//   }

//   const handleSubCategoryNameChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setSubCategoryName(e.target.value)
//   }

//   const handleCategorySelect = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setSelectedCategoryId(e.target.value)
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setApiError("")
//     setApiSuccess("")
//     setIsLoading(true)

//     try {
//       const tokenString = localStorage.getItem("accessToken")
//       if (!tokenString) {
//         throw new Error("Access token not found")
//       }
//       const token: AuthToken = { access: tokenString, refresh: "" }

//       const result = await createCategory(categoryName, token)
//       setApiSuccess(result.message)
//       setCategoryName("")
//     } catch (error) {
//       if (error instanceof Error) {
//         setApiError(error.message)
//       } else {
//         setApiError("An unexpected error occurred.")
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCreateSubCategorySubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault()
//     setSubCategoryApiError("")
//     setSubCategoryApiSuccess("")
//     setIsSubCategoryLoading(true)

//     try {
//       const tokenString = localStorage.getItem("accessToken")
//       if (!tokenString) {
//         throw new Error("Access token not found")
//       }
//       const token: AuthToken = { access: tokenString, refresh: "" }

//       if (!selectedCategoryId) {
//         throw new Error("Please select a category.")
//       }

//       const result = await createSubCategory(
//         selectedCategoryId,
//         subCategoryName,
//         token
//       )
//       setSubCategoryApiSuccess(result.message)
//       setSubCategoryName("")
//       setSelectedCategoryId("")
//     } catch (error) {
//       if (error instanceof Error) {
//         setSubCategoryApiError(error.message)
//       } else {
//         setSubCategoryApiError("An unexpected error occurred.")
//       }
//     } finally {
//       setIsSubCategoryLoading(false)
//     }
//   }

//   return (
//     <div className="flex flex-col gap-6">   
//         <Card>
//           <CardHeader>
//             <CardTitle>Admin Panel</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p>Welcome to the admin panel.</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Create Category</CardTitle>
//             <CardDescription>
//               Create a new category for questions.
//             </CardDescription>
//           </CardHeader>
//           <form onSubmit={handleSubmit}>
//             <CardContent>
//               <div className="grid gap-3">
//                 <Label htmlFor="categoryName">Category Name</Label>
//                 <Input
//                   id="categoryName"
//                   type="text"
//                   placeholder="e.g. Science"
//                   required
//                   value={categoryName}
//                   onChange={handleCategoryNameChange} />
//               </div>
//             </CardContent>
//             <CardFooter className="flex flex-col items-start gap-4">
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading ? "Creating..." : "Create Category"}
//               </Button>
//               {apiError && (
//                 <p className="text-red-500 text-sm">{apiError}</p>
//               )}
//               {apiSuccess && (
//                 <p className="text-green-500 text-sm">{apiSuccess}</p>
//               )}
//             </CardFooter>
//           </form>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Create Sub Category</CardTitle>
//             <CardDescription>
//               Create a new sub category for a selected category.
//             </CardDescription>
//           </CardHeader>
//           <form onSubmit={handleCreateSubCategorySubmit}>
//             <CardContent>
//               <div className="grid gap-3">
//                 <Label htmlFor="parentCategory">Parent Category</Label>
//                 <select
//                   id="parentCategory"
//                   value={selectedCategoryId}
//                   onChange={handleCategorySelect}
//                   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   <option value="" disabled>
//                     Select a category
//                   </option>
//                   {categories.map((category) => (
//                     <option key={category.categoryId} value={category.categoryId}>
//                       {category.categoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="grid gap-3 mt-4">
//                 <Label htmlFor="subCategoryName">Sub Category Name</Label>
//                 <Input
//                   id="subCategoryName"
//                   type="text"
//                   placeholder="e.g. Physics"
//                   required
//                   value={subCategoryName}
//                   onChange={handleSubCategoryNameChange} />
//               </div>
//             </CardContent>
//             <CardFooter className="flex flex-col items-start gap-4">
//               <Button type="submit" disabled={isSubCategoryLoading}>
//                 {isSubCategoryLoading ? "Creating..." : "Create Sub Category"}
//               </Button>
//               {subCategoryApiError && (
//                 <p className="text-red-500 text-sm">{subCategoryApiError}</p>
//               )}
//               {subCategoryApiSuccess && (
//                 <p className="text-green-500 text-sm">{subCategoryApiSuccess}</p>
//               )}
//             </CardFooter>
//           </form>
//         </Card>
//       </div>
//   )
// }