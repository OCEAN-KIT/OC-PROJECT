import { useQuery } from '@tanstack/react-query'
import { getAreaDetail } from '@ocean-kit/dashboard-domain/api/areaDetail'
import type { BasicPayload } from '@ocean-kit/dashboard-domain/types/areaBasicInfo'
import { queryKeys } from '../../queryKeys'
import {
  toRegionCode,
  toHabitatCode,
  toLevelCode,
  toAttachmentStatusCode,
  toDateString,
} from '../../utils/mappers'

export default function useAreaDetail(id: number) {
  const enabled = Number.isFinite(id) && id > 0

  return useQuery({
    queryKey: queryKeys.areas.detail(id),
    queryFn: () => getAreaDetail(id),
    enabled,
    retry: false,
    select: (res): BasicPayload => {
      const o = res.data.overview
      return {
        name: o.name,
        restorationRegion: toRegionCode(
          o.restorationRegion,
        ) as BasicPayload['restorationRegion'],
        startDate: toDateString(o.startDate),
        endDate: toDateString(o.endDate) || undefined,
        habitat: toHabitatCode(o.habitatType) as BasicPayload['habitat'],
        depth: o.avgDepth,
        areaSize: o.areaSize,
        level: toLevelCode(o.currentStatus.name) as BasicPayload['level'],
        attachmentStatus: toAttachmentStatusCode(
          o.attachmentStatus,
        ) as BasicPayload['attachmentStatus'],
        lat: o.lat,
        lon: o.lon,
      }
    },
  })
}
