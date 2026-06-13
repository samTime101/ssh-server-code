import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type {
  Attempt,
  FetchSubmissionHistoryPageOptions,
  GetSubmissionHistoryOptions,
  PaginatedSubmissionHistoryResult,
  SubmissionHistoryItem,
} from "@/types/history";
import {
  findAttemptInSubmissions,
  parsePaginatedSubmissionHistory,
  SUBMISSION_PAGE_SIZE,
} from "@/utils/historyUtils";

export const fetchSubmissionHistoryPage = async (
  page = 1,
  pageSize = SUBMISSION_PAGE_SIZE,
  options?: FetchSubmissionHistoryPageOptions
): Promise<PaginatedSubmissionHistoryResult> => {
  const params: Record<string, string | number> = { page, page_size: pageSize };
  if (options?.type) {
    params.type = options.type;
  }

  const response = await axiosInstance.get(API_ENDPOINTS.attemptQuestion, {
    params,
    signal: options?.signal,
  });

  const data = response.data;

  return parsePaginatedSubmissionHistory(data, page);
};

/** Fetches multiple pages when a full list is required (e.g. question bank resume). */
export const getSubmissionHistory = async (
  type?: string,
  options?: GetSubmissionHistoryOptions
): Promise<SubmissionHistoryItem[]> => {
  const pageSize = options?.pageSize ?? SUBMISSION_PAGE_SIZE;
  const maxPages = options?.maxPages ?? 5;
  const signal = options?.signal;

  const results: SubmissionHistoryItem[] = [];
  let page = 1;

  while (page <= maxPages) {
    const data = await fetchSubmissionHistoryPage(page, pageSize, { type, signal });
    results.push(...data.results);
    if (!data.next) {
      break;
    }
    page += 1;
  }

  return results;
};

/** Search recent submission pages for a prior attempt on a bookmarked question. */
export const findAttemptForQuestion = async (
  questionText: string,
  signal?: AbortSignal
): Promise<Attempt | null> => {
  const pageSize = SUBMISSION_PAGE_SIZE;
  const maxPages = 10;
  let page = 1;

  while (page <= maxPages) {
    const data = await fetchSubmissionHistoryPage(page, pageSize, { signal });
    const attempt = findAttemptInSubmissions(data.results, questionText);
    if (attempt) {
      return attempt;
    }
    if (!data.next) {
      break;
    }
    page += 1;
  }

  return null;
};
