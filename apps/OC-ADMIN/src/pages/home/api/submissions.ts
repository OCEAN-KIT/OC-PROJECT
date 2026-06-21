/*
 * 홈 제출 목록 화면의 API adapter입니다.
 * submission-domain의 서버 응답을 Home UI에서 쓰는 Submission 모델로 매핑하고,
 * 승인/반려/삭제 같은 admin mutation endpoint를 감쌉니다.
 */
import axiosInstance from "@ocean-kit/shared-axios/axiosInstance";
import {
  getSubmissionDetail,
  getSubmissionList,
} from "@ocean-kit/submission-domain/api/submissions";
import type {
  GetSubmissionListParams,
  SubmissionListResponse,
} from "@ocean-kit/submission-domain/types/submission";
import type { FilterState } from "../components/filter-bar/types";
import { debugAxiosError } from "./_debugAxios";
import { isAxiosError } from "axios";
import { extractFilename, saveBlobAsFile } from "#/shared/utils/download";

/** 서버 스펙: PENDING, APPROVED, REJECTED, DELETED */
export type ReviewStatus = "pending" | "approved" | "rejected" | "deleted";

export type Submission = {
  id: string;
  site: string;
  datetime: string; // submittedAt
  task: string; // activityType
  author: string; // authorName
  fileCount: number; // attachmentCount
  status: ReviewStatus;
};

// FilterBar 그대로 사용
export type ListFilters = FilterState;

type Reason = { templateCode?: string; message: string };
type CsvExportId = number | string;
type ApiEnvelope = {
  success?: boolean;
  message?: string | Record<string, unknown>;
  skipped?: unknown[];
};

const ADMIN_SUBMISSIONS_BASE_PATH = "/api/admin/submissions";
const STATUS_CHANGE_LOCKED_MESSAGE =
  "이미 반려 또는 승인 처리된 작업은 변경할 수 없습니다.";

function getApiEnvelopeMessage(data: ApiEnvelope) {
  if (typeof data.message === "string" && data.message.trim().length > 0) {
    return data.message;
  }

  return null;
}

function assertApiSuccess<T extends ApiEnvelope>(data: T, fallback: string) {
  if (data.success === false || (data.skipped?.length ?? 0) > 0) {
    throw new Error(getApiEnvelopeMessage(data) ?? fallback);
  }

  return data;
}

const compact = (obj: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "",
    ),
  );

// 스웨거 스펙에 맞추어 필터 정규화
function normalizeFilters(filters: ListFilters) {
  const {
    status, // "all" | "pending" | ...
    q, // 검색어
    dateFrom, // 날짜 문자열/Date 가능성
    dateTo,
    activityType, // 선택 시 넘길 값
    sortBy,
    sortDir,
  } = filters;

  const params: Partial<GetSubmissionListParams> = {};

  // keyword
  if (q.trim()) params.keyword = q.trim();

  // status: "all"이면 omit, 아니면 대문자로
  if (status !== "all") {
    params.status = status.toUpperCase(); // PENDING, APPROVED, ...
  }

  // activityType: 그대로 대문자 enum 사용 (선택된 경우에만)
  if (activityType) {
    params.activityType = activityType; // URCHIN_REMOVAL 등
  }

  // 날짜는 ISO(YYYY-MM-DD 또는 ISO8601)로 잘라서
  if (dateFrom) params.startDate = formatFilterDate(dateFrom);
  if (dateTo) params.endDate = formatFilterDate(dateTo);

  // 정렬 (기본값은 서버가 채움)
  if (sortBy) params.sortBy = sortBy;
  if (sortDir) params.sortDir = sortDir;

  return params;
}

function formatFilterDate(value: NonNullable<ListFilters["dateFrom"]>) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

/** 서버 → 프론트 모델 매핑 (목록) */
function mapServerToClient(data: SubmissionListResponse): {
  items: Submission[];
  total: number;
} {
  const paged = data.data;
  const content = paged.content;

  const items: Submission[] = content.map((row) => {
    const statusRaw = String(row.status).toLowerCase() as ReviewStatus | "";
    const status: ReviewStatus =
      statusRaw === "pending" ||
      statusRaw === "approved" ||
      statusRaw === "rejected" ||
      statusRaw === "deleted"
        ? statusRaw
        : "pending";

    return {
      id: String(row.submissionId),
      site: row.siteName,
      datetime: row.submittedAt,
      task: row.activityType,
      author: row.authorName,
      fileCount: row.attachmentCount,
      status,
    };
  });

  const total =
    typeof paged.totalElements === "number" ? paged.totalElements : items.length;

  return { items, total };
}

