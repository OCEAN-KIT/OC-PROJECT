// components/review-card.tsx
"use client";

import type { ReviewItem } from "@/data/reviews";
import { CalendarClock, MapPin, User2, Paperclip, Trash2 } from "lucide-react";
import { REVIEW_GRID } from "./review-grid";
import { useRouter } from "next/navigation";

type Props = {
  review: ReviewItem;
  selected?: boolean;
  onToggle?: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function ReviewCard({
  review,
  selected = false,
  onToggle,
  onApprove,
  onReject,
  onDelete,
}: Props) {
  const router = useRouter();
  const goDetail = () => router.push(`/review/${review.id}`);

  const stopBubble = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

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

  // ✅ 상태 칩: approved / pending / rejected
  const statusChip =
    review.status === "approved"
      ? {
          text: "승인",
          cls: "bg-emerald-100 text-emerald-700 ring-emerald-200",
        }
      : review.status === "rejected"
      ? { text: "반려", cls: "bg-rose-100 text-rose-700 ring-rose-200" } // ✅ 반려 색상
      : { text: "검수대기", cls: "bg-gray-100 text-gray-700 ring-gray-200" };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") goDetail();
      }}
      className={[
        "group rounded-2xl bg-white px-5 py-4 cursor-pointer transition",
      ].join(" ")}
    >
      <div className={`${REVIEW_GRID} items-center`}>
        {/* 1. ID + 체크박스 */}
        <div className="pl-1 flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onClick={stopBubble}
            onMouseDown={stopBubble}
            onChange={() => onToggle?.()}
            aria-label={`${review.id} 선택`}
            className="h-4 w-4 accent-blue-600"
          />
          <span className="font-semibold text-gray-900">#{review.id}</span>
        </div>

        {/* 2. 현장명 */}
        <div className="min-w-0 flex items-center gap-1.5 text-gray-700">
          <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
          <span className="truncate">{review.site}</span>
        </div>

        {/* 3. 제출일 */}
        <div className="flex items-center gap-1.5 text-gray-500">
          <CalendarClock className="h-4 w-4 text-gray-400" />
          <time>{dateStr}</time>
        </div>

        {/* 4. 활동유형 */}
        <div className="font-medium text-gray-700">{review.task}</div>

        {/* 5. 작성자 */}
        <div className="flex items-center gap-1.5 text-gray-700">
          <User2 className="h-4 w-4 text-gray-400" />
          <span>{review.author}</span>
        </div>

        {/* 6. 첨부 */}
        <div className="flex items-center gap-1.5 text-gray-600">
          <Paperclip className="h-4 w-4 text-gray-400" />
          <span>{review.fileCount}개 파일</span>
        </div>

        {/* 7. 상태 */}
        <div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusChip.cls}`}
          >
            {statusChip.text}
          </span>
        </div>

        {/* 8. 액션 */}
        <div className="ml-2 flex items-center gap-2">
          {/* ✅ 승인/반려 버튼은 '검수대기(pending)'일 때만 노출 */}
          {review.status === "pending" && (
            <>
              <button
                type="button"
                aria-label="반려"
                onMouseDown={stopBubble}
                onClick={(e) => {
                  stopBubble(e);
                  onReject?.(String(review.id));
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5
                           text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px]"
              >
                반려
              </button>
              <button
                type="button"
                aria-label="승인"
                onMouseDown={stopBubble}
                onClick={(e) => {
                  stopBubble(e);
                  onApprove?.(String(review.id));
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5
                           text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px]"
              >
                승인
              </button>
            </>
          )}

          {/* 삭제 버튼은 동일 유지 */}
          <button
            type="button"
            aria-label="삭제"
            onMouseDown={stopBubble}
            onClick={(e) => {
              stopBubble(e);
              onDelete?.(String(review.id));
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full
                       bg-rose-500 text-white shadow-sm opacity-0 -translate-x-1
                       transition-all duration-200 ease-out
                       group-hover:opacity-100 group-hover:translate-x-0
                       group-focus-within:opacity-100 group-focus-within:translate-x-0
                       focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
