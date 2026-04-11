import type { Attempt, SubmissionHistoryResponse } from "@/types/history";

export const flattenSubmissionAttempts = (
  data: SubmissionHistoryResponse | null | undefined
): Attempt[] => {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data.flatMap((submission) => submission?.attempts ?? []);
  }

  if (Array.isArray(data.results)) {
    return data.results.flatMap((submission) => submission?.attempts ?? []);
  }

  return [];
};
