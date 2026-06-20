import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMyInfo } from './useMyInfo'

export type AuthGuardMode = 'gotoLogin' | 'gotoHome'

type UseAuthGuardParams = {
  mode: AuthGuardMode
}

export function useAuthGuard({ mode }: UseAuthGuardParams) {
  const navigate = useNavigate()
  const { data, isError, isPending } = useMyInfo()
  const isLoggedIn = Boolean(data?.data)
  const shouldGoLogin = mode === 'gotoLogin' && (isError || !isPending && !isLoggedIn)
  const shouldGoHome = mode === 'gotoHome' && isLoggedIn

  useEffect(() => {
    if (shouldGoLogin) {
      void navigate({ to: '/login', replace: true })
      return
    }

    if (shouldGoHome) {
      void navigate({ to: '/home', replace: true })
    }
  }, [navigate, shouldGoHome, shouldGoLogin])

  return {
    checking: isPending,
    isLoggedIn,
    isRedirecting: shouldGoLogin || shouldGoHome,
  }
}
