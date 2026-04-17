import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ocean-kit/shared-api"],
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pre-piuda.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
