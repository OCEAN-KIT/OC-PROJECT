import type { Metadata } from "next";
import { Outfit, Work_Sans } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/shared/analytics/google-analytics";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "OC-DASHBOARD",
  description: "Ocean Campus Dashboard",
};

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-work-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

const gaMeasurementId = process.env.NEXT_PUBLIC_DASHBOARD_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <GoogleAnalytics measurementId={gaMeasurementId} />
      </head>
      <body
        className={`${workSans.variable} ${outfit.variable} min-h-screen bg-[var(--ds-bg)] text-[var(--ds-text)] font-sans`}
      >
        <Providers>
          {children}
          {modal}
        </Providers>
      </body>
    </html>
  );
}
