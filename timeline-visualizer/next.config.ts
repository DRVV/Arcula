import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Fix for MIME type warnings
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Disable strict mode to prevent double-rendering in development
  reactStrictMode: false,
  // Configure headers to prevent MIME type issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Accept',
            value: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
