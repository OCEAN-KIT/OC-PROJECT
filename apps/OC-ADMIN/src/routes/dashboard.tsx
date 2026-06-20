import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AuthGuard } from '#/shared/auth/AuthGuard'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayoutRoute,
})

function DashboardLayoutRoute() {
  return (
    <AuthGuard mode="gotoLogin">
      <Outlet />
    </AuthGuard>
  )
}
