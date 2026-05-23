import { useQuery } from '@tanstack/react-query'
import {
  getGrowthLogs,
  getRepresentativeSpecies,
} from '@ocean-kit/dashboard-domain/api/areaGrowthLogs'
import type { GrowthStatus } from '@ocean-kit/dashboard-domain/types/areaLogPayloads'
import { queryKeys } from '../../queryKeys'
import type { GrowthSpeciesSection } from '../types/growthLogs'

export default function useGrowthLogs(areaId: number) {
  const enabled = Number.isFinite(areaId) && areaId > 0

  return useQuery({
    queryKey: queryKeys.areas.growthLogs(areaId),
    queryFn: () => getGrowthLogs(areaId),
    enabled,
    retry: false,
    select: (res): GrowthSpeciesSection[] => {
      const map = new Map<number, GrowthSpeciesSection>()

      for (const item of res.data.content) {
        if (!map.has(item.speciesId)) {
          map.set(item.speciesId, {
            speciesId: item.speciesId,
            speciesName: item.speciesName,
            logs: [],
          })
        }
        map.get(item.speciesId)!.logs.push({
          id: item.id,
          speciesId: item.speciesId,
          recordDate: item.recordDate,
          growthLength: item.growthLength,
          status: item.status as GrowthStatus,
        })
      }

      return Array.from(map.values())
    },
  })
}

export function useRepresentativeSpecies(areaId: number) {
  const enabled = Number.isFinite(areaId) && areaId > 0

  return useQuery({
    queryKey: queryKeys.areas.representativeSpecies(areaId),
    queryFn: () => getRepresentativeSpecies(areaId),
    enabled,
    select: (res) => res.data,
  })
}
