// components/MainHeader.tsx
"use client";

import { useMyInfo } from "@/hooks/useMyInfo";
import { UserRound } from "lucide-react";

export default function MainHeader() {
  const { data, isLoading } = useMyInfo();

  const label = isLoading
    ? "로그인"
    : data
    ? data.data.nickname ?? "내 계정"
    : "로그인";

  return (
    <header className="w-full bg-[#2C67BC] text-white">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4">
        <div className="text-3xl font-extrabold tracking-tight">
          OceanCampus
        </div>

        <div
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5
                     hover:bg-white/20 active:translate-y-[1px]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          aria-label={label}
        >
          <UserRound className="h-5 w-5" aria-hidden />
          <span className="hidden sm:inline text-sm">{label}</span>
        </div>
      </div>
    </header>
  );
}
