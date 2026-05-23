import { createFileRoute } from '@tanstack/react-router'
import AreaCreatePage from '#/pages/dashboard/AreaCreatePage/AreaCreatePage'

export const Route = createFileRoute('/dashboard/create')({
  component: AreaCreatePage,
})
