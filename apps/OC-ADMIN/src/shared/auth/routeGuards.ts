import { redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { myInfoQueryOptions } from './useMyInfo'

async function hasAuthenticatedUser(queryClient: QueryClient) {
  try {
    const response = await queryClient.fetchQuery(myInfoQueryOptions())
    return Boolean(response.data)
  } catch {
    return false
  }
}

export async function requireAuth(queryClient: QueryClient) {
  if (!(await hasAuthenticatedUser(queryClient))) {
    throw redirect({ to: '/login' })
  }
}

export async function redirectIfAuthenticated(queryClient: QueryClient) {
  if (await hasAuthenticatedUser(queryClient)) {
    throw redirect({ to: '/home' })
  }
}

export async function redirectToInitialRoute(queryClient: QueryClient) {
  throw redirect({
    to: (await hasAuthenticatedUser(queryClient)) ? '/home' : '/login',
  })
}
