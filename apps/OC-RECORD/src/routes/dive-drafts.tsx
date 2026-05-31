import { createFileRoute } from '@tanstack/react-router'
import DiveDraftListPage from '#/app/dive-drafts/page'

export const Route = createFileRoute('/dive-drafts')({
  component: DiveDraftListPage,
})
