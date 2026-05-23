import { useQuery } from '@tanstack/react-query'
import { getMediaLogs } from '@ocean-kit/dashboard-domain/api/areaMediaLogs'
import type { MediaCategory } from '@ocean-kit/dashboard-domain/types/areaLogPayloads'
import { queryKeys } from '../../queryKeys'
import type { MediaLogEntry } from '../components/MediaLogSection'

export default function useMediaLogs(areaId: number) {
  const enabled = Number.isFinite(areaId) && areaId > 0

  return useQuery({
    queryKey: queryKeys.areas.mediaLogs(areaId),
    queryFn: () => getMediaLogs(areaId),
    enabled,
    retry: false,
    select: (res): MediaLogEntry[] =>
      res.data.content.map((item) => ({
        id: item.id,
        recordDate: item.recordDate,
        mediaUrl: item.mediaUrl,
        caption: item.caption,
        category: item.category as MediaCategory,
      })),
  })
}
