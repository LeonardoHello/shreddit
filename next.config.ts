import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com", protocol: "https", port: "" },
      { hostname: "utfs.io", protocol: "https", port: "" },
      { hostname: "www.redditstatic.com", protocol: "https", port: "" },
    ],
  },
};

export default nextConfig;
