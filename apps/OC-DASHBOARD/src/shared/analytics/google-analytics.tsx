import Script from "next/script";
import { Suspense } from "react";
import GoogleAnalyticsPageView from "./google-analytics-page-view";

type GoogleAnalyticsProps = {
  measurementId: string | undefined;
};

export default function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  if (process.env.NODE_ENV !== "production" || !measurementId) {
    return null;
  }

  const measurementIdJson = JSON.stringify(measurementId);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
          measurementId,
        )}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);}
          window.gtag('js', new Date());
          window.gtag('config', ${measurementIdJson}, { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageView measurementId={measurementId} />
      </Suspense>
    </>
  );
}
