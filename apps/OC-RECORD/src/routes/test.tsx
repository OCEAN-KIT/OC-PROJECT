import { createFileRoute } from '@tanstack/react-router'
import TestPage from '#/app/test/page'

export const Route = createFileRoute('/test')({
  component: TestPage,
})
