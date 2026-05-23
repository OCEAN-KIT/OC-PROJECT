import { createFileRoute } from '@tanstack/react-router'
import SpeciesCreatePage from '#/pages/dashboard/SpeciesCreatePage/SpeciesCreatePage'

export const Route = createFileRoute('/dashboard/speciesCreate')({
  component: SpeciesCreatePage,
})
