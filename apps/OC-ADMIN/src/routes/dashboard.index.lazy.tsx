import { createLazyFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '#/pages/dashboard/dashboard-route-components'

export const Route = createLazyFileRoute('/dashboard/')({
  component: DashboardPage,
})
