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
