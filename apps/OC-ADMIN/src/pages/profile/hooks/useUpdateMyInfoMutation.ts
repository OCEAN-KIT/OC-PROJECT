/*
 * 프로필 수정 API 호출과 myInfo 캐시 갱신을 담당합니다.
 * 화면은 저장 의도만 넘기고 endpoint/client 세부사항은 이 hook 안에 둡니다.
 */
import axiosInstance from '@ocean-kit/shared-axios/axiosInstance'
import { updateMyInfo } from '@ocean-kit/shared-auth/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '#/shared/query/queryKeys'
import type { ProfileFormValues } from '../types'

export function useUpdateMyInfoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ProfileFormValues) => {
      const response = await updateMyInfo(axiosInstance, payload)

      if (!response.success) {
        throw new Error('저장 중 오류가 발생했습니다.')
      }

      return response
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.myInfo })
    },
  })
}
