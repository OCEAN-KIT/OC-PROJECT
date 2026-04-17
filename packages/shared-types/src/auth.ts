import type { ApiResponse } from "./api";

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginData = {
  access?: string;
  refresh?: string;
};

export type LoginResponse = ApiResponse<LoginData>;

export type SignUpRequest = LoginRequest;

export type CompleteSignUpRequest = {
  nickname: string;
  email: string;
  phone: string;
};

export type AuthMutationData = Record<string, unknown> | null;

export type SignUpResponse = ApiResponse<AuthMutationData>;
export type CompleteSignUpResponse = ApiResponse<AuthMutationData>;
export type LogoutResponse = ApiResponse<AuthMutationData>;
