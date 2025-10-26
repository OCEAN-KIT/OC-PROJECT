// app/dashBoard/@modal/(..)detailInfo/[id]/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DetailInfoModal({ params }) {
  const router = useRouter();
  const id = params?.id;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Dim */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={() => router.back()}
      />

      {/* Card (여기 className 한 줄로!) */}
      <div className="relative z-10 w-[880px] max-w-[92vw] rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-xl shadow-2xl animate-popIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <h2 className="text-lg font-semibold">
            작업 영역 상세 {id ? `— ${id}` : ""}
          </h2>
          <button
            onClick={() => router.back()}
            className="rounded-md px-3 py-1.5 text-sm bg-white/10 hover:bg-white/15"
          >
            닫기
          </button>
        </div>

        <div className="h-px w-full bg-white/10" />

        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="text-white/80">
            인터셉트 라우팅으로 뜬 모달입니다. 그래프/사진/지표 등을 넣어주세요.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              섹션 A
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              섹션 B
            </div>
          </div>
        </div>
      </div>

      {/* 애니메이션 */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.18s ease-out;
        }
        .animate-popIn {
          animation: popIn 0.18s ease-out;
        }
      `}</style>
    </div>
  );
}
