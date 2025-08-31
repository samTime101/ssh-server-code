import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Types based on the provided JSON format
interface Option {
  optionId: string;
  text: string;
}

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: Option[];
  correctAnswers: string[];
  difficulty: string;
  category: string;
  subCategory: string[];
  subSubCategory: string[];
  createdAt: string;
  updatedAt: string;
}

interface QuestionsResponse {
  questions: Question[];
}

const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sample questions data
  // const sampleQuestions: QuestionsResponse = {
  //   questions: [
  //     {
  //       id: "68a98ac5d969b82fb73726a2",
  //       questionText: "What is the way to multiply two matrices?",
  //       questionType: "single",
  //       options: [
  //         {
  //           optionId: "A",
  //           text: "Multiply corresponding elements"
  //         },
  //         {
  //           optionId: "B",
  //           text: "Add corresponding elements"
  //         },
  //         {
  //           optionId: "C",
  //           text: "Dot product of rows and columns"
  //         },
  //         {
  //           optionId: "D",
  //           text: "Cross product of rows and columns"
  //         }
  //       ],
  //       correctAnswers: ["C"],
  //       difficulty: "easy",
  //       category: "Maths",
  //       subCategory: ["Matrices"],
  //       subSubCategory: ["Matrices"],
  //       createdAt: "2025-08-23T09:32:53.640000",
  //       updatedAt: "2025-08-23T09:32:53.640000"
  //     },
  //     {
  //       id: "68a98ac5d969b82fb73726a3",
  //       questionText: "What is the derivative of x²?",
  //       questionType: "single",
  //       options: [
  //         {
  //           optionId: "A",
  //           text: "x"
  //         },
  //         {
  //           optionId: "B",
  //           text: "2x"
  //         },
  //         {
  //           optionId: "C",
  //           text: "x²"
  //         },
  //         {
  //           optionId: "D",
  //           text: "2x²"
  //         }
  //       ],
  //       correctAnswers: ["B"],
  //       difficulty: "easy",
  //       category: "Maths",
  //       subCategory: ["Calculus"],
  //       subSubCategory: ["Derivatives"],
  //       createdAt: "2025-08-23T09:32:53.640000",
  //       updatedAt: "2025-08-23T09:32:53.640000"
  //     },
  //     {
  //       id: "68a98ac5d969b82fb73726a4",
  //       questionText: "Which of the following are programming languages?",
  //       questionType: "multiple",
  //       options: [
  //         {
  //           optionId: "A",
  //           text: "Python"
  //         },
  //         {
  //           optionId: "B",
  //           text: "HTML"
  //         },
  //         {
  //           optionId: "C",
  //           text: "Java"
  //         },
  //         {
  //           optionId: "D",
  //           text: "CSS"
  //         }
  //       ],
  //       correctAnswers: ["A", "C"],
  //       difficulty: "medium",
  //       category: "Computer Science",
  //       subCategory: ["Programming"],
  //       subSubCategory: ["Languages"],
  //       createdAt: "2025-08-23T09:32:53.640000",
  //       updatedAt: "2025-08-23T09:32:53.640000"
  //     },
  //     {
  //       id: "68a98ac5d969b82fb73726a5",
  //       questionText: "What is the capital of France?",
  //       questionType: "single",
  //       options: [
  //         {
  //           optionId: "A",
  //           text: "London"
  //         },
  //         {
  //           optionId: "B",
  //           text: "Berlin"
  //         },
  //         {
  //           optionId: "C",
  //           text: "Paris"
  //         },
  //         {
  //           optionId: "D",
  //           text: "Madrid"
  //         }
  //       ],
  //       correctAnswers: ["C"],
  //       difficulty: "easy",
  //       category: "Geography",
  //       subCategory: ["Europe"],
  //       subSubCategory: ["Capitals"],
  //       createdAt: "2025-08-23T09:32:53.640000",
  //       updatedAt: "2025-08-23T09:32:53.640000"
  //     },
  //     {
  //       id: "68a98ac5d969b82fb73726a6",
  //       questionText: "Which elements are noble gases?",
  //       questionType: "multiple",
  //       options: [
  //         {
  //           optionId: "A",
  //           text: "Helium"
  //         },
  //         {
  //           optionId: "B",
  //           text: "Oxygen"
  //         },
  //         {
  //           optionId: "C",
  //           text: "Neon"
  //         },
  //         {
  //           optionId: "D",
  //           text: "Argon"
  //         }
  //       ],
  //       correctAnswers: ["A", "C", "D"],
  //       difficulty: "medium",
  //       category: "Science",
  //       subCategory: ["Chemistry"],
  //       subSubCategory: ["Elements"],
  //       createdAt: "2025-08-23T09:32:53.640000",
  //       updatedAt: "2025-08-23T09:32:53.640000"
  //     }
  //   ]
  // };

  useEffect(() => {
    // Simulate API call with timeout
    // const fetchQuestions = async () => {
    //   try {
    //     setLoading(true);
        
    //     // Simulate network delay
    //     await new Promise(resolve => setTimeout(resolve, 1000));
        
    //     // Use sample data instead of API call
    //     setQuestions(sampleQuestions.questions);
    //   } 
    // DATA FETCH
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        // --------------------------_ADDED BY SAMIP REGMI----------------------
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8000/api/select/questions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            categoryIds: [],
            subCategoryIds: [],
            subSubCategoryIds: []
          }),
        });

        if (!response.ok) {
          throw new Error("FAILED TO LOAD QUESTION");
        }
        const data: QuestionsResponse = await response.json();
        setQuestions(data.questions);
        setError(null);
        // -------------------------------------------------------------
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;

    try {
      setSubmitting(true);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Submitted answer:', {
        questionId: questions[currentQuestionIndex].id,
        selectedAnswer: selectedAnswer,
        isCorrect: questions[currentQuestionIndex].correctAnswers.includes(selectedAnswer)
      });

      // Move to the next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz completed
        navigate('/dashboard', { state: { completed: true } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error submitting answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Questions</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">❓</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-4">There are no questions for the selected categories.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with progress */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-semibold text-gray-800">Question {currentQuestionIndex + 1} of {questions.length}</h1>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Question content */}
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {currentQuestion.difficulty}
            </span>
            <span className="text-sm text-gray-500">
              {currentQuestion.category} • {currentQuestion.subCategory.join(', ')}
            </span>
          </div>
          
          <h2 className="text-xl font-semibold mb-6 text-gray-800">{currentQuestion.questionText}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div 
                key={option.optionId}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAnswer === option.optionId 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
                onClick={() => handleAnswerSelect(option.optionId)}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                    selectedAnswer === option.optionId 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === option.optionId && (
                      <span className="text-xs">✓</span>
                    )}
                  </div>
                  <span className="font-medium text-gray-800">{option.optionId}. {option.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setSelectedAnswer(null);
              }
            }}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer || submitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {submitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Submitting...
              </>
            ) : currentQuestionIndex < questions.length - 1 ? (
              'Submit & Next'
            ) : (
              'Submit & Finish'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;


// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// // Types based on the provided JSON format
// interface Option {
//   optionId: string;
//   text: string;
// }

// interface Question {
//   id: string;
//   questionText: string;
//   questionType: string;
//   options: Option[];
//   correctAnswers: string[];
//   difficulty: string;
//   category: string;
//   subCategory: string[];
//   subSubCategory: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// interface QuestionsResponse {
//   questions: Question[];
// }

// const QuestionsPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Get the selected subcategories from navigation state
//   const selectedSubCategories = location.state?.selectedSubCategories || [];

//   useEffect(() => {
//     // Fetch questions from the Django backend
//     const fetchQuestions = async () => {
//       try {
//         setLoading(true);
//         // In a real application, you would send the selected subcategories to the backend
//         // const response = await fetch('/api/questions/', {
//         //   method: 'POST',
//         //   headers: {
//         //     'Content-Type': 'application/json',
//         //   },
//         //   body: JSON.stringify({
//         //     subCategories: selectedSubCategories
//         //   }),
//         // });

//         // if (!response.ok) {
//         //   throw new Error(`HTTP error! status: ${response.status}`);
//         // }

//         // const data: QuestionsResponse = await response.json();
//         // setQuestions(data.questions);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An unknown error occurred');
//         console.error('Error fetching questions:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [selectedSubCategories]);

//   const handleAnswerSelect = (optionId: string) => {
//     setSelectedAnswer(optionId);
//   };

//   const handleSubmit = async () => {
//     if (!selectedAnswer) return;

//     try {
//       setSubmitting(true);
      
//     //   // Send the answer to the Django backend
//     //   const response = await fetch('/api/submit-answer/', {
//     //     method: 'POST',
//     //     headers: {
//     //       'Content-Type': 'application/json',
//     //     },
//     //     body: JSON.stringify({
//     //       questionId: questions[currentQuestionIndex].id,
//     //       selectedAnswer: selectedAnswer,
//     //       isCorrect: questions[currentQuestionIndex].correctAnswers.includes(selectedAnswer)
//     //     }),
//     //   });

//     //   if (!response.ok) {
//     //     throw new Error(`HTTP error! status: ${response.status}`);
//     //   }

//       // Move to the next question
//       if (currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex(currentQuestionIndex + 1);
//         setSelectedAnswer(null);
//       } else {
//         // Quiz completed
//         navigate('/dashboard', { state: { completed: true } });
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An unknown error occurred');
//       console.error('Error submitting answer:', err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/dashboard');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading questions...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-red-600 text-4xl mb-4">⚠️</div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Questions</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-gray-400 text-4xl mb-4">❓</div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">No Questions Available</h2>
//           <p className="text-gray-600 mb-4">There are no questions for the selected categories.</p>
//           <button
//             onClick={() => navigate('/')}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
//           >
//             Back to Categories
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentQuestionIndex];
//   const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header with progress */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="container mx-auto p-4">
//           <div className="flex justify-between items-center mb-2">
//             <h1 className="text-xl font-semibold text-gray-800">Question {currentQuestionIndex + 1} of {questions.length}</h1>
//             <button
//               onClick={handleCancel}
//               className="text-gray-500 hover:text-gray-700 font-medium"
//             >
//               Cancel
//             </button>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div 
//               className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>
//       </header>

