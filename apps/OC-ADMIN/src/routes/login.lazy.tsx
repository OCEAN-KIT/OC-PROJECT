import { createLazyFileRoute } from '@tanstack/react-router'
import { LoginPage } from '#/pages/login/LoginPage'
import { AuthGuard } from '#/shared/auth/AuthGuard'

export const Route = createLazyFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute() {
  return (
    <AuthGuard mode="gotoHome">
      <LoginPage />
    </AuthGuard>
  )
}
