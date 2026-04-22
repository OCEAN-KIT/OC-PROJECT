import { getSubmissionList } from "@ocean-kit/submission-domain/api/submissions";
import type {
  GetSubmissionListParams,
  SubmissionListItemServer,
  SubmissionListResponse,
} from "@ocean-kit/submission-domain/types/submission";
import axiosInstance from "@/utils/axiosInstance";

export type { SubmissionListItemServer, SubmissionListResponse };

/** 프런트에서 쓰기 쉬운 목록 아이템 */
export interface Submission {
  id: number;
  siteName: string;
  activityType: SubmissionListItemServer["activityType"];
  submittedAt: string; // ISO string
  status: SubmissionListItemServer["status"];
  authorName: string;
  authorEmail: string;
  attachmentCount: number;
}

/** 페이지네이션 메타 */
export interface PageMeta {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** 목록 조회 */
export async function fetchSubmissions(params?: {
  page?: number;
  size?: number;
  status?: string; // 선택: 서버가 지원하면 상태 필터
  keyword?: string; // 선택: 검색어
}) {
  const { page = 0, size = 20, status, keyword } = params ?? {};

  const queryParams: GetSubmissionListParams = {
    page,
    size,
    status,
    keyword,
  };

  const data = await getSubmissionList(axiosInstance, queryParams);

  // 401/403 등은 axiosInstance 인터셉터에서 처리되거나 여기서 throw
  if (!data?.success) {
    const msg =
      typeof data?.message === "string"
        ? data.message
        : "목록 조회 실패 (success=false)";
    throw new Error(msg);
  }

  const content: Submission[] =
    data.data.content?.map((it) => ({
      id: it.submissionId,
      siteName: it.siteName,
      activityType: it.activityType,
      submittedAt: it.submittedAt,
      status: it.status,
      authorName: it.authorName,
      authorEmail: it.authorEmail,
      attachmentCount: it.attachmentCount,
    })) ?? [];

  const meta: PageMeta = {
    page: data.data.page,
    size: data.data.size,
    totalPages: data.data.totalPages,
    totalElements: data.data.totalElements,
    first: data.data.first,
    last: data.data.last,
    hasNext: data.data.hasNext,
    hasPrevious: data.data.hasPrevious,
  };

  return { items: content, meta };
}
