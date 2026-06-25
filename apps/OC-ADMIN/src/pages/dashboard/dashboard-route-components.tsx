import { useParams } from '@tanstack/react-router'

import AreaCreatePage from './AreaCreatePage/AreaCreatePage'
import DashboardDetailPage from './DashboardDetailPage/DashboardDetailPage'
import DashboardPage from './DashboardPage/DashboardPage'
import SpeciesCreatePage from './SpeciesCreatePage/SpeciesCreatePage'

export { AreaCreatePage, DashboardPage, SpeciesCreatePage }

export function DashboardDetailRoute() {
  const { areaId } = useParams({ from: '/dashboard/$areaId' })

  return <DashboardDetailPage areaId={Number(areaId)} />
}
