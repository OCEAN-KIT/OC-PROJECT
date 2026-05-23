import { createFileRoute } from '@tanstack/react-router'
import DashboardDetailPage from '#/pages/dashboard/DashboardDetailPage/DashboardDetailPage'

export const Route = createFileRoute('/dashboard/$areaId')({
  component: DashboardDetailRoute,
})

function DashboardDetailRoute() {
  const { areaId } = Route.useParams()

  return <DashboardDetailPage areaId={Number(areaId)} />
}
