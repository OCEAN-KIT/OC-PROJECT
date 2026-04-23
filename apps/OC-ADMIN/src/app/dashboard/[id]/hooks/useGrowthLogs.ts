import { useQuery } from "@tanstack/react-query";
import {
  getGrowthLogs,
  getRepresentativeSpecies,
} from "@ocean-kit/dashboard-domain/api/areaGrowthLogs";
import type { GrowthStatus } from "@ocean-kit/dashboard-domain/types/areaLogPayloads";
import { queryKeys } from "@/hooks/queryKeys";
import type { GrowthSpeciesSection } from "../components/growth-log";

export default function useGrowthLogs(areaId: number) {
  return useQuery({
    queryKey: queryKeys.areas.growthLogs(areaId),
    queryFn: () => getGrowthLogs(areaId),
    retry: false,
    select: (res): GrowthSpeciesSection[] => {
      const map = new Map<number, GrowthSpeciesSection>();

      for (const item of res.data.content) {
        if (!map.has(item.speciesId)) {
          map.set(item.speciesId, {
            speciesId: item.speciesId,
            speciesName: item.speciesName,
            logs: [],
          });
        }
        map.get(item.speciesId)!.logs.push({
          id: item.id,
          speciesId: item.speciesId,
          recordDate: item.recordDate,
          growthLength: item.growthLength,
          status: item.status as GrowthStatus,
        });
      }

      return Array.from(map.values());
    },
  });
}

export function useRepresentativeSpecies(areaId: number) {
  return useQuery({
    queryKey: queryKeys.areas.representativeSpecies(areaId),
    queryFn: () => getRepresentativeSpecies(areaId),
    select: (res) => res.data,
  });
}
