/*
 * /login 경로와 LoginPage를 연결하는 route 파일입니다.
 * 로그인 화면 자체의 입력 상태와 제출 동작은 pages/login 내부에서 관리합니다.
 */
import { createFileRoute } from '@tanstack/react-router'
import { redirectIfAuthenticated } from '#/shared/auth/routeGuards'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    return redirectIfAuthenticated(context.queryClient)
  },
})
