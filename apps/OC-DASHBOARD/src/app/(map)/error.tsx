"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MapRouteError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[MapView] route error:", error);
  }, [error]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--ds-bg)] px-4 text-slate-50">
      <div className="oc-panel max-w-md rounded-2xl px-5 py-4 text-center">
        <h2 className="text-base font-semibold">지도 데이터를 불러오지 못했습니다</h2>
        <p className="mt-2 text-sm leading-relaxed text-indigo-100/72">
          잠시 후 다시 시도하거나 API 설정을 확인해 주세요.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-50 transition hover:border-indigo-300/60 hover:bg-indigo-500/20"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
