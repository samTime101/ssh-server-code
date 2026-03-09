import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuestions } from "@/hooks/useQuestions.tsx";

const CEEPracticeSection = () => {
  const { token } = useAuth();
  const { fetchQuestions } = useQuestions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    const startSession = async () => {
      await fetchQuestions();
      navigate("/userpanel/cee-question");
    };
    startSession();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground text-lg">Loading questions...</p>
    </div>
  );
};

export default CEEPracticeSection;
