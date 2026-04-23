import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteGrowthLog,
  patchGrowthLog,
  patchRepresentativeSpecies,
  postGrowthLog,
} from "@ocean-kit/dashboard-domain/api/areaGrowthLogs";
import type { GrowthLogPayload } from "@ocean-kit/dashboard-domain/types/areaLogPayloads";
import { queryKeys } from "@/hooks/queryKeys";

export function usePostGrowthLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "post-growth-log"],
    mutationFn: (payload: GrowthLogPayload) =>
      postGrowthLog(areaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.areas.growthLogs(areaId),
      });
    },
  });
}

export function usePatchGrowthLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "patch-growth-log"],
    mutationFn: ({
      logId,
      payload,
    }: {
      logId: number;
      payload: GrowthLogPayload;
    }) => patchGrowthLog(areaId, logId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.areas.growthLogs(areaId),
      });
    },
  });
}

export function useDeleteGrowthLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "delete-growth-log"],
    mutationFn: (logId: number) => deleteGrowthLog(areaId, logId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.areas.growthLogs(areaId),
      });
    },
  });
}

export function usePatchRepresentativeSpecies(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "patch-representative-species"],
    mutationFn: (speciesId: number | null) =>
      patchRepresentativeSpecies(areaId, speciesId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.areas.representativeSpecies(areaId),
      });
    },
  });
}
