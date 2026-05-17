"use client";

/*
 * 리뷰 목록의 표 형태 UI를 렌더링합니다.
 * 목록 헤더와 ReviewCard 반복 렌더링만 담당하며,
 * loading/empty/error 같은 목록 영역 상태는 상위 SubmissionListSection이 담당합니다.
 */
import ReviewCard from "../review-card/ReviewCard";
import { REVIEW_GRID } from "../review-grid";
import type { Submission } from "../../api/submissions";

type Props = {
  items: Submission[];
  selected?: Set<string>;
  onToggleOne: (id: string) => void;
  onApproveOne: (id: string) => void;
  onRejectOne: (id: string) => void;
  onDeleteOne: (id: string) => void;
};

export default function ReviewList({
  items,
  selected = new Set(),
  onToggleOne,
  onApproveOne,
  onRejectOne,
  onDeleteOne,
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

    </div>
  );
}
