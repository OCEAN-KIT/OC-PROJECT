// src/hooks/useAuthGuard.ts
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Mode = "gotoLogin" | "gotoHome";

type Options = {
  /** 보호 페이지면 "gotoLogin", 게스트 전용 페이지면 "gotoHome" */
  mode: Mode;
  /** 로그인 페이지 경로 (gotoLogin에서 사용). 기본값 "/login" */
  loginPath?: string;
  /** 홈 경로 (gotoHome에서 사용). 기본값 "/home" */
  homePath?: string;
  /** gotoLogin일 때 현재 경로를 ?next=로 붙일지. 기본값 true */
  includeNext?: boolean;
};

// ✅ 실제로 사용하는 토큰 키 이름으로 맞춰줄 것!
const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";

export function useAuthGuard({
  mode,
  loginPath = "/login",
  homePath = "/home",
  includeNext = true,
}: Options) {
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 1) "로컬스토리지에 access 토큰이 있냐"만 보고 로그인 여부 판단
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    setIsLoggedIn(!!token);
    setChecking(false);
  }, []);

  // 2) 모드별 리다이렉트
  useEffect(() => {
    if (checking) return;

    // 보호 페이지인데 로그인 안 되어 있으면 → 로그인 페이지로
    if (mode === "gotoLogin" && !isLoggedIn) {
      if (pathname?.startsWith(loginPath)) return; // 이미 로그인 페이지면 패스

      const url =
        includeNext && pathname
          ? `${loginPath}?next=${encodeURIComponent(pathname)}`
          : loginPath;

      router.replace(url);
      return;
    }

    // 비회원 전용 페이지인데 이미 로그인 되어 있으면 → 홈으로
    if (mode === "gotoHome" && isLoggedIn) {
      if (pathname === homePath) return;
      router.replace(homePath);
    }
  }, [
    checking,
    isLoggedIn,
    mode,
    loginPath,
    homePath,
    includeNext,
    pathname,
    router,
  ]);

  return { checking, isLoggedIn };
}
