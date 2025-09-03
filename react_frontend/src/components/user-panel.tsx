// MODIFIED ON SEP 3 BY SAMIP REGMI
// I HAVE REMOVED AND PUT ALL THE INTERFACES UNDER FILE <types/types.ts>

import { getCategories } from '@/services/subcategory-service';
import type { AuthToken , Category  } from '@/types/types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const UserPanel: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  // FOR NOW I HAVE NOT IMPLEMENTED SUBSUBCATEGORY , THE DEFAULT VALUE IS EMPTY ARRAY
  const [selectedSubSubCategories, setSelectedSubSubCategories] = useState<number[]>([]);
  
  const [totalQuestionCount, setTotalQuestionCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const tokenString = localStorage.getItem("accessToken");
        if (!tokenString) throw new Error("ACCESS TOKEN NOT FOUND");
        const token: AuthToken = { access: tokenString, refresh: "" };
        const result = await getCategories(token);
        setCategories(result.categories);
        setTotalQuestionCount(result.total_question_count);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  // HANDLER CATEGORY SELECTION KEEPS ALL THE SELECTED CATEGORY IDS
  // IN AN ARRAY
  // IF THE CATEGORY IS ALREADY SELECTED, IT REMOVES IT FROM THE ARRAY
  // ELSE IT ADDS IT TO THE ARRAY

  const handleCategorySelect = (categoryId: number) => {
    console.log('Category ID:', categoryId);
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)){
        // REMOVE CATEGORYID FROM ARRAY
        // MAKING SURE NEW ARRAY DOES NOT HAVE THE SELECTED ID
        const updatedCategories = prev.filter(id => id !== categoryId); 
        console.log(`Removing category ID: ${categoryId}`);
        return updatedCategories;

      }
      console.log(`Adding category ID: ${categoryId}`);
      // ADD CATEGORYID TO ARRAY
      return [...prev, categoryId];
    });

  };

  // EXACT SAME AS HANDLECATEGORYSELECT
  // BUT FOR SUBCATEGORY
  // IT KEEPS TRACK OF SELECTED SUBCATEGORY IDS
  // IN AN ARRAY
  // IF THE SUBCATEGORY IS ALREADY SELECTED, IT REMOVES IT FROM THE ARRAY
  // ELSE IT ADDS IT TO THE ARRAY

  const handleSubCategorySelect = (subCategoryId: number) => {
    setSelectedSubCategories(prev => {
      if (prev.includes(subCategoryId)) {
        const updatedSubCategories = prev.filter(id => id !== subCategoryId);
        return updatedSubCategories;
      }
      return [...prev, subCategoryId];
    });
  };

  // ON SUBMIT NAVIGATES TO /QUESTIONS PAGE
  // AND PASSES THE SELECTEDCATEGORY IDS
  // AND SELECTEDSUBCATEGORY IDS
  // AS STATE TO THE /QUESTIONS PAGE
  const handleSubmit = () => {
    navigate('/questions', { state: { selectedCategories, selectedSubCategories, selectedSubSubCategories } });
  };

  // TODO FIX THE UI OF THIS PAGE
  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>TOTAL QUESTION COUNT : {totalQuestionCount}</h1>
      <h1 className='text-xl font-semibold mb-4'>Categories</h1>
      <h3>while choosing sub categories no need to select its categories
        DIRECTLY SELECT SUB CAT
      </h3>
      <ul>
        {categories.map(category => (
          <li key={category.categoryId} className='mb-2'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                className='mr-2'
                checked={selectedCategories.includes(category.categoryId)}
                onChange={() => handleCategorySelect(category.categoryId)}
              />
              <strong>{category.categoryName}</strong>
              <span className='ml-2 text-gray-600'>({category.question_count} questions)</span>
            </div>

            <ul className='ml-6 mt-1'>
              {category.subCategories.map(sub => (
                <li key={sub.subCategoryId} className='mb-1'>
                  <div className='text-sm font-medium'>
                    <input type='checkbox'
                     className='mr-2' 
                      // CHECKING IF THE SUBCATEGORY ID IS IN THE SELECTEDSUBCATEGORIES ARRAY
                      checked={selectedSubCategories.includes(sub.subCategoryId)}
                      onChange={() => handleSubCategorySelect(sub.subCategoryId)}
                     />
                    {sub.subCategoryName} ({sub.question_count} questions)
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        className='mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700'
      >
        Proceed
      </button>
    </div>
  );
};

export default UserPanel;
