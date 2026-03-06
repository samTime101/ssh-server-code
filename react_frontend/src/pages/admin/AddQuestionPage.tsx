import AddQuestionForm from "@/components/admin/AddQuestionForm";

const AddQuestionPage = () => {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold">Add Question</h1>
        <p className="text-muted-foreground mt-1">Create a new question for the question bank</p>
      </div>

      <AddQuestionForm />
    </div>
  );
};

export default AddQuestionPage;
