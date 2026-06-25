import { createLazyFileRoute } from '@tanstack/react-router'
import { AreaCreatePage } from '#/pages/dashboard/dashboard-route-components'

export const Route = createLazyFileRoute('/dashboard/create')({
  component: AreaCreatePage,
})
