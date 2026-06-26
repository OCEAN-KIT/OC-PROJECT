/*
 * TanStack Router 인스턴스를 생성하는 진입 파일입니다.
 * routeTree.gen.ts에서 생성된 라우트 트리를 연결하고,
 * preload/scroll 복원 같은 전역 라우터 옵션과 타입 등록을 담당합니다.
 */
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { queryClient } from './shared/query/queryClient'

export const router = createTanStackRouter({
  routeTree,
  basepath: '/admin',
  context: {
    queryClient,
  },
  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

export function getRouter() {
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
