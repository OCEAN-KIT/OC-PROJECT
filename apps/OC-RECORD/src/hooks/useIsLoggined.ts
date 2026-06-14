import { useEffect, useState } from "react";

const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";

const getIsLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export function useIsLoggined() {
  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn);

  useEffect(() => {
    const updateIsLoggedIn = () => setIsLoggedIn(getIsLoggedIn());

    updateIsLoggedIn();

    window.addEventListener("storage", updateIsLoggedIn);
    window.addEventListener("focus", updateIsLoggedIn);
    document.addEventListener("visibilitychange", updateIsLoggedIn);

    return () => {
      window.removeEventListener("storage", updateIsLoggedIn);
      window.removeEventListener("focus", updateIsLoggedIn);
      document.removeEventListener("visibilitychange", updateIsLoggedIn);
    };
  }, []);

  return isLoggedIn;
}
