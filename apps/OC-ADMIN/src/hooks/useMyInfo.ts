// src/hooks/useMyInfo.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { myInfo } from "@ocean-kit/shared-auth/user";
import { queryKeys } from "@/hooks/queryKeys";
import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";

export function useMyInfo() {
  return useQuery({
    queryKey: queryKeys.myInfo,
    queryFn: () => myInfo(axiosInstance),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
