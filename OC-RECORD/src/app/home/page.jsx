// app/page.jsx
"use client";

import { logOut } from "@/api/auth";
import MainHeader from "@/components/mian-header";
import MainButton from "@/components/ui/main-button";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { checking, isLoggedIn } = useAuthGuard({ mode: "gotoLogin" });

  const [loading, setLoading] = useState(false);

  async function handleLogOut() {
    setLoading(true);
    await logOut();
    setLoading(false);
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto min-h-screen w-[380px] flex flex-col justify-center">
        {/* 상단: 헤더 + 서브타이틀 */}
        <div className="text-center">
          <MainHeader />
          <p className="mt-2 mb-5 text-[13px] text-gray-500">
            바다 활동을 기록하고 제출물을 한 곳에서 관리하세요
          </p>
        </div>

        <div className="my-5 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

        {/* 메인 카드 */}
        <div className="rounded-2xl bg-white">
          <div className="p-4 flex flex-col gap-3">
            <MainButton
              size="lg"
              onClick={() => router.push("/submit-management")}
            >
              제출물 관리
            </MainButton>

            <MainButton size="lg" onClick={() => router.push("/dive-create")}>
              활동 생성
            </MainButton>

            <MainButton size="lg" onClick={() => router.push("/dive-drafts")}>
              임시 저장 불러오기
            </MainButton>
          </div>
        </div>

        <button
          className="mt-8 mx-auto block text-[14px] font-medium text-gray-700 cursor-pointer"
          onClick={handleLogOut}
          type="button"
        >
          {loading ? "로그아웃 중..." : "로그아웃"}
          <span className="inline-block translate-y-1px cursor-pointer">›</span>
        </button>
      </div>
    </div>
  );
}
