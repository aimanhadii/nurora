import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi open the dev server (http://192.168.x.x:3000).
  allowedDevOrigins: ["192.168.*.*"],
  // Hide the floating "N" dev-tools button (it covers the avatar). Dev only.
  devIndicators: false,
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
