import AddQuestionForm from "@/components/admin/AddQuestionForm";

const AddQuestionPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add Question
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Create a new question for the question bank
        </p>
      </div>

      <AddQuestionForm />
    </div>
  );
};

export default AddQuestionPage;
