/*
 * 인증 후 화면들이 공유하는 앱 레이아웃입니다.
 * 현재 경로를 기준으로 공통 MainHeader 노출 여부를 결정하고,
 * 실제 route 화면은 Outlet을 통해 렌더링합니다.
 */
import { Outlet, useRouterState } from '@tanstack/react-router'
import { MainHeader } from './MainHeader'

const HEADER_HIDDEN_PATHS = new Set(['/login'])

function DesktopOnlyNotice() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-50 px-6 text-center text-gray-900 min-[900px]:hidden">
      <section className="max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold">
          데스크탑 환경에서 사용해주세요
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          관리자 화면은 900px 이상의 가로 폭에 맞춰 제공됩니다.
        </p>
      </section>
    </main>
  )
}

export function AppLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const shouldShowHeader = !HEADER_HIDDEN_PATHS.has(pathname)

  return (
    <>
      <div className="hidden min-[900px]:block">
        {shouldShowHeader && <MainHeader />}
        <Outlet />
      </div>
      <DesktopOnlyNotice />
    </>
  )
}
