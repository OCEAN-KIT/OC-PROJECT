import axiosInstance from "@ocean-kit/shared-api/axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
} from "@ocean-kit/shared-types/auth";
import { getAuthErrorMessage } from "./errors";

const LOGIN_ERROR_MESSAGES = {
  400: "아이디 또는 비밀번호를 확인해 주세요.",
  401: "비밀번호가 올바르지 않습니다.",
  404: "일치하지 않는 ID입니다.",
};

export async function requestLogin(
  username: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const payload: LoginRequest = { username, password };
    const { data } = await axiosInstance.post<LoginResponse>(
      "/api/auth/login",
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(
      getAuthErrorMessage(error, "로그인 중 오류가 발생했습니다.", LOGIN_ERROR_MESSAGES),
    );
  }
}
