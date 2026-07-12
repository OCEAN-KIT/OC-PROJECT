"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Gtag = (command: string, ...params: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

type GoogleAnalyticsPageViewProps = {
  measurementId: string;
};

export default function GoogleAnalyticsPageView({
  measurementId,
}: GoogleAnalyticsPageViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.gtag) {
      return;
    }

    const search = searchParams.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname;

    window.gtag("config", measurementId, {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [measurementId, pathname, searchParams]);

  return null;
}
