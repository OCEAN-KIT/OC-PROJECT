/*
 * /profile 경로와 ProfilePage를 연결하는 route 파일입니다.
 * 프로필 조회/편집 상태는 pages/profile 내부에서 관리합니다.
 */
import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '#/shared/auth/routeGuards'

export const Route = createFileRoute('/profile')({
  beforeLoad: ({ context }) => {
    return requireAuth(context.queryClient)
  },
})
