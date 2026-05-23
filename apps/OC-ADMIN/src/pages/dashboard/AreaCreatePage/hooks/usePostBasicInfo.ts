import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postBasicInfo } from '@ocean-kit/dashboard-domain/api/areaBasicInfo'
import type { BasicPayload } from '@ocean-kit/dashboard-domain/types/areaBasicInfo'
import { queryKeys } from '../../queryKeys'

export default function usePostBasicInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['areas', 'post'],
    mutationFn: (payload: BasicPayload) => postBasicInfo(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.areas.all })
    },
  })
}
