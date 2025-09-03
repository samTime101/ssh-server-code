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
export interface QuestionsPageProps {
  selectedCategories: number[];
  selectedSubCategories?: number[];
  selectedSubSubCategories?: number[];
}

const QuestionsPage: React.FC<QuestionsPageProps> = ({ selectedCategories, selectedSubCategories, selectedSubSubCategories }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  selectedCategories = location.state?.selectedCategories || [];
  selectedSubCategories = location.state?.selectedSubCategories || [];
  selectedSubSubCategories = location.state?.selectedSubSubCategories || [];

  useEffect(() => {

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
            categoryIds: selectedCategories,
            subCategoryIds: selectedSubCategories || [],
            subSubCategoryIds: selectedSubSubCategories || [],
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
    setSelectedAnswers((prev) => [...prev, optionId]);
  };

  const handleSubmit = async () => {
    if (selectedAnswers.length === 0) return;

    try {
      setSubmitting(true);
      
      fetch('http://localhost:8000/api/user/attempt/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          questionId: questions[currentQuestionIndex].id,
          selectedAnswers: selectedAnswers,
        }),
      })

        console.log('Submitted answer:', {
          questionId: questions[currentQuestionIndex].id,
          selectedAnswers: selectedAnswers,
        });

      // Move to the next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswers([]);
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
                  selectedAnswers.includes(option.optionId) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
                onClick={() => handleAnswerSelect(option.optionId)}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                    selectedAnswers.includes(option.optionId) 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers.includes(option.optionId) && (
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
                setSelectedAnswers([]);
              }
            }}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswers || submitting}
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

