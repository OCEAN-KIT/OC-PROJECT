import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { Providers } from './app/providers'
import { router } from './router'
import './app/globals.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root not found')
}

if (import.meta.env.PROD && import.meta.env.VITE_RECORD_GA_MEASUREMENT_ID) {
  void import('./shared/analytics/googleAnalytics').then(
    ({ initGoogleAnalytics, trackGoogleAnalyticsPageView }) => {
      initGoogleAnalytics(import.meta.env.VITE_RECORD_GA_MEASUREMENT_ID)
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
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
)
