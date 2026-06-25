import { createLazyFileRoute } from '@tanstack/react-router'
import { DashboardDetailRoute } from '#/pages/dashboard/dashboard-route-components'

export const Route = createLazyFileRoute('/dashboard/$areaId')({
  component: DashboardDetailRoute,
})
