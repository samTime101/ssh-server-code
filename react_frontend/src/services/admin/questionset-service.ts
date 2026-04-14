import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import { extractQuestionIds } from "@/utils/questionSetUtils";
import type { PaginatedQuestionsResponse } from "@/types/question";
import type {
  PaginatedQuestionSetApiResponse,
  PaginatedSelectableQuestionApiResponse,
  QuestionSet,
  QuestionSetApi,
  QuestionSetQuestionApi,
  QuestionSetListResponse,
  QuestionSetPayload,
  SelectableQuestion,
  SelectableQuestionApi,
  SelectableQuestionListResponse,
} from "@/types/questionset";

const toQuestionSetQuestion = (question: string | QuestionSetQuestionApi) => {
  if (typeof question === "string") {
    return {
      id: question,
      question_text: "",
    };
  }

  return {
    id: question.id,
    question_text: question.question_text ?? "",
  };
};

const toQuestionSet = (set: QuestionSetApi): QuestionSet => {
  const questions = Array.isArray(set.questions)
    ? set.questions.filter(Boolean).map((question) => toQuestionSetQuestion(question))
    : [];

  return {
    id: set.id,
    name: set.name,
    description: set.description ?? "",
    questions,
  };
};

const toSelectableQuestion = (question: SelectableQuestionApi): SelectableQuestion => ({
  id: question.id,
  question_text: question.question_text ?? question.description ?? "",
  status: question.status,
});

export const fetchQuestionSets = async (): Promise<QuestionSetListResponse> => {
  try {
    const allSets: QuestionSet[] = [];
    let nextUrl: string | null = API_ENDPOINTS.questionSets;

    while (nextUrl) {
      const response: { data: PaginatedQuestionSetApiResponse } =
        await axiosInstance.get<PaginatedQuestionSetApiResponse>(nextUrl);
      const currentSets = response.data.results.map((set: QuestionSetApi) => toQuestionSet(set));
      allSets.push(...currentSets);
      nextUrl = response.data.next;
    }

    const uniqueSets = Array.from(new Map(allSets.map((set) => [set.id, set])).values());

    return {
      sets: uniqueSets,
    };
  } catch (error) {
    console.error("Failed to fetch question sets:", error);
    throw new Error("Failed to fetch question sets");
  }
};

export const createQuestionSet = async (payload: QuestionSetPayload): Promise<QuestionSet> => {
  try {
    const response = await axiosInstance.post<QuestionSetApi>(API_ENDPOINTS.questionSets, payload);
    return toQuestionSet(response.data);
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
    const response = await axiosInstance.put<QuestionSetApi>(
      `${API_ENDPOINTS.questionSets}${id}/`,
      payload
    );
    return toQuestionSet(response.data);
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

    const response = await axiosInstance.get<PaginatedSelectableQuestionApiResponse>(
      API_ENDPOINTS.adminQuestions,
      { params }
    );
    const results = response.data.results
      .map((question) => toSelectableQuestion(question))
      .filter((question) => Boolean(question.id && question.question_text));

    return {
      count: response.data.count,
      total_pages: response.data.total_pages,
      next: response.data.next,
      previous: response.data.previous,
      results,
    };
  } catch (error) {
    console.error("Failed to fetch selectable questions:", error);
    throw new Error("Failed to fetch questions");
  }
};

export const fetchQuestionSetSession = async (
  setId: string,
  pageSize = 500
): Promise<PaginatedQuestionsResponse> => {
  try {
    const response = await axiosInstance.get<PaginatedQuestionsResponse>(
      `${API_ENDPOINTS.questionSets}${setId}/`,
      {
        params: {
          page_size: pageSize,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch question set session:", error);
    throw new Error("Failed to fetch question set session");
  }
};
