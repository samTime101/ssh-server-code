import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import {
  normalizeQuestionSet,
  normalizeQuestionSetList,
  extractQuestionIds,
} from "@/utils/questionSetUtils";
import type {
  QuestionSet,
  QuestionSetListResponse,
  QuestionSetPayload,
  SelectableQuestion,
  SelectableQuestionListResponse,
} from "@/types/questionset";

const toSelectableQuestion = (raw: unknown): SelectableQuestion | null => {
  if (!raw || typeof raw !== "object") return null;

  const candidate = raw as Record<string, unknown>;
  const id = typeof candidate.id === "string" ? candidate.id : "";
  const questionText =
    typeof candidate.question_text === "string"
      ? candidate.question_text
      : typeof candidate.description === "string"
        ? candidate.description
        : "";

  if (!id || !questionText) return null;

  const status =
    candidate.status === "approved" ||
    candidate.status === "pending" ||
    candidate.status === "rejected"
      ? candidate.status
      : undefined;

  return {
    id,
    question_text: questionText,
    status,
  };
};

export const fetchQuestionSets = async (): Promise<QuestionSetListResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.questionSets);
    return {
      sets: normalizeQuestionSetList(response.data),
    };
  } catch (error) {
    console.error("Failed to fetch question sets:", error);
    throw new Error("Failed to fetch question sets");
  }
};

export const createQuestionSet = async (payload: QuestionSetPayload): Promise<QuestionSet> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.questionSets, payload);
    const normalized = normalizeQuestionSet(response.data);
    if (!normalized) {
      throw new Error("Invalid question set response");
    }
    return normalized;
  } catch (error) {
    console.error("Failed to create question set:", error);
    throw new Error("Failed to create question set");
  }
};

export const updateQuestionSet = async (
  id: string,
  payload: QuestionSetPayload
): Promise<QuestionSet> => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINTS.questionSets}${id}/`, payload);
    const normalized = normalizeQuestionSet(response.data);
    if (!normalized) {
      throw new Error("Invalid question set response");
    }
    return normalized;
  } catch (error) {
    console.error("Failed to update question set:", error);
    throw new Error("Failed to update question set");
  }
};

export const deleteQuestionSet = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_ENDPOINTS.questionSets}${id}/`);
  } catch (error) {
    console.error("Failed to delete question set:", error);
    throw new Error("Failed to delete question set");
  }
};

export const toQuestionSetPayload = (set: QuestionSet): QuestionSetPayload => {
  return {
    name: set.name,
    description: set.description,
    question_ids: extractQuestionIds(set.questions),
  };
};

export const fetchSelectableQuestions = async (
  page: number,
  pageSize: number,
  search?: string
): Promise<SelectableQuestionListResponse> => {
  try {
    const params: Record<string, string | number> = {
      page,
      page_size: pageSize,
    };
    if (search?.trim()) {
      params.search = search.trim();
    }

    const response = await axiosInstance.get(API_ENDPOINTS.adminQuestions, { params });
    const data = response.data as Record<string, unknown>;

    const rawResults = Array.isArray(data.results) ? data.results : [];
    const results = rawResults
      .map((item) => toSelectableQuestion(item))
      .filter((item): item is SelectableQuestion => item !== null);

    return {
      count: typeof data.count === "number" ? data.count : results.length,
      total_pages: typeof data.total_pages === "number" ? data.total_pages : 1,
      next: typeof data.next === "string" ? data.next : null,
      previous: typeof data.previous === "string" ? data.previous : null,
      results,
    };
  } catch (error) {
    console.error("Failed to fetch selectable questions:", error);
    throw new Error("Failed to fetch questions");
  }
};
