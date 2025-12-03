// api/auth.ts
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

// api/auth.ts
export async function logIn(username: string, password: string) {
  try {
    const res = await axiosInstance.post("/api/auth/login", {
      username,
      password,
    });

    const access = res.data?.data?.access;
    if (access) {
      localStorage.setItem("ACCESS_TOKEN", access);
    }

    return res; // 성공 시 응답 반환
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error("일치하지 않는 ID입니다.");
      }
    }
    throw new Error("로그인 중 오류가 발생했습니다.");
  }
}

export async function logOut() {
  try {
    await axiosInstance.post("/api/auth/logout", {});
  } catch (e) {
    console.error("[logout] api error", e);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  }
}

export async function signUp1(username: string, password: string) {
  const res = await axiosInstance.post("/api/auth/sign-up", {
    username,
    password,
  });
  return res.data;
}

export async function signUp2(username: string, password: string) {
  const res = await axiosInstance.post("/api/auth/login", {
    username,
    password,
  });
  return res.data;
}

export async function signUp3(nickname: string, email: string, phone: string) {
  const res = await axiosInstance.post("/api/auth/complete-sign-up/user", {
    nickname,
    email,
    phone,
  });
  return res.data;
}
