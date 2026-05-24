import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import type { Question } from "@/types/question";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";

const SharedQuestionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/questions/${id}/`);
        setQuestion(response.data);
      } catch (error) {
        console.error("Failed to fetch shared question", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuestion();
  }, [id]);

  const promptSignup = () => {
    navigate("/auth/signup");
  };

  const handleOptionSelect = (label: string) => {
    if (question?.option_type === "multiple") {
      setSelectedOptions((prev) =>
        prev.includes(label) ? prev.filter((id) => id !== label) : [...prev, label]
      );
    } else {
      setSelectedOption(label);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <h2 className="mb-4 text-2xl font-bold">Question Not Found</h2>
        <p className="text-muted-foreground mb-6">
          This question might have been removed or the link is invalid.
        </p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-primary text-3xl font-bold">Shared Question</h1>
          <p className="text-muted-foreground">
            Sign up to practice more questions and track your progress!
          </p>
        </div>
        <Button onClick={promptSignup}>Sign Up Now</Button>
      </div>

      <Card className="border-border/50 mb-6 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4">
            <h2 className="text-foreground text-xl leading-relaxed font-semibold">
              {question.question_text}
            </h2>
            {question.question_image_url && (
              <div className="flex justify-center">
                <img
                  src={`${API_BASE_URL.replace("/api", "")}${question.question_image_url}`}
                  alt="Question illustration"
                  className="max-h-72 w-auto max-w-full rounded-lg border object-contain shadow-md"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {question.options.map((opt) => (
              <div key={opt.label} className="cursor-pointer">
                {question.option_type === "multiple" ? (
                  <MultipleChoiceOption
                    option={opt}
                    selectedOptions={selectedOptions}
                    disabled={false}
                    correctOptions={[]}
                    handleOptionSelect={handleOptionSelect}
                  />
                ) : (
                  <SingleChoiceOption
                    option={opt}
                    selectedOption={selectedOption}
                    disabled={false}
                    correctOptions={[]}
                    handleOptionSelect={handleOptionSelect}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button size="lg" className="gap-2" onClick={promptSignup}>
              Attempt Question <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedQuestionPage;
