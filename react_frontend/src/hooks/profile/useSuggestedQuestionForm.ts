import { useQuestionForm } from "@/hooks/admin/useQuestionForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

export const useSuggestedQuestionForm = () => {
  const { user } = useAuth();
  const form = useQuestionForm({ mode: "create" });

  const contributorName = useMemo(() => {
    const first = user?.first_name?.trim() ?? "";
    const last = user?.last_name?.trim() ?? "";
    return `${first} ${last}`.trim();
  }, [user?.first_name, user?.last_name]);

  useEffect(() => {
    if (!contributorName) return;
    if ((form.questionFormData?.contributor ?? "") === contributorName) return;

    form.setQuestionFormData((prev) => ({
      ...(prev ?? {
        questionText: "",
        description: "",
        categoryIds: [],
        subCategories: [],
        optionType: "single",
        difficulty: "easy",
        status: "pending",
        options: [
          { label: "A", text: "", isCorrect: false },
          { label: "B", text: "", isCorrect: false },
        ],
        contributor: "",
        contributorSpecialization: "",
      }),
      contributor: contributorName,
    }));
  }, [contributorName, form]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contributorName) {
      toast.error("Could not detect your name. Please re-login and try again.");
      return;
    }

    const contributor = form.questionFormData?.contributor?.trim() ?? "";
    const specialization = form.questionFormData?.contributorSpecialization?.trim() ?? "";

    if (!contributor) {
      toast.error("Contributor is required");
      return;
    }

    if (!specialization) {
      toast.error("Specialization is required");
      return;
    }

    form.handleCreateQuestionSubmit(e);
  };

  return {
    ...form,
    contributorName,
    onSubmit,
  };
};

