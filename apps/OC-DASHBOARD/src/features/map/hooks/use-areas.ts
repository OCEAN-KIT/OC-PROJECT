import { useQuery } from "@tanstack/react-query";
import { getAreaDetail } from "@ocean-kit/dashboard-domain/api/areaDetail";
import { getAreas } from "@ocean-kit/dashboard-domain/api/areas";
import type { RestorationRegion } from "@ocean-kit/dashboard-domain/types/areas";

export function useAreas(region: RestorationRegion | null) {
  return useQuery({
    queryKey: ["areas", region],
    queryFn: () => getAreas({ region: region! }),
    select: (res) => res.data.content,
    enabled: !!region,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAreaDetails(id: number | null) {
  return useQuery({
    queryKey: ["areaDetail", id],
    queryFn: () => getAreaDetail(id!),
    select: (res) => res.data,
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  });
}
