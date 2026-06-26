import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '#/shared/auth/routeGuards'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    return requireAuth(context.queryClient)
  },
})
