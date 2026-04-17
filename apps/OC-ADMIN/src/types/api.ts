// src/types/api.ts
export type MyInfo = {
  id: string;
  nickname: string | null;
  email: string | null;
  phone: string | null;
};

export type ApiResp<T> = {
  success: boolean;
  data: T;
  code?: string;
  message?: string | Record<string, unknown>;
};
