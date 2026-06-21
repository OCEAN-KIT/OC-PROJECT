/*
 * 인증 후 화면들이 공유하는 앱 레이아웃입니다.
 * 현재 경로를 기준으로 공통 MainHeader 노출 여부를 결정하고,
 * 실제 route 화면은 Outlet을 통해 렌더링합니다.
 */
import { Outlet, useRouterState } from '@tanstack/react-router'
import { MainHeader } from './MainHeader'

const HEADER_HIDDEN_PATHS = new Set(['/login'])

export function AppLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const shouldShowHeader = !HEADER_HIDDEN_PATHS.has(pathname)

  return (
    <>
      {shouldShowHeader && <MainHeader />}
      <Outlet />
    </>
  )
}
