import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { router } from './router'
import { QueryProvider } from './shared/providers/QueryProvider'
import './styles.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root not found')
}

if (import.meta.env.PROD && import.meta.env.VITE_ADMIN_GA_MEASUREMENT_ID) {
  void import('./shared/analytics/googleAnalytics').then(
    ({ initGoogleAnalytics, trackGoogleAnalyticsPageView }) => {
      initGoogleAnalytics(import.meta.env.VITE_ADMIN_GA_MEASUREMENT_ID)
      router.subscribe('onResolved', (event) => {
        if (event.hrefChanged) {
          trackGoogleAnalyticsPageView(event.toLocation.href)
        }
      })
    },
  )
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
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
    </QueryProvider>
  </StrictMode>,
)
