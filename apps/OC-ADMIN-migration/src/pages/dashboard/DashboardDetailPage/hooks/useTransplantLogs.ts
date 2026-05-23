import { useQuery } from '@tanstack/react-query'
import { getTransplantLogs } from '@ocean-kit/dashboard-domain/api/areaTransplantLogs'
import type {
  SpeciesAttachmentStatus,
  TransplantMethod,
} from '@ocean-kit/dashboard-domain/types/areaLogPayloads'
import { queryKeys } from '../../queryKeys'
import type { SpeciesSection } from '../components/transplant-log'

export default function useTransplantLogs(areaId: number) {
  const enabled = Number.isFinite(areaId) && areaId > 0

  return useQuery({
    queryKey: queryKeys.areas.transplantLogs(areaId),
    queryFn: () => getTransplantLogs(areaId),
    enabled,
    retry: false,
    select: (res): SpeciesSection[] => {
      const map = new Map<number, SpeciesSection>()

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
          recordDate: item.recordDate,
          method: item.method as TransplantMethod,
          speciesId: item.speciesId,
          count: item.count,
          areaSize: item.areaSize,
          attachmentStatus: item.attachmentStatus as SpeciesAttachmentStatus,
          methodLabel: item.methodName,
          unit: item.unit,
        })
      }

      return Array.from(map.values())
    },
  })
}
