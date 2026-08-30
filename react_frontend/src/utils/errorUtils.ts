import axios from "axios";

export const getAlreadyExistsErrors = (data: Record<string, unknown>): string[] => {
  const messages: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (
      Array.isArray(value) &&
      value.some((msg: unknown) => typeof msg === "string" && msg.includes("already exists"))
    ) {
      messages.push(`User with this ${key} already exists.`);
    }
  }
  return messages;
};

export const extractBackendErrorMessages = (data: Record<string, unknown>): string[] => {
  const messages: string[] = [];
  for (const [, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      value.forEach((msg: unknown) => {
        if (typeof msg === "string") messages.push(msg);
      });
    } else if (typeof value === "string") {
      messages.push(value);
    }
  }
  return messages;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data;
  if (!data || typeof data !== "object") return fallback;

  const record = data as Record<string, unknown>;
  if (typeof record.detail === "string") return record.detail;
  if (Array.isArray(record.detail)) {
    const detailMessages = record.detail.filter((item): item is string => typeof item === "string");
    if (detailMessages.length) return detailMessages.join(" ");
  }

  const fieldMessages = extractBackendErrorMessages(record);
  return fieldMessages.length ? fieldMessages.join(" ") : fallback;
};
