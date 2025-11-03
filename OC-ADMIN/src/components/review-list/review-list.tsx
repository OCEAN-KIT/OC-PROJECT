// components/review-list.tsx
"use client";

import { REVIEW_ITEMS } from "@/data/reviews";
import ReviewCard from "./review-card";
import { REVIEW_GRID } from "./review-grid";

export default function ReviewList() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-white px-5 py-3 ring-1 ring-black/5">
        <div className={`${REVIEW_GRID} text-gray-500`}>
          <div className="pl-1">ID</div>
          <div>현장명</div>
          <div>제출일</div>
          <div>활동유형</div>
          <div>작성자</div>
          <div>첨부</div>
          <div>상태</div>
          <div>{/* 액션 자리 맞춤용(헤더는 비워둠) */}</div>
        </div>
      </div>

      <div className="space-y-3">
        {REVIEW_ITEMS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
