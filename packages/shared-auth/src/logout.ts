import axiosInstance from "@ocean-kit/shared-api/axiosInstance";
import type { LogoutResponse } from "@ocean-kit/shared-types/auth";
import { getAuthErrorMessage } from "./errors";

const LOGOUT_ERROR_MESSAGES = {
  401: "로그인 상태를 확인해 주세요.",
};

export async function requestLogout(): Promise<LogoutResponse> {
  try {
    const { data } = await axiosInstance.post<LogoutResponse>("/api/auth/logout");
    return data;
  } catch (error) {
    throw new Error(
      getAuthErrorMessage(
        error,
        "로그아웃 중 오류가 발생했습니다.",
        LOGOUT_ERROR_MESSAGES,
      ),
    );
  }
}
