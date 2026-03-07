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
