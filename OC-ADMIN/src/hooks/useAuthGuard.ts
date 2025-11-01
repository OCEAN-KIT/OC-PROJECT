// src/hooks/useAuthGuard.ts
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

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

  // 1) 로그인 상태 확인
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await axiosInstance.get("/api/user/my/info", { withCredentials: true });
        if (alive) setIsLoggedIn(true);
      } catch {
        if (alive) setIsLoggedIn(false);
      } finally {
        if (alive) setChecking(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 2) 모드별 리다이렉트
  useEffect(() => {
    if (checking) return;

    if (mode === "gotoLogin" && !isLoggedIn) {
      // 이미 로그인 페이지면 중복 이동 방지
      if (pathname?.startsWith(loginPath)) return;
      const url =
        includeNext && pathname
          ? `${loginPath}?next=${encodeURIComponent(pathname)}`
          : loginPath;
      router.replace(url);
      return;
    }

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
