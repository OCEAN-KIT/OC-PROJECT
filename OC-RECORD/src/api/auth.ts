// api/auth.ts
import axiosInstance from "@/utils/axiosInstance";

export async function logIn(username: string, password: string) {
  const res = await axiosInstance.post("/api/auth/login", {
    username,
    password,
  });
  return res;
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
