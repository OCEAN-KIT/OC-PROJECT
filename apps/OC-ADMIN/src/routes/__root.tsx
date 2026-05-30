/*
 * 앱 전체의 root route입니다.
 * 실제 화면 레이아웃은 AppLayout에 위임합니다.
 */
import { createRootRoute } from '@tanstack/react-router'
import { AppLayout } from '#/shared/layouts/app/AppLayout'

export const Route = createRootRoute({
  component: AppLayout,
})
