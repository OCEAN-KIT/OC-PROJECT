import { requestLogin } from "@ocean-kit/shared-auth/login";

const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";

export async function logIn(username: string, password: string) {
  const data = await requestLogin(username, password);
  const accessToken = data.data?.access;

  if (accessToken && typeof window !== "undefined") {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  return data;
}
