import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookOpenText, Files, Layers3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuestions } from "@/hooks/useQuestions.tsx";
import { fetchQuestionSetSession, fetchQuestionSets } from "@/services/admin/questionset-service";
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

  const totalQuestions = useMemo(
    () => sets.reduce((count, set) => count + set.questions.length, 0),
    [sets]
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
      const session = await fetchQuestionSetSession(selectedSet.id);
      const validQuestions = session.results ?? [];

      if (validQuestions.length === 0) {
        toast.error("No questions available for this set");
        return;
      }

      setSessionQuestions(validQuestions, session.submission_id ?? null);
      navigate("/userpanel/cee-question");
    } catch {
      toast.error("Failed to start CEE practice");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-full w-full max-w-[1400px] flex-1 flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <Card className="border-border/70 bg-card/80">
        <CardHeader className="gap-4">
          <div>
            <CardTitle className="text-2xl">CEE Practice</CardTitle>
            <CardDescription className="mt-1 text-sm md:text-base">
              Choose a set, review what it contains, and start when you are ready.
            </CardDescription>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="bg-muted/40 rounded-lg border p-3">
              <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase">
                <Layers3 size={14} />
                Sets
              </div>
              <p className="mt-1 text-lg font-semibold">{sets.length}</p>
            </div>
            <div className="bg-muted/40 rounded-lg border p-3">
              <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase">
                <BookOpenText size={14} />
                Questions
              </div>
              <p className="mt-1 text-lg font-semibold">{totalQuestions}</p>
            </div>
            <div className="bg-muted/40 rounded-lg border p-3">
              <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase">
                <Files size={14} />
                Selected
              </div>
              <p className="mt-1 truncate text-lg font-semibold">
                {selectedSet ? selectedSet.name : "None"}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid items-start gap-6 xl:grid-cols-[1.8fr_1fr]">
        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Available Sets</CardTitle>
            <CardDescription>Pick one to load for this practice session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingSets && <p className="text-muted-foreground text-sm">Loading sets...</p>}

            {!isLoadingSets && sets.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2">
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
          </CardContent>
        </Card>

        <Card className="border-border/70 xl:sticky xl:top-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Set Details</CardTitle>
            <CardDescription>Review before starting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedSet ? (
              <>
                <div>
                  <p className="text-base font-semibold">{selectedSet.name}</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {selectedSet.description || "No description provided for this set."}
                  </p>
                </div>
                <div className="bg-muted/40 rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs uppercase">Question Count</p>
                  <p className="mt-1 text-lg font-semibold">
                    {selectedSet.questions.length} question
                    {selectedSet.questions.length === 1 ? "" : "s"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Select a set to view its details here.
              </p>
            )}

            <Button
              className="w-full"
              onClick={handleStart}
              disabled={!selectedSetId || isStarting || isLoadingSets}
            >
              {isStarting ? "Starting..." : "Start Practice"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CEEPracticeSection;
