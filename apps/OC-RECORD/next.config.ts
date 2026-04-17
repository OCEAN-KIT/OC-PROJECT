import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ocean-kit/shared-api",
    "@ocean-kit/shared-auth",
    "@ocean-kit/shared-types",
  ],
};

export default nextConfig;
