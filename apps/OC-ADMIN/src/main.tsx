import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { QueryProvider } from './shared/providers/QueryProvider'
import './styles.css'

const AppDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('./shared/devtools/AppDevtools').then((module) => ({
        default: module.AppDevtools,
      })),
    )
  : null

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
      {AppDevtools ? (
        <Suspense fallback={null}>
          <AppDevtools router={router} />
        </Suspense>
      ) : null}
    </QueryProvider>
  </StrictMode>,
)
