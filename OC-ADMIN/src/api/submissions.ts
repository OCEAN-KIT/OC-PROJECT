// src/api/submissions.ts
import axiosInstance from "@/utils/axiosInstance";
import type { FilterState } from "@/components/filter-bar/types";

export type ReviewStatus = "pending" | "approved" | "rejected";
export type Submission = {
  id: string;
  site: string;
  datetime: string;
  task: string;
  author: string;
  fileCount: number;
  status: ReviewStatus;
};

// ✅ FilterBar의 타입을 그대로 재사용 (중복 정의 X)
export type ListFilters = FilterState;

type Reason = { templateCode?: string; message: string };

// null/undefined 제거해서 쿼리 깔끔하게
const compact = (obj: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== ""
    )
  );

export async function fetchSubmissions(params: {
  page: number; // 1-base
  pageSize: number;
  filters: ListFilters;
}) {
  const { page, pageSize, filters } = params;
  const { data } = await axiosInstance.get("/api/admin/submissions", {
    params: compact({
      page,
      pageSize,
      ...filters, // status, q, dateFrom, dateTo
    }),
  });
  // 서버 응답 예시: { items: Submission[], total: number }
  return data as { items: Submission[]; total: number };
}

export async function approveSubmission(id: string) {
  const { data } = await axiosInstance.post(
    `/api/admin/submissions/${id}/approve`
  );
  return data;
}

export async function rejectSubmission(id: string, reason: Reason) {
  const { data } = await axiosInstance.post(
    `/api/admin/submissions/${id}/reject`,
    { reason }
  );
  return data;
}

export async function bulkApprove(ids: string[]) {
  const { data } = await axiosInstance.post(
    `/api/admin/submissions/bulk/approve`,
    { ids }
  );
  return data;
}

export async function bulkReject(ids: string[], reason: Reason) {
  const { data } = await axiosInstance.post(
    `/api/admin/submissions/bulk/reject`,
    { ids, reason }
  );
  return data;
}

export async function deleteSubmission(id: string) {
  const { data } = await axiosInstance.delete(`/api/admin/submissions/${id}`);
  return data;
}

export async function bulkDelete(ids: string[]) {
  // 일부 서버는 DELETE 바디 허용 X → 필요 시 POST /bulk/delete로 바꾸세요.
  const { data } = await axiosInstance.delete(`/api/admin/submissions/bulk`, {
    data: { ids },
  });
  return data;
}
