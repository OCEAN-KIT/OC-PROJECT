/*
 * FilterBar에서 사용하는 UI 필터 상태 타입입니다.
 * 서버 요청 파라미터가 아니라 화면 입력값의 형태를 표현하며,
 * api/submissions.ts에서 서버 스펙에 맞게 정규화됩니다.
 */
import type { ActivityType } from "@ocean-kit/submission-domain/types/submission";

export type Status = "all" | "pending" | "approved" | "rejected";
export type SortDirection = "asc" | "desc" | "ASC" | "DESC";
export type FilterDate = string | Date | null;

export type FilterState = {
  status: Status;
  dateFrom: FilterDate; // YYYY-MM-DD
  dateTo: FilterDate; // YYYY-MM-DD
  q: string;
  activityType?: ActivityType;
  sortBy?: string;
  sortDir?: SortDirection;
};
