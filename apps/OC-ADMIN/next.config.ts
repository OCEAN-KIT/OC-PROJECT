import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ocean-kit/dashboard-domain",
    "@ocean-kit/shared-axios",
    "@ocean-kit/shared-auth",
    "@ocean-kit/shared-types",
  ],
};

export default nextConfig;
