import { createLazyFileRoute } from '@tanstack/react-router'
import { SpeciesCreatePage } from '#/pages/dashboard/dashboard-route-components'

export const Route = createLazyFileRoute('/dashboard/speciesCreate')({
  component: SpeciesCreatePage,
})
