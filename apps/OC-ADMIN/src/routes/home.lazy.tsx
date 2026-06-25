import { createLazyFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/pages/home/HomePage'
import { AuthGuard } from '#/shared/auth/AuthGuard'

export const Route = createLazyFileRoute('/home')({
  component: HomeRoute,
})

function HomeRoute() {
  return (
    <AuthGuard mode="gotoLogin">
      <HomePage />
    </AuthGuard>
  )
}
