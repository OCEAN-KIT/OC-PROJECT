/*
 * 앱 전체의 root route입니다.
 * 실제 화면 레이아웃은 AppLayout에 위임합니다.
 */
import { createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { AppLayout } from '#/shared/layouts/app/AppLayout'

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: AppLayout,
})
