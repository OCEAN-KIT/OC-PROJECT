// components/MainHeader.tsx
"use client";

import { UserRound } from "lucide-react";

export default function MainHeader() {
  return (
    <header className="w-full bg-[#34609E] text-white">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4">
        <div className="text-3xl font-extrabold tracking-tight">
          OceanCampus
        </div>

        <div
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5
                     hover:bg-white/20 active:bg-white/25
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <UserRound className="h-5 w-5" aria-hidden />
          <span className="hidden sm:inline text-sm">로그인</span>
        </div>
      </div>
    </header>
  );
}
