import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { PaginatedNotesResponse, QuestionNote, NotePayload } from "@/types/note";

export const listQuestionNotes = async (
  questionId: string
): Promise<PaginatedNotesResponse | null> => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.notes}${questionId}/`);
    if (!response) return null;
    return response.data as PaginatedNotesResponse;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return null;
  }
};

export const getQuestionNote = async (
  questionId: string,
  noteId: string
): Promise<QuestionNote | null> => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.notes}${questionId}/${noteId}/`);
    if (!response) return null;
    return response.data as QuestionNote;
  } catch (error) {
    console.error("Error fetching note:", error);
    return null;
  }
};

export const createQuestionNote = async (
  questionId: string,
  payload: NotePayload
): Promise<QuestionNote | null> => {
  try {
    const response = await axiosInstance.post(`${API_ENDPOINTS.notes}${questionId}/`, payload);
    if (!response) return null;
    return response.data as QuestionNote;
  } catch (error) {
    console.error("Error creating note:", error);
    return null;
  }
};

export const updateQuestionNote = async (
  questionId: string,
  noteId: string,
  payload: NotePayload
): Promise<QuestionNote | null> => {
  try {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.notes}${questionId}/${noteId}/`,
      payload
    );
    if (!response) return null;
    return response.data as QuestionNote;
  } catch (error) {
    console.error("Error updating note:", error);
    return null;
  }
};

export const patchQuestionNote = async (
  questionId: string,
  noteId: string,
  payload: Partial<NotePayload>
): Promise<QuestionNote | null> => {
  try {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.notes}${questionId}/${noteId}/`,
      payload
    );
    if (!response) return null;
    return response.data as QuestionNote;
  } catch (error) {
    console.error("Error patching note:", error);
    return null;
  }
};

export const deleteQuestionNote = async (questionId: string, noteId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.notes}${questionId}/${noteId}/`);
    return Boolean(response);
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
};
