import { getCategories } from '@/services/subcategory-service';
import type { AuthToken } from '@/types/auth';
import React, { useEffect, useState } from 'react';

// Types
interface SubCategory {
  id: number;
  name: string;
  question_count: number;
  subSubCategories: any[];
}

interface Category {
  id: number;
  name: string;
  question_count: number;
  subCategories: SubCategory[];
}
interface UserStats {
  points: number;
  totalQuestions: number;
  attemptedQuestions: number;
}

// // Mock data
// const MOCK_CATEGORIES: Category[] = [
//   {
//     id: 'math',
//     name: 'Mathematics',
//     subCategories: [
//       { id: 'algebra', name: 'Algebra', questionCount: 15 },
//       { id: 'geometry', name: 'Geometry', questionCount: 12 },
//       { id: 'calculus', name: 'Calculus', questionCount: 8 },
//     ],
//   },
//   {
//     id: 'science',
//     name: 'Science',
//     subCategories: [
//       { id: 'physics', name: 'Physics', questionCount: 20 },
//       { id: 'chemistry', name: 'Chemistry', questionCount: 18 },
//       { id: 'biology', name: 'Biology', questionCount: 22 },
//     ],
//   },
//   {
//     id: 'history',
//     name: 'History',
//     subCategories: [
//       { id: 'ancient', name: 'Ancient History', questionCount: 10 },
//       { id: 'modern', name: 'Modern History', questionCount: 15 },
//     ],
//   },
// ];

const MOCK_USER_STATS: UserStats = {
  points: 1250,
  totalQuestions: 100,
  attemptedQuestions: 75,
};

// Main component
const UserPanel: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [userStats] = useState<UserStats>(MOCK_USER_STATS);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const tokenString = localStorage.getItem("accessToken");
          if (!tokenString) {
            throw new Error("Access token not found");
          }
          const token: AuthToken = { access: tokenString, refresh: "" };
          const result = await getCategories(token);
          setCategories(result.categories);
          // ----------------------ADDED BY SAMIP REGMI--------------------------------
          userStats.totalQuestions = result.total_question_count;
          // ------------------------------------------------------------------------------
        } catch (error) {
          if (error instanceof Error) {
            console.error("Failed to fetch categories:", error.message);
          } else {
            console.error("An unexpected error occurred while fetching categories.");
          }
        }
      };
      fetchCategories();
    }, []);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Handle checkbox selection
  const handleCheckboxChange = (itemId: string, isCategory: boolean = false) => {
    const newSelected = new Set(selectedItems);
    
    if (isCategory) {
      // Handle category selection - automatically select/deselect all subcategories
      const category = categories.find(cat => cat.id === itemId);
      
      if (newSelected.has(itemId)) {
        // Deselect category and all its subcategories
        newSelected.delete(itemId);
        category?.subCategories.forEach(subCat => {
          newSelected.delete(subCat.id);
        });
      } else {
        // Select category and all its subcategories
        newSelected.add(itemId);
        category?.subCategories.forEach(subCat => {
          newSelected.add(subCat.id);
        });
      }
    } else {
      // Handle subcategory selection
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
        
        // Check if we need to deselect the parent category
        let parentCategoryId: string | null = null;
        for (const category of categories) {
          if (category.subCategories.some(subCat => subCat.id === itemId)) {
            parentCategoryId = category.id;
            break;
          }
        }
        
        // If parent category exists and is selected, deselect it
        if (parentCategoryId && newSelected.has(parentCategoryId)) {
          newSelected.delete(parentCategoryId);
        }
      } else {
        newSelected.add(itemId);
        
        // Check if all subcategories are now selected to auto-select the parent
        let parentCategoryId: string | null = null;
        let parentCategory: Category | null = null;
        
        for (const category of categories) {
          if (category.subCategories.some(subCat => subCat.id === itemId)) {
            parentCategoryId = category.id;
            parentCategory = category;
            break;
          }
        }
        
        // If all subcategories are selected, also select the parent category
        if (parentCategoryId && parentCategory) {
          const allSubsSelected = parentCategory.subCategories.every(subCat => 
            newSelected.has(subCat.id)
          );
          
          if (allSubsSelected) {
            newSelected.add(parentCategoryId);
          }
        }
      }
    }
    
    setSelectedItems(newSelected);
  };

  // Handle proceed to questions
  const handleProceedToQuestions = () => {
    const selectedSubCategories = Array.from(selectedItems).filter(itemId => 
      !categories.some(cat => cat.id === itemId)
    );

    if (selectedSubCategories.length === 0) {
      alert('Please select at least one subcategory to proceed.');
      return;
    }

    // Navigate to the questions page with selected subcategories
    navigate('/questions', { 
      state: { 
        selectedSubCategories,
        totalQuestions: getSelectedQuestionCount()
      } 
    });
  };

  // Calculate selected question count
  const getSelectedQuestionCount = (): number => {
    let count = 0;
    
    selectedItems.forEach(itemId => {
      // Check if it's a subcategory
      for (const category of categories) {
        const subCategory = category.subCategories.find(sub => sub.id === itemId);
        if (subCategory) {
          count += subCategory.questionCount;
          break;
        }
      }
    });

    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Quiz Platform</h1>
        </div>
      </header>

      {/* User Stats Panel */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Points</h3>
              <p className="text-2xl font-bold text-blue-600">{userStats.points.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Total Questions</h3>
              <p className="text-2xl font-bold text-green-600">{userStats.totalQuestions}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800">Attempted</h3>
              <p className="text-2xl font-bold text-orange-600">{userStats.attemptedQuestions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection Panel */}
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Select Categories and Subcategories
          </h2>
          
          <div className="mb-4 p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">
              Selected: {getSelectedQuestionCount()} questions across {selectedItems.size} items
            </p>
          </div>

          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg overflow-hidden">
                {/* Category Header */}
                <div className="bg-gray-100 p-3 flex items-center justify-between cursor-pointer hover:bg-gray-200"
                  onClick={() => toggleCategory(category.id)}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(category.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(category.id, true);
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-semibold text-gray-800">{category.categoryName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {expandedCategories.has(category.id) ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Subcategories */}
                {expandedCategories.has(category.id) && (
                  <div className="p-3 bg-white space-y-2">
                    {category.subCategories.map((subCategory) => (
                      <div key={subCategory.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(subCategory.id)}
                          onChange={() => handleCheckboxChange(subCategory.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{subCategory.subCategoryName}</span>
                        <span className="text-sm text-gray-500 ml-auto">
                          {/* MODIFIED BY SAMIP REGMI */}
                          {/*({subCategory.questionCount} questions)*/}
                          {/* ----------------------------------------------------------*/}
                          ({subCategory.question_count} questions)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Proceed Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleProceedToQuestions}
              disabled={getSelectedQuestionCount() === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Proceed to Questions ({getSelectedQuestionCount()} questions selected)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// export function UserPanel() {
//   return (
//     <div className="flex flex-col gap-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>User Panel</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>Welcome to the user panel.</p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
