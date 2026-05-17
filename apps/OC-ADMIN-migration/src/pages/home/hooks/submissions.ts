/*
 * 제출 목록 화면에서 사용하는 React Query hooks입니다.
 * API 함수 호출, query key 선택, 성공 후 submissions 캐시 무효화를 이 파일에 모아
 * UI 컴포넌트가 endpoint나 cache 정책을 직접 알지 않게 합니다.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSubmissions,
  approveSubmission,
  rejectSubmission,
  bulkApprove,
  bulkReject,
  deleteSubmission,
  bulkDelete,
} from "../api/submissions";
import type { ListFilters } from "../api/submissions";
import { queryKeys } from "./queryKeys";

export const qk = {
  list: queryKeys.submissions.list,
};

export function useSubmissionsQuery(
  page: number,
  pageSize: number,
  filters: ListFilters
) {
  return useQuery({
    queryKey: queryKeys.submissions.list(page, pageSize, filters),
    queryFn: () => fetchSubmissions({ page, pageSize, filters }),
    staleTime: 30_000,
  });
}

export function useApproveMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveSubmission(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}

export function useRejectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: string;
      reason: { templateCode?: string; message: string };
    }) => rejectSubmission(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}

export function useBulkApproveMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkApprove(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}

export function useBulkRejectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      ids: string[];
      reason: { templateCode?: string; message: string };
    }) => bulkReject(payload.ids, payload.reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}

export function useDeleteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubmission(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}

export function useBulkDeleteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDelete(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}
