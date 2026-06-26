import { Outlet, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard')({
  component: DashboardLayoutRoute,
})

function DashboardLayoutRoute() {
  return <Outlet />
}
