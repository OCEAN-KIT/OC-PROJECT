/*
 * 로그인 요청의 서버 동작과 성공 후 후처리를 담당합니다.
 * 인증 API 호출, myInfo 캐시 무효화, /home 이동을 이 hook에 모아
 * LoginForm이 라우터와 query client를 직접 알지 않게 합니다.
 */
import { requestLogin } from '@ocean-kit/shared-auth/login'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { queryKeys } from '#/shared/query/queryKeys'
import type { LoginFormValues } from '../types'

export function useLoginMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, password }: LoginFormValues) => {
      return requestLogin(id, password)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.myInfo })
      await navigate({ to: '/home' })
    },
  })
}
