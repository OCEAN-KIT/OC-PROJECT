export type ApiMessage = string | Record<string, unknown>;

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  code?: string;
  message?: ApiMessage;
  errors?: Record<string, unknown>;
};
