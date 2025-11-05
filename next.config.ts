import type { NextConfig } from "next";
import { RouteHas } from "next/dist/lib/load-custom-routes";

import { PostSort } from "@/types/enums";

const routeHasAuthCookie: RouteHas = {
  type: "cookie",
  key: "__Secure-better-auth.session_token",
};

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["@lucide/lab"],
  },

  images: {
    remotePatterns: [
      new URL("https://img.clerk.com"),
      new URL("https://8t3elu199k.ufs.sh/f/*"),
    ],
    qualities: [50],
  },
  async redirects() {
    return [
      {
        source: "/sign-in",
        has: [routeHasAuthCookie],
        destination: "/",
        permanent: false,
      },
      {
        source: "/manage-account",
        missing: [routeHasAuthCookie],
        destination: "/",
        permanent: false,
      },
      {
        source: "/choose-username",
        missing: [routeHasAuthCookie],
        destination: "/",
        permanent: false,
      },
      {
        source: "/home",
        missing: [routeHasAuthCookie],
        destination: "/",
        permanent: false,
      },
      {
        source: "/home/:sort",
        missing: [routeHasAuthCookie],
        destination: "/",
        permanent: false,
      },
      {
        source: "/submit",
        missing: [routeHasAuthCookie],
        destination: "/sign-in",
        permanent: false,
      },
      {
        source: "/submit/r/:communityName",
        missing: [routeHasAuthCookie],
        destination: "/sign-in",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: `/all/${PostSort.BEST}`,
      },
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
