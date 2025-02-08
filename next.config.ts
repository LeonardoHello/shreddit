import type { NextConfig } from "next";

import { PostSort } from "@/types";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    optimizePackageImports: ["@lucide/lab"],
  },
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com", protocol: "https", port: "" },
      { hostname: "utfs.io", protocol: "https", port: "" },
      { hostname: "www.redditstatic.com", protocol: "https", port: "" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/all",
        destination: `/all/${PostSort.BEST}`,
      },
      {
        source: "/home",
        destination: `/home/${PostSort.BEST}`,
      },
      {
        source: "/r/:communityName",
        destination: `/r/:communityName/${PostSort.BEST}`,
      },
      {
        source: "/u/:username",
        destination: `/u/:username/${PostSort.BEST}`,
      },
      {
        source: "/u/:username/saved",
        destination: `/u/:username/saved/${PostSort.BEST}`,
      },
      {
        source: "/u/:username/hidden",
        destination: `/u/:username/hidden/${PostSort.BEST}`,
      },
      {
        source: "/u/:username/upvoted",
        destination: `/u/:username/upvoted/${PostSort.BEST}`,
      },
      {
        source: "/u/:username/downvoted",
        destination: `/u/:username/downvoted/${PostSort.BEST}`,
      },
    ];
  },
};

export default nextConfig;
