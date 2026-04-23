import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import type {
  CompleteSignUpRequest,
  CompleteSignUpResponse,
  SignUpRequest,
  SignUpResponse,
} from "@ocean-kit/shared-types/auth";
import { getAuthErrorMessage } from "./errors";

const SIGN_UP_ERROR_MESSAGES = {
  400: "회원가입 정보를 확인해 주세요.",
  409: "이미 사용 중인 아이디입니다.",
};

const COMPLETE_SIGN_UP_ERROR_MESSAGES = {
  400: "회원가입 정보를 확인해 주세요.",
};

export async function requestSignUp(
  username: string,
  password: string,
): Promise<SignUpResponse> {
  try {
    const payload: SignUpRequest = { username, password };
    const { data } = await axiosInstance.post<SignUpResponse>(
      "/api/auth/sign-up",
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(
      getAuthErrorMessage(
        error,
        "회원가입 중 오류가 발생했습니다.",
        SIGN_UP_ERROR_MESSAGES,
      ),
    );
  }
}

export async function completeSignUp(
  nickname: string,
  email: string,
  phone: string,
): Promise<CompleteSignUpResponse> {
  try {
    const payload: CompleteSignUpRequest = { nickname, email, phone };
    const { data } = await axiosInstance.post<CompleteSignUpResponse>(
      "/api/auth/complete-sign-up/user",
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(
      getAuthErrorMessage(
        error,
        "회원가입 정보 저장 중 오류가 발생했습니다.",
        COMPLETE_SIGN_UP_ERROR_MESSAGES,
      ),
    );
  }
}
