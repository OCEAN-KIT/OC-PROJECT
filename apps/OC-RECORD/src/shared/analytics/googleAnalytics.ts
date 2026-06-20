type Gtag = (command: string, ...params: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

let activeMeasurementId: string | undefined

export function initGoogleAnalytics(measurementId: string | undefined) {
  if (!import.meta.env.PROD || !measurementId) {
    return
  }

  activeMeasurementId = measurementId
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer?.push(arguments)
    }

  appendGoogleAnalyticsScript(measurementId)
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })
  trackGoogleAnalyticsPageView(getCurrentPagePath())
}

export function trackGoogleAnalyticsPageView(pagePath: string) {
  if (!activeMeasurementId || !window.gtag) {
    return
  }

  window.gtag('config', activeMeasurementId, {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  })
}

function appendGoogleAnalyticsScript(measurementId: string) {
  const scriptId = `ga4-${measurementId}`

  if (document.getElementById(scriptId)) {
    return
  }

  const script = document.createElement('script')
  script.id = scriptId
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    measurementId,
  )}`

  document.head.appendChild(script)
}

function getCurrentPagePath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}
