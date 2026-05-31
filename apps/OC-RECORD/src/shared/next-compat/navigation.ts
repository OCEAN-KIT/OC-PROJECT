import {
  redirect as tanStackRedirect,
  useNavigate,
  useRouter as useTanStackRouter,
  useRouterState,
} from '@tanstack/react-router'
import { useMemo } from 'react'

type NavigateTarget = string

export function useRouter() {
  const navigate = useNavigate()
  const router = useTanStackRouter()

  return useMemo(
    () => ({
      push: (href: NavigateTarget) => {
        void navigate({ href })
      },
      replace: (href: NavigateTarget) => {
        void navigate({ href, replace: true })
      },
      back: () => {
        router.history.back()
      },
      prefetch: (href: NavigateTarget) => {
        void router
          .preloadRoute({ href } as Parameters<typeof router.preloadRoute>[0])
          .catch(() => undefined)
      },
      refresh: () => {
        void router.invalidate()
      },
    }),
    [navigate, router],
  )
}

export function usePathname() {
  return useRouterState({
    select: (state) => state.location.pathname,
  })
}

export function redirect(href: NavigateTarget): never {
  throw tanStackRedirect({ href })
}
