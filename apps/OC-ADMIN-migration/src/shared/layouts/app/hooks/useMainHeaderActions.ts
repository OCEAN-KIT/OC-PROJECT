/*
 * MainHeader에서 발생하는 사용자 액션을 관리합니다.
 * 메뉴 닫기, 로그아웃 mutation, 성공 후 캐시 정리와 /login 이동을 담당하고
 * 헤더 UI에는 실행 가능한 핸들러와 표시 상태만 제공합니다.
 */
import { requestLogout } from '@ocean-kit/shared-auth/logout'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

type UseMainHeaderActionsParams = {
  closeMenu: () => void
}

export function useMainHeaderActions({
  closeMenu,
}: UseMainHeaderActionsParams) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: requestLogout,
    onSuccess: async () => {
      queryClient.removeQueries()
      closeMenu()
      await navigate({ to: '/login', replace: true })
    },
  })

  const handleLogoutClick = () => {
    if (logoutMutation.isPending) {
      return
    }

    logoutMutation.mutate()
  }

  return {
    handleLogoutClick,
    logoutError:
      logoutMutation.error instanceof Error ? logoutMutation.error.message : '',
    isLoggingOut: logoutMutation.isPending,
  }
}
