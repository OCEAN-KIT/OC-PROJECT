/*
 * 회원가입 요청 흐름과 성공 후 이동을 담당합니다.
 * 계정 생성, 로그인, 프로필 완료 API를 한 transaction처럼 순서대로 실행합니다.
 */
import { requestLogin } from '@ocean-kit/shared-auth/login'
import { completeSignUp, requestSignUp } from '@ocean-kit/shared-auth/signup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { DEFAULT_HOME_SEARCH } from '#/pages/home/homeSearch'
import { queryKeys } from '#/shared/query/queryKeys'
import type { RegisterFormValues } from '../types'

export function useRegisterMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      await requestSignUp(values.id, values.password)
      await requestLogin(values.id, values.password)

      return completeSignUp(values.nickname, values.email, values.phone)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.myInfo })
      await navigate({ to: '/home', search: DEFAULT_HOME_SEARCH })
    },
  })
}
