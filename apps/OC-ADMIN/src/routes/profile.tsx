/*
 * /profile 경로와 ProfilePage를 연결하는 route 파일입니다.
 * 프로필 조회/편집 상태는 pages/profile 내부에서 관리합니다.
 */
import { ProfilePage } from '#/pages/profile/ProfilePage'
import { AuthGuard } from '#/shared/auth/AuthGuard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: ProfileRoute,
})

function ProfileRoute() {
  return (
    <AuthGuard mode="gotoLogin">
      <ProfilePage />
    </AuthGuard>
  )
}
