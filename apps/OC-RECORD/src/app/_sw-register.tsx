"use client";

import { useRegisterSW } from "virtual:pwa-register/react";

export default function SWRegister() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError: () => undefined,
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[120] mx-auto w-[min(92vw,24rem)] px-3">
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-blue-100 bg-white p-4 shadow-2xl shadow-blue-950/15"
      >
        <p className="text-sm font-semibold text-gray-900">
          새 버전이 준비됐습니다.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="h-10 flex-1 rounded-xl bg-[#2F80ED] px-4 text-sm font-semibold text-white transition hover:brightness-105"
            onClick={() => {
              void updateServiceWorker(true);
            }}
          >
            업데이트
          </button>
          <button
            type="button"
            className="h-10 rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            onClick={() => setNeedRefresh(false)}
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
}
