// app/login/page.tsx (또는 사용하는 경로 그대로)
// 디자인만 변경 — 로그인 로직/함수 시그니처는 절대 수정 안 함
"use client";

import { logIn } from "@/api/auth";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { checking, isLoggedIn } = useAuthGuard({ mode: "gotoHome" });

  const router = useRouter();
  const [form, setForm] = useState({ id: "", password: "" });
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (checking || isLoggedIn) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      await logIn(form.id, form.password); // ← 로직 그대로 유지
      router.push("/home");
    } catch (err) {
      console.error("로그인 에러:", err);
      setErrorMsg("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className="min-h-[calc(100dvh-4rem)] bg-gray-50 text-gray-900 flex items-center justify-center px-4 py-10"
      // 헤더가 h-16(4rem)이므로 그만큼 뺀 높이
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <main className="w-full max-w-md">
        <div className="rounded-3xl bg-white/80 backdrop-blur border border-gray-100 shadow-xl px-8 py-10">
          {/* 브랜드 영역 */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">
              OceanCampus
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              OceanCampus 관리자 페이지 입니다
            </p>
          </div>

          {/* 에러 메시지 */}
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* 로그인 폼 */}
          <form
            onSubmit={handleSubmit}
            method="post"
            action="#"
            noValidate
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">
                이메일
              </label>
              <input
                name="id"
                type="text"
                value={form.id}
                onChange={handleChange}
                placeholder="get@ziontutorial.com"
                autoComplete="username"
                className="h-12 w-full rounded-xl border-0 ring-1 ring-gray-200 bg-white px-4 text-[15px]
                           placeholder:text-gray-400 focus:ring-2 focus:ring-[#34609E] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border-0 ring-1 ring-gray-200 bg-white px-4 text-[15px]
                           placeholder:text-gray-400 focus:ring-2 focus:ring-[#34609E] focus:outline-none"
              />
            </div>

            {/* 구분선 */}
            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="mx-3 whitespace-nowrap text-sm text-gray-500">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* 소셜 로그인 (Google만) */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="구글로 로그인"
                title="Google"
                className="flex h-14 w-24 items-center justify-center rounded-xl border border-gray-200 bg-gray-50
                           hover:bg-gray-100 active:translate-y-[1px] transition"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  width={28}
                  height={28}
                  alt="Google"
                  priority
                />
              </button>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              className="mt-8 h-12 w-full rounded-xl bg-[#3263F1] text-white text-[15px] font-semibold
                         shadow-md hover:brightness-105 active:translate-y-[1px] transition"
            >
              Log in
            </button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/register")}
              className="text-[13px] font-medium text-gray-700 underline underline-offset-4 hover:text-gray-900"
            >
              회원가입
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
