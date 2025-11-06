"use client";

import { REVIEW_ITEMS } from "@/data/reviews";
import ReviewCard from "./review-card";
import { REVIEW_GRID } from "./review-grid";

type Props = {
  selected: Set<string>;
  onToggleOne: (id: string) => void;
};

export default function ReviewList({ selected, onToggleOne }: Props) {
  return (
    <div className="space-y-3">
      {/* 헤더 (체크박스/액션 제거, 깔끔하게) */}
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
        {REVIEW_ITEMS.map((review) => {
          const id = String(review.id);
          return (
            <ReviewCard
              key={id}
              review={review}
              selected={selected.has(id)}
              onToggle={() => onToggleOne(id)}
            />
          );
        })}
      </div>
    </div>
  );
}
