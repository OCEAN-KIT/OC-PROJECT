/*
 * ReviewCard에서 필요한 표시 전용 값을 계산하는 pure helper입니다.
 * 날짜 포맷팅, activity 라벨, 상태 chip 표현을 JSX 밖으로 빼서
 * 카드 컴포넌트가 파싱 규칙과 표시 정책을 직접 들고 있지 않게 합니다.
 */
import type { ReviewStatus, Submission } from "../../../api/submissions";
import { activityLabel } from "../../../types/activity";

export type ReviewStatusPresentation = {
  label: string;
  className: string;
};

const REVIEW_STATUS_PRESENTATION: Record<ReviewStatus, ReviewStatusPresentation> = {
  approved: {
    label: "승인",
    className: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  },
  rejected: {
    label: "반려",
    className: "bg-rose-100 text-rose-700 ring-rose-200",
  },
  pending: {
    label: "검수대기",
    className: "bg-gray-100 text-gray-700 ring-gray-200",
  },
  deleted: {
    label: "삭제됨",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateParts(parts: number[]) {
  const [year, month, day, hour, minute] = parts;

  return `${year}-${pad2(month)}-${pad2(day)} ${pad2(hour)}:${pad2(minute)}`;
}

export function formatSubmissionDateTime(value: string) {
  if (value.includes(",")) {
    const parts = value.split(",").map((part) => Number(part.trim()));
    const hasValidDateParts =
      parts.length >= 5 && parts.slice(0, 5).every(Number.isFinite);

    return hasValidDateParts ? formatDateParts(parts) : "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return formatDateParts([
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ]);
}

export function getReviewCardPresentation(review: Submission) {
  const isPending = review.status === "pending";

  return {
    activityLabel: activityLabel(review.task),
    submittedAtLabel: formatSubmissionDateTime(review.datetime),
    status: REVIEW_STATUS_PRESENTATION[review.status],
    isPending,
  };
}
