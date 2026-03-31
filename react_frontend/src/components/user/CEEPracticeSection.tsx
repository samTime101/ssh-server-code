import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useQuestions } from "@/hooks/useQuestions.tsx";
import { fetchQuestionSets } from "@/services/admin/questionset-service";
import { getQuestionById } from "@/services/user/question-service";
import type { QuestionSet } from "@/types/questionset";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CEEPracticeSection = () => {
  const { token } = useAuth();
  const { setSessionQuestions } = useQuestions();
  const navigate = useNavigate();
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [isLoadingSets, setIsLoadingSets] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState("");

  useEffect(() => {
    if (!token) return;

    const loadSets = async () => {
      setIsLoadingSets(true);
      try {
        const response = await fetchQuestionSets();
        setSets(response.sets);
      } catch {
        toast.error("Failed to load question sets");
      } finally {
        setIsLoadingSets(false);
      }
    };

    loadSets();
  }, [token]);

  const selectedSet = useMemo(
    () => sets.find((set) => set.id === selectedSetId) ?? null,
    [sets, selectedSetId]
  );

  const handleStart = async () => {
    if (!selectedSet) {
      toast.error("Please select a question set");
      return;
    }

    if (selectedSet.questions.length === 0) {
      toast.error("This set has no questions");
      return;
    }

    setIsStarting(true);
    try {
      const questions = await Promise.all(
        selectedSet.questions.map((question) => getQuestionById(question.id))
      );
      const validQuestions = questions.filter(
        (question): question is NonNullable<typeof question> => Boolean(question)
      );

      if (validQuestions.length === 0) {
        toast.error("No questions available for this set");
        return;
      }

      setSessionQuestions(validQuestions);
      navigate("/userpanel/cee-question");
    } catch {
      toast.error("Failed to start CEE practice");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-full max-w-3xl flex-1 flex-col gap-6 p-8">
      <Card>
        <CardHeader>
          <CardTitle>CEE Practice</CardTitle>
          <CardDescription>Select a question set and start practice.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingSets && <p className="text-muted-foreground text-sm">Loading sets...</p>}

          {!isLoadingSets && sets.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {sets.map((set) => {
                const isSelected = set.id === selectedSetId;

                return (
                  <button
                    key={set.id}
                    type="button"
                    onClick={() => setSelectedSetId(set.id)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-primary/30 ring-2"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold">{set.name}</p>
                      {isSelected && (
                        <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                      {set.description || "No description"}
                    </p>
                    <p className="text-muted-foreground mt-2 text-xs">
                      {set.questions.length} question{set.questions.length === 1 ? "" : "s"}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {!isLoadingSets && sets.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No question sets are available right now.
            </p>
          )}

          <div className="flex justify-end">
            <Button onClick={handleStart} disabled={!selectedSetId || isStarting || isLoadingSets}>
              {isStarting ? "Starting..." : "Start Practice"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CEEPracticeSection;
