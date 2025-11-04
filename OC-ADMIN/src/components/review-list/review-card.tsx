// components/review-card.tsx
import type { ReviewItem } from "@/data/reviews";
import { CalendarClock, MapPin, User2, Paperclip, Trash2 } from "lucide-react";
import { REVIEW_GRID } from "./review-grid";
import Link from "next/link";

type Props = { review: ReviewItem };

export default function ReviewCard({ review }: Props) {
  const dt = new Date(review.datetime);
  const dateStr = [
    dt.getFullYear(),
    "-",
    String(dt.getMonth() + 1).padStart(2, "0"),
    "-",
    String(dt.getDate()).padStart(2, "0"),
    " ",
    String(dt.getHours()).padStart(2, "0"),
    ":",
    String(dt.getMinutes()).padStart(2, "0"),
  ].join("");

  const statusChip =
    review.status === "approved"
      ? {
          text: "승인",
          cls: "bg-emerald-100 text-emerald-700 ring-emerald-200",
        }
      : { text: "검수대기", cls: "bg-gray-100 text-gray-700 ring-gray-200" };

  return (
    <Link href={`/review/${review.id}`}>
      <div className="group rounded-2xl bg-white px-5 py-4 cursor-pointer">
        <div className={REVIEW_GRID}>
          {/* ID */}
          <div className="font-semibold text-gray-900">#{review.id}</div>

          {/* 현장명 */}
          <div className="min-w-0 flex items-center gap-1.5 text-gray-700">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="truncate">{review.site}</span>
          </div>

          {/* 제출일 */}
          <div className="flex items-center gap-1.5 text-gray-500">
            <CalendarClock className="h-4 w-4 text-gray-400" />
            <time>{dateStr}</time>
          </div>

          {/* 활동유형 */}
          <div className="font-medium text-gray-700">{review.task}</div>

          {/* 작성자 */}
          <div className="flex items-center gap-1.5 text-gray-700">
            <User2 className="h-4 w-4 text-gray-400" />
            <span>{review.author}</span>
          </div>

          {/* 첨부 */}
          <div className="flex items-center gap-1.5 text-gray-600">
            <Paperclip className="h-4 w-4 text-gray-400" />
            <span>{review.fileCount}개 파일</span>
          </div>

          {/* 상태 */}
          <div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusChip.cls}`}
            >
              {statusChip.text}
            </span>
          </div>

          {/* 액션 (그리드 마지막 컬럼) */}
          <div className="ml-2 flex items-center gap-2">
            {/* 반려: 승인된 항목에선 숨김 */}
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

            {/* 승인: 승인된 항목에선 숨김 */}
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

            {/* 휴지통: 옆에서 살짝 슬라이드 인 */}
            <button
              type="button"
              aria-label="삭제"
              className="
                  inline-flex h-8 w-8 items-center justify-center rounded-full
                  bg-rose-500 text-white shadow-sm
                  opacity-0 -translate-x-1
                  transition-all duration-200 ease-out
                  group-hover:opacity-100 group-hover:translate-x-0
                  group-focus-within:opacity-100 group-focus-within:translate-x-0
                  focus:outline-none focus:ring-2 focus:ring-rose-300
                "
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
