// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "OC-Diver",
  description: "해양 활동 제출 애플리케이션",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ocean Admin",
  },
};

export const viewport: Viewport = {
  themeColor: "#f9fafb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body
        className="
          h-full bg-black/5 text-gray-900 antialiased
          selection:bg-blue-100 selection:text-blue-900
        "
        style={{
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <div className="mx-auto min-h-screen max-w-[420px] bg-white shadow-sm">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
