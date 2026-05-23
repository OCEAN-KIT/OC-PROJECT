import { createFileRoute } from '@tanstack/react-router'
import DashboardPage from '#/pages/dashboard/DashboardPage/DashboardPage'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})
