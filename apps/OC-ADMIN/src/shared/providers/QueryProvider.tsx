/*
 * 앱 전역 React Query provider입니다.
 * QueryClient 생명주기를 provider 내부에서 한 번만 만들고 유지합니다.
 */
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '#/shared/query/queryClient'

type QueryProviderProps = {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
