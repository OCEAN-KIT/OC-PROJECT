/*
 * 앱 전체의 root route입니다.
 * HTML document shell, 공통 provider, head/meta, global css, devtools를 연결하고
 * 실제 화면 레이아웃은 AppLayout에 위임합니다.
 */
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { AppLayout } from '#/shared/layouts/app/AppLayout'
import { QueryProvider } from '#/shared/providers/QueryProvider'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  component: AppLayout,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'OC-ADMIN',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryProvider>
          {children}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </QueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
