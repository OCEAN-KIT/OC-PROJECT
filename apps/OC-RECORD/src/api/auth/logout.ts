import { requestLogout } from "@ocean-kit/shared-auth/logout";

const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";

export async function logOut() {
  const data = await requestLogout();

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  return data;
}
