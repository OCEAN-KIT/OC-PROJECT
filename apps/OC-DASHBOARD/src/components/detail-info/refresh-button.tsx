"use client";

import { RefreshCw } from "lucide-react";

type Props = {
  isRefreshing?: boolean;
  onRefresh: () => void;
};

export default function RefreshButton({
  isRefreshing = false,
  onRefresh,
}: Props) {
  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={isRefreshing}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-slate-50 transition hover:bg-indigo-500/22 disabled:cursor-wait disabled:opacity-60"
      aria-label="최신 데이터 새로고침"
      title="최신 데이터 새로고침"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
    </button>
  );
}
