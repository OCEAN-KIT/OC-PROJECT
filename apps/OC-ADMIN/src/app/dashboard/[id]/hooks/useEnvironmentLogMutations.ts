import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteEnvironmentLog,
  patchEnvironmentLog,
  postEnvironmentLog,
} from "@ocean-kit/dashboard-domain/api/areaEnvironmentLogs";
import type { EnvironmentLogPayload } from "@ocean-kit/dashboard-domain/types/areaLogPayloads";
import { queryKeys } from "@/hooks/queryKeys";

export function usePostEnvironmentLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "post-environment-log"],
    mutationFn: (payload: EnvironmentLogPayload) =>
      postEnvironmentLog(areaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.areas.environmentLogs(areaId),
      });
    },
  });
}

export function usePatchEnvironmentLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "patch-environment-log"],
    mutationFn: ({
      logId,
      payload,
    }: {
      logId: number;
      payload: EnvironmentLogPayload;
    }) => patchEnvironmentLog(areaId, logId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.areas.environmentLogs(areaId),
      });
    },
  });
}

export function useDeleteEnvironmentLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "delete-environment-log"],
    mutationFn: (logId: number) => deleteEnvironmentLog(areaId, logId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.areas.environmentLogs(areaId),
      });
    },
  });
}
