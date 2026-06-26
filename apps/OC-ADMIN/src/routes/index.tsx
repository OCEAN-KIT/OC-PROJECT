/*
 * / 경로의 진입 정책을 담당하는 route 파일입니다.
 * 루트 화면을 별도로 렌더링하지 않고 로그인 상태에 따라 첫 진입 경로를 고정합니다.
 */
import { createFileRoute } from '@tanstack/react-router'
import { redirectToInitialRoute } from '#/shared/auth/routeGuards'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    return redirectToInitialRoute(context.queryClient)
  },
})
