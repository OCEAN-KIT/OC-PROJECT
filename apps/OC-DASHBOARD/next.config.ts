import type { NextConfig } from "next";

const s3PublicImagePattern = (() => {
  const publicBase = process.env.S3_PUBLIC_BASE;
  if (!publicBase) return null;

  try {
    const url = new URL(publicBase);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || undefined,
    };
  } catch {
    return null;
  }
})();

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "pre-piuda.s3.ap-northeast-2.amazonaws.com",
  },
  ...(s3PublicImagePattern ? [s3PublicImagePattern] : []),
];

const nextConfig: NextConfig = {
  basePath: "/dashboard",
  env: {
    API_BASE_URL: process.env.API_BASE_URL ?? "",
    S3_PUBLIC_BASE: process.env.S3_PUBLIC_BASE ?? "",
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN ?? "",
  },
  transpilePackages: [
    "@ocean-kit/dashboard-domain",
    "@ocean-kit/shared-axios",
    "@ocean-kit/shared-auth",
    "@ocean-kit/shared-types",
  ],
  output: "standalone",
  images: {
    remotePatterns,
  },
};

export default nextConfig;
