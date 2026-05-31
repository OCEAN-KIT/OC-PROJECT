import { createFileRoute } from '@tanstack/react-router'
import DiveCreatePage from '#/app/dive-create/page'

export const Route = createFileRoute('/dive-create')({
  component: DiveCreatePage,
})
