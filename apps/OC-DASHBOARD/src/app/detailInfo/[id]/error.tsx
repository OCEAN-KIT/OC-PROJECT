"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DetailInfoRouteError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[DetailInfo] route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-transparent text-white flex items-center justify-center px-4">
      <div className="rounded-xl px-6 py-5 text-center oc-detail-shell">
        <h2 className="text-base font-semibold">
          데이터를 불러오지 못했습니다
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-indigo-100/72">
          잠시 후 다시 시도하거나 API 설정을 확인해 주세요.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm hover:bg-indigo-500/20"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm hover:bg-indigo-500/20"
          >
            지도 보기로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
