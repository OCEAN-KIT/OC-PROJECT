import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ocean-kit/shared-axios",
    "@ocean-kit/shared-auth",
    "@ocean-kit/shared-types",
    "@ocean-kit/submission-domain",
  ],
  output: "standalone",
};

export default nextConfig;
