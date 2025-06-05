import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
  // Turbopack configuration (replaces webpack config)
  turbopack: {
    // Turbopack handles Node.js module fallbacks automatically
    // No need for manual fs, net, tls fallbacks
  },
  
  // Turbopack configuration (when needed)
  turbopack: {
    // Add any Turbopack-specific configurations here if needed
  },
};

export default nextConfig;
