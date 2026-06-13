import type { NextConfig } from "next";

const apiBaseUrl = requireEnv("API_BASE_URL");
const s3PublicBase = requireEnv("S3_PUBLIC_BASE");
const mapboxToken = requireEnv("MAPBOX_TOKEN");
const serverActionAllowedOrigins = getServerActionAllowedOrigins(
  apiBaseUrl,
  s3PublicBase,
);

const s3PublicImagePattern = (() => {
  try {
    const url = new URL(s3PublicBase);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || undefined,
    };
  } catch {
    throw new Error("S3_PUBLIC_BASE must be a valid URL.");
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
  experimental: {
    serverActions: {
      allowedOrigins: serverActionAllowedOrigins,
    },
  },
  env: {
    API_BASE_URL: apiBaseUrl,
    S3_PUBLIC_BASE: s3PublicBase,
    MAPBOX_TOKEN: mapboxToken,
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

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}

function getServerActionAllowedOrigins(...urls: string[]) {
  const origins = urls.flatMap((value) => {
    try {
      return new URL(value).host;
    } catch {
      return [];
    }
  });

  return Array.from(new Set(origins));
}
