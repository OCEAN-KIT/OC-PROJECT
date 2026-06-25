import { Outlet, createLazyFileRoute } from '@tanstack/react-router'
import { AuthGuard } from '#/shared/auth/AuthGuard'

export const Route = createLazyFileRoute('/dashboard')({
  component: DashboardLayoutRoute,
})

function DashboardLayoutRoute() {
  return (
    <AuthGuard mode="gotoLogin">
      <Outlet />
    </AuthGuard>
  )
}
