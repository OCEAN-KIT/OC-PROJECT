import type { ReactNode } from 'react'
import { useAuthGuard } from './useAuthGuard'
import type { AuthGuardMode } from './useAuthGuard'

type AuthGuardProps = {
  mode: AuthGuardMode
  children: ReactNode
}

export function AuthGuard({ mode, children }: AuthGuardProps) {
  const { checking, isLoggedIn, isRedirecting } = useAuthGuard({ mode })

  if (checking || isRedirecting) {
    return null
  }

  if (mode === 'gotoLogin' && !isLoggedIn) {
    return null
  }

  if (mode === 'gotoHome' && isLoggedIn) {
    return null
  }

  return <>{children}</>
}
