"use client";

import { useState } from "react";
import { registerSchema, RegisterFormData } from "@/lib/validation/register";
import { signUp1, signUp2, signUp3 } from "@/api/auth";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterFormData>({
    id: "",
    password: "",
    email: "",
    phone: "",
    nickname: "",
  });

  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      registerSchema.parse(form);
      setErrorMsg("");

      await signUp1(form.id, form.password);

      const res2 = await signUp2(form.id, form.password);
      const token = res2.data.access;
      console.log(token);

      await signUp3(form.nickname, form.email, form.phone);

      router.push("/home");
    } catch (err: unknown) {
      console.error("회원가입 에러:", err);

      const axiosErr = err as AxiosError;

      if (axiosErr.response?.status === 409) {
        setErrorMsg("이미 사용 중인 아이디입니다.");
      } else if (
        err &&
        typeof err === "object" &&
        "errors" in (err as Record<string, unknown>)
      ) {
        const zodErr = err as { errors: { message: string }[] };
        setErrorMsg(zodErr.errors[0].message);
      } else {
        setErrorMsg("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div
      className="
        mx-auto min-h-screen max-w-[420px]
        bg-[#F6F7F9]
        text-gray-900
        flex flex-col
      "
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-[#F6F7F9]/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
        <div className="px-5 pt-4 pb-3">
          <h1 className="text-center text-[22px] font-extrabold tracking-tight">
            회원가입
          </h1>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-5 pb-28 pt-2">
        {errorMsg && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="space-y-5">
          {/* 아이디 */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-gray-700">
              아이디
            </label>
            <input
              name="id"
              type="text"
              value={form.id}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              className="
                h-12 w-full rounded-2xl
                border-0 ring-1 ring-gray-200
                bg-white px-4 text-[15px]
                placeholder:text-gray-400
                focus:ring-2 focus:ring-blue-500 focus:outline-none
              "
            />
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-gray-700">
              비밀번호
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              className="
                h-12 w-full rounded-2xl
                border-0 ring-1 ring-gray-200
                bg-white px-4 text-[15px]
                placeholder:text-gray-400
                focus:ring-2 focus:ring-blue-500 focus:outline-none
              "
            />
          </div>

          {/* 이메일 */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-gray-700">
              이메일
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              className="
                h-12 w-full rounded-2xl
                border-0 ring-1 ring-gray-200
                bg-white px-4 text-[15px]
                placeholder:text-gray-400
                focus:ring-2 focus:ring-blue-500 focus:outline-none
              "
            />
          </div>

          {/* 전화번호 */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-gray-700">
              전화번호
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="전화번호를 입력하세요"
              className="
                h-12 w-full rounded-2xl
                border-0 ring-1 ring-gray-200
                bg-white px-4 text-[15px]
                placeholder:text-gray-400
                focus:ring-2 focus:ring-blue-500 focus:outline-none
              "
            />
          </div>

          {/* 닉네임 */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-gray-700">
              닉네임
            </label>
            <input
              name="nickname"
              type="text"
              value={form.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              className="
                h-12 w-full rounded-2xl
                border-0 ring-1 ring-gray-200
                bg-white px-4 text-[15px]
                placeholder:text-gray-400
                focus:ring-2 focus:ring-blue-500 focus:outline-none
              "
            />
          </div>
        </div>

        {/* Home Indicator spacer */}
        <div className="h-16" />
        {/* sticky CTA inside the form (so submit works) */}
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20">
          <div className="mx-auto w-full max-w-[420px] px-5 pb-4">
            <div className="pointer-events-auto rounded-2xl bg-white/80 p-2 backdrop-blur">
              <button
                type="submit"
                className="
                  w-full h-12 rounded-xl
                  bg-[#3B82F6]
                  text-white text-[15px] font-semibold
                  shadow-md active:translate-y-[1px]
                  transition
                "
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
