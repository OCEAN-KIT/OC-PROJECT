import { createFileRoute } from '@tanstack/react-router'
import MobileSubmissionsPage from '#/app/submit-management/page'

export const Route = createFileRoute('/submit-management')({
  component: MobileSubmissionsPage,
})
