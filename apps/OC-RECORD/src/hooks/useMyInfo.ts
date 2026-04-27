// src/hooks/useMyInfo.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { myInfo } from "@ocean-kit/shared-auth/user";
import axiosInstance from "@/utils/axiosInstance";

export function useMyInfo() {
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: () => myInfo(axiosInstance),
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: "always",
    staleTime: 0,
  });
}
