import AddQuestionForm from "@/components/admin/AddQuestionForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddQuestionPage = () => {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate(-1);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold">Add Question</h1>
        <p className="text-muted-foreground mt-1">Create a new question for the question bank</p>
        <Button
          variant="outline"
          onClick={handleExit}
          className="hover:bg-muted text-muted-foreground px-4 py-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit Add Question
        </Button>
      </div>

      <AddQuestionForm />
    </div>
  );
};

export default AddQuestionPage;
