import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import type { router } from '#/router'

type AppDevtoolsProps = {
  router: typeof router
}

export function AppDevtools({ router }: AppDevtoolsProps) {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel router={router} />,
          },
        ]}
      />
    </>
  )
}
