"use client";

/*
 * 제출 리뷰 카드 한 장을 조립하는 컴포넌트입니다.
 * 날짜/상태/활동 라벨 계산은 presentation helper에 위임하고,
 * 선택 셀, 상태 칩, 액션 버튼은 하위 컴포넌트로 분리해 카드 구조만 드러냅니다.
 */
import { memo, useCallback } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { CalendarClock, MapPin, Paperclip, User2 } from "lucide-react";
import type { Submission } from "../../api/submissions";
import { REVIEW_GRID } from "../review-grid";
import { ReviewCardActions } from "./components/ReviewCardActions";
import { ReviewCardSelectionCell } from "./components/ReviewCardSelectionCell";
import { ReviewCardStatusChip } from "./components/ReviewCardStatusChip";
import { useReviewCardNavigation } from "./hooks/useReviewCardNavigation";
import { isInteractiveCardTarget } from "./utils/reviewCardEvents";
import { getReviewCardPresentation } from "./utils/reviewCardPresentation";

type ReviewCardProps = {
  review: Submission;
  selected?: boolean;
  onToggle?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
};

function ReviewCard({
  review,
  selected = false,
  onToggle,
  onApprove,
  onReject,
  onDelete,
}: ReviewCardProps) {
  const openDetail = useReviewCardNavigation(review.id);
  const presentation = getReviewCardPresentation(review);

  const handleToggle = useCallback(() => {
    onToggle?.(review.id);
  }, [onToggle, review.id]);

  const handleApprove = useCallback(() => {
    onApprove?.(review.id);
  }, [onApprove, review.id]);

  const handleReject = useCallback(() => {
    onReject?.(review.id);
  }, [onReject, review.id]);

  const handleDelete = useCallback(() => {
    onDelete?.(review.id);
  }, [onDelete, review.id]);

  const handleCardClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isInteractiveCardTarget(event.target)) {
        return;
      }

      openDetail();
    },
    [openDetail],
  );

  const handleCardKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (isInteractiveCardTarget(event.target)) {
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openDetail();
    },
    [openDetail],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className="group cursor-pointer rounded-2xl bg-white px-5 py-4 transition"
    >
      <div className={`${REVIEW_GRID} items-center`}>
        <ReviewCardSelectionCell
          id={review.id}
          selected={selected}
          onToggle={handleToggle}
        />

        <div className="flex min-w-0 items-center gap-1.5 text-gray-700">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">{review.site}</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500">
          <CalendarClock className="h-4 w-4 text-gray-400" />
          <time>{presentation.submittedAtLabel}</time>
        </div>

        <div className="font-medium text-gray-700">
          {presentation.activityLabel}
        </div>

        <div className="flex items-center gap-1.5 text-gray-700">
          <User2 className="h-4 w-4 text-gray-400" />
          <span>{review.author}</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-600">
          <Paperclip className="h-4 w-4 text-gray-400" />
          <span>{review.fileCount}개 파일</span>
        </div>

        <ReviewCardStatusChip status={presentation.status} />

        <ReviewCardActions
          isPending={presentation.isPending}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default memo(ReviewCard);
