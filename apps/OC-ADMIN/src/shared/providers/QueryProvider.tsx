/*
 * 앱 전역 React Query provider입니다.
 * QueryClient 생명주기를 provider 내부에서 한 번만 만들고 유지하며,
 * 개발 중 캐시 상태 확인을 위한 React Query Devtools도 함께 연결합니다.
 */
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

type QueryProviderProps = {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
