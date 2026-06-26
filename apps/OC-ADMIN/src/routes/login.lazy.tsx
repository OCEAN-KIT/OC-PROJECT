import { createLazyFileRoute } from '@tanstack/react-router'
import { LoginPage } from '#/pages/login/LoginPage'

export const Route = createLazyFileRoute('/login')({
  component: LoginPage,
})
