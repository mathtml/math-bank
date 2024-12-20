import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/pages/:path*', 
      },
    ];
  },
};
export default nextConfig;
