/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com", protocol: "https", port: "" },
      { hostname: "utfs.io", protocol: "https", port: "" },
      { hostname: "www.redditstatic.com", protocol: "https", port: "" },
    ],
  },
};

module.exports = nextConfig;
