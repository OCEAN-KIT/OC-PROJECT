import { createLazyFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '#/pages/profile/ProfilePage'
import { AuthGuard } from '#/shared/auth/AuthGuard'

export const Route = createLazyFileRoute('/profile')({
  component: ProfileRoute,
})

function ProfileRoute() {
  return (
    <AuthGuard mode="gotoLogin">
      <ProfilePage />
    </AuthGuard>
  )
}
