"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteArea, getAreas } from "@ocean-kit/dashboard-domain/api/areas";
import { queryKeys } from "@/hooks/queryKeys";
import type { AreaFilters } from "../types";

export function useGetAreas(page: number, filters: AreaFilters) {
  return useQuery({
    queryKey: queryKeys.areas.list(page, filters),
    queryFn: () =>
      getAreas({
        page,
        ...(filters.region && { region: filters.region }),
        ...(filters.level && { level: filters.level }),
        ...(filters.habitat && { habitat: filters.habitat }),
        ...(filters.from && { from: filters.from }),
        ...(filters.to && { to: filters.to }),
        ...(filters.keyword && { keyword: filters.keyword }),
      }),
    staleTime: 1000 * 60,
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", "post"],
    mutationFn: (areaId: number) => deleteArea(areaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.areas.all });
    },
  });
}
