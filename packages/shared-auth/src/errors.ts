import axios from "axios";

type ErrorMessagesByStatus = Record<number, string>;

function toApiMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;

  const message = (data as { message?: unknown }).message;
  return typeof message === "string" && message.trim() ? message : null;
}

export function getAuthErrorMessage(
  error: unknown,
  fallbackMessage: string,
  statusMessages: ErrorMessagesByStatus = {},
): string {
  if (!axios.isAxiosError(error)) {
    return fallbackMessage;
  }

  const apiMessage = toApiMessage(error.response?.data);
  if (apiMessage) return apiMessage;

  const status = error.response?.status;
  if (status && statusMessages[status]) {
    return statusMessages[status];
  }

  return fallbackMessage;
}