/** 목록 조회 */
export async function fetchSubmissions(params: {
  page: number; // 1-based from UI
  pageSize: number;
  filters: ListFilters;
}) {
  const { page, pageSize, filters } = params;

  // 0-based로 변환 (스웨거: page 기본값 0, size 기본 20)
  const pageZero = Math.max(0, page - 1);
  const baseFilters = normalizeFilters(filters);

  // 실제 송신 파라미터(콘솔 확인용)
  const queryParams = compact({
    page: pageZero,
    size: pageSize,
    ...baseFilters,
  }) as GetSubmissionListParams;

  try {
    return mapServerToClient(
      await getSubmissionList(axiosInstance, queryParams, {
        basePath: ADMIN_SUBMISSIONS_BASE_PATH,
      }),
    );
  } catch (err) {
    // 500/C001일 때 status 없이 1회 재시도
    if (isAxiosError(err)) {
      const codeVal = (() => {
        const raw = (err.response?.data ?? {}) as Record<string, unknown>;
        const code = raw.code;
        return typeof code === "string" ? code : undefined;
      })();

      if (
        err.response?.status === 500 &&
        codeVal === "C001" &&
        "status" in queryParams
      ) {
        const retryParams = { ...queryParams };
        delete (retryParams as Record<string, unknown>).status;

        try {
          return mapServerToClient(
            await getSubmissionList(axiosInstance, retryParams, {
              basePath: ADMIN_SUBMISSIONS_BASE_PATH,
            }),
          );
        } catch (e2) {
          return debugAxiosError(e2, "fetchSubmissions(retry)", {
            retryParams,
          });
        }
      }
    }
    return debugAxiosError(err, "fetchSubmissions()", { queryParams });
  }
}

/** 단건 승인/반려/삭제/벌크 APIs */
export async function approveSubmission(id: string) {
  try {
    const { data } = await axiosInstance.post(
      `${ADMIN_SUBMISSIONS_BASE_PATH}/${id}/approve`,
    );
    return assertApiSuccess(data, STATUS_CHANGE_LOCKED_MESSAGE);
  } catch (err) {
    return debugAxiosError(err, "approveSubmission()", { id });
  }
}

export async function rejectSubmission(id: string, reason: Reason) {
  try {
    const { data } = await axiosInstance.post(
      `${ADMIN_SUBMISSIONS_BASE_PATH}/${id}/reject`,
      { reason },
    );
    return assertApiSuccess(data, STATUS_CHANGE_LOCKED_MESSAGE);
  } catch (err) {
    return debugAxiosError(err, "rejectSubmission()", { id, reason });
  }
}

export async function bulkApprove(ids: string[]) {
  try {
    const { data } = await axiosInstance.post(
      `${ADMIN_SUBMISSIONS_BASE_PATH}/bulk/approve`,
      { ids },
    );
    return assertApiSuccess(data, STATUS_CHANGE_LOCKED_MESSAGE);
  } catch (err) {
    return debugAxiosError(err, "bulkApprove()", { ids });
  }
}

export async function bulkReject(ids: string[], reason: Reason) {
  try {
    const { data } = await axiosInstance.post(
      `${ADMIN_SUBMISSIONS_BASE_PATH}/bulk/reject`,
      { ids, reason },
    );
    return assertApiSuccess(data, STATUS_CHANGE_LOCKED_MESSAGE);
  } catch (err) {
    return debugAxiosError(err, "bulkReject()", { ids, reason });
  }
}

export async function deleteSubmission(id: string) {
  try {
    const { data } = await axiosInstance.delete(
      `${ADMIN_SUBMISSIONS_BASE_PATH}/${id}`,
    );
    return data;
  } catch (err) {
    return debugAxiosError(err, "deleteSubmission()", { id });
  }
}

export async function bulkDelete(ids: string[]) {
  try {
    const { data } = await axiosInstance.delete(
      `${ADMIN_SUBMISSIONS_BASE_PATH}/bulk`,
      {
        data: { ids },
      },
    );
    return data;
  } catch (err) {
    return debugAxiosError(err, "bulkDelete()", { ids });
  }
}

export async function csvExportByIds(ids: CsvExportId[], filename?: string) {
  if (!ids.length) {
    throw new Error("다운로드할 ID가 없습니다.");
  }

  try {
    const response = await axiosInstance.post(
      "/api/admin/exports/download/by-ids",
      { format: "CSV" as const, ids },
      {
        responseType: "blob",
        headers: { Accept: "text/csv,application/octet-stream" },
      },
    );

    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
    const contentDisposition = (
      response.headers as Record<string, string | undefined>
    )["content-disposition"];
    const serverFilename = extractFilename(contentDisposition);
    const fallback =
      ids.length === 1
        ? `submission_${ids[0]}.csv`
        : `submissions_${ids.length}_items.csv`;

    saveBlobAsFile(blob, filename || serverFilename || fallback);
  } catch (err) {
    return debugAxiosError(err, "csvExportByIds()", { ids });
  }
}

export type { SubmissionDetailServer } from "@ocean-kit/submission-domain/types/submission";

export async function getSubmissionDetails(id: number) {
  try {
    return await getSubmissionDetail(axiosInstance, id, {
      basePath: ADMIN_SUBMISSIONS_BASE_PATH,
    });
  } catch (err) {
    return debugAxiosError(err, "getSubmissionDetails()", { id });
  }
}
