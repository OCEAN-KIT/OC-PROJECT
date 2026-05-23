// src/queries/submissions.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import {
  fetchSubmissions,
  approveSubmission,
  rejectSubmission,
  bulkApprove,
  bulkReject,
  deleteSubmission,
  bulkDelete,
  type ListFilters,
} from "@/api/submissions";
import { queryKeys } from "@/hooks/queryKeys";

export const qk = {
  list: queryKeys.submissions.list,
};

function invalidateSubmissionQueries(
  qc: QueryClient,
  submissionIds: Array<number | string>,
) {
  const detailKeys = submissionIds.flatMap((submissionId) => {
    if (typeof submissionId !== "string") {
      return [queryKeys.submissionDetail(submissionId)];
    }

    const numericSubmissionId = Number(submissionId);

    if (!Number.isFinite(numericSubmissionId)) {
      return [queryKeys.submissionDetail(submissionId)];
    }

    return [
      queryKeys.submissionDetail(submissionId),
      queryKeys.submissionDetail(numericSubmissionId),
    ];
  });

  return Promise.all([
    qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
    ...detailKeys.map((queryKey) => qc.invalidateQueries({ queryKey })),
  ]);
}

export function useSubmissionsQuery(
  page: number,
  pageSize: number,
  filters: ListFilters,
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
    onSuccess: (_data, id) => invalidateSubmissionQueries(qc, [id]),
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
    onSuccess: (_data, payload) =>
      invalidateSubmissionQueries(qc, [payload.id]),
  });
}

export function useBulkApproveMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkApprove(ids),
    onSuccess: (_data, ids) => invalidateSubmissionQueries(qc, ids),
  });
}

export function useBulkRejectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      ids: string[];
      reason: { templateCode?: string; message: string };
    }) => bulkReject(payload.ids, payload.reason),
    onSuccess: (_data, payload) => invalidateSubmissionQueries(qc, payload.ids),
  });
}

export function useDeleteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubmission(id),
    onSuccess: (_data, id) => invalidateSubmissionQueries(qc, [id]),
  });
}

export function useBulkDeleteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDelete(ids),
    onSuccess: (_data, ids) => invalidateSubmissionQueries(qc, ids),
  });
}
