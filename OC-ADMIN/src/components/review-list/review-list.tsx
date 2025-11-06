"use client";

import ReviewCard from "./review-card";
import { REVIEW_GRID } from "./review-grid";
import type { Submission } from "@/api/submissions";

type Props = {
  items: Submission[]; // ✅ 서버(쿼리)에서 내려온 리스트
  selected?: Set<string>;
  onToggleOne: (id: string) => void;
  onApproveOne: (id: string) => void;
  onRejectOne: (id: string) => void;
  onDeleteOne: (id: string) => void;
  loading?: boolean;
};

export default function ReviewList({
  items,
  selected = new Set(),
  onToggleOne,
  onApproveOne,
  onRejectOne,
  onDeleteOne,
  loading = false,
}: Props) {
  return (
    <div className="space-y-3 relative">
      {/* 헤더 */}
      <div className="rounded-2xl bg-white px-5 py-3 ring-1 ring-black/5">
        <div className={`${REVIEW_GRID} text-gray-500 items-center`}>
          <div className="pl-1">ID</div>
          <div>현장명</div>
          <div>제출일</div>
          <div>활동유형</div>
          <div>작성자</div>
          <div>첨부</div>
          <div>상태</div>
          <div>{/* 액션 자리 */}</div>
        </div>
      </div>

      {/* 리스트 */}
      <div className="space-y-3">
        {items.map((it) => (
          <ReviewCard
            key={it.id}
            review={it}
            selected={selected.has(String(it.id))}
            onToggle={() => onToggleOne(String(it.id))}
            onApprove={() => onApproveOne(String(it.id))}
            onReject={() => onRejectOne(String(it.id))}
            onDelete={() => onDeleteOne(String(it.id))}
          />
        ))}
      </div>

      {loading && (
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/40" />
      )}
    </div>
  );
}
