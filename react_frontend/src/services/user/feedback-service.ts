import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export interface FeedbackPayload {
  email: string;
  feedback: string;
}

export type FeedbackSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

const validateFeedbackPayload = ({ email, feedback }: FeedbackPayload): FeedbackSubmitResult => {
  const trimmedEmail = email.trim();
  const trimmedFeedback = feedback.trim();

  if (!trimmedEmail) {
    return { ok: false, error: "Email is required." };
  }

  if (!emailRegex.test(trimmedEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (!trimmedFeedback) {
    return { ok: false, error: "Feedback is required." };
  }

  return { ok: true };
};

export const submitFeedbackForm = async (
  payload: FeedbackPayload
): Promise<FeedbackSubmitResult> => {
  const validation = validateFeedbackPayload(payload);
  if (!validation.ok) {
    return validation;
  }

  const trimmedPayload = {
    email: payload.email.trim(),
    feedback: payload.feedback.trim(),
  };

  try {
    await axios.post(`${API_BASE_URL}${API_ENDPOINTS.feedback}`, trimmedPayload);
    return { ok: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const firstError =
        responseData?.detail ||
        responseData?.email?.[0] ||
        responseData?.feedback?.[0];
      if (firstError) {
        return { ok: false, error: firstError };
      }
    }

    return { ok: false, error: "We could not submit your feedback. Please try again." };
  }
};
