"use client";

import { REVIEW_ITEMS, ReviewItem } from "@/data/reviews";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function TopBar({ diveId }: { diveId: string }) {
  const router = useRouter();

  const review = useMemo<ReviewItem | undefined>(
    () => REVIEW_ITEMS.find((r) => r.id === diveId),
    [diveId]
  );

  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-[#34609E] ring-1 ring-gray-200 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로
      </button>

      <div className="text-lg font-bold tracking-tight text-gray-900">
        Dive #{diveId}
      </div>

      <div>
        <div className="relative ml-4 flex justify-start gap-2">
          {review.status !== "approved" && (
            <button
              type="button"
              aria-label="반려"
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5
                         text-xs font-medium text-white shadow-sm
                         hover:brightness-105 active:translate-y-[1px]"
            >
              반려
            </button>
          )}

          {review.status !== "approved" && (
            <button
              type="button"
              aria-label="승인"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5
                         text-xs font-medium text-white shadow-sm
                         hover:brightness-105 active:translate-y-[1px]"
            >
              승인
            </button>
          )}
        </div>

        <div className="h-6 w-[84px]" />
      </div>
    </div>
  );
}