//       {/* Question content */}
//       <div className="container mx-auto p-4">
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
//               {currentQuestion.difficulty}
//             </span>
//             <span className="text-sm text-gray-500">
//               {currentQuestion.category} • {currentQuestion.subCategory.join(', ')}
//             </span>
//           </div>
          
//           <h2 className="text-xl font-semibold mb-6 text-gray-800">{currentQuestion.questionText}</h2>
          
//           <div className="space-y-3">
//             {currentQuestion.options.map((option) => (
//               <div 
//                 key={option.optionId}
//                 className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
//                   selectedAnswer === option.optionId 
//                     ? 'border-blue-500 bg-blue-50' 
//                     : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
//                 }`}
//                 onClick={() => handleAnswerSelect(option.optionId)}
//               >
//                 <div className="flex items-center">
//                   <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
//                     selectedAnswer === option.optionId 
//                       ? 'border-blue-500 bg-blue-500 text-white' 
//                       : 'border-gray-300'
//                   }`}>
//                     {selectedAnswer === option.optionId && (
//                       <span className="text-xs">✓</span>
//                     )}
//                   </div>
//                   <span className="font-medium text-gray-800">{option.optionId}. {option.text}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Navigation buttons */}
//         <div className="flex justify-between">
//           <button
//             onClick={() => {
//               if (currentQuestionIndex > 0) {
//                 setCurrentQuestionIndex(currentQuestionIndex - 1);
//                 setSelectedAnswer(null);
//               }
//             }}
//             disabled={currentQuestionIndex === 0}
//             className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Previous
//           </button>
          
//           <button
//             onClick={handleSubmit}
//             disabled={!selectedAnswer || submitting}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
//           >
//             {submitting ? (
//               <>
//                 <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
//                 Submitting...
//               </>
//             ) : currentQuestionIndex < questions.length - 1 ? (
//               'Submit & Next'
//             ) : (
//               'Submit & Finish'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionsPage;