import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* existing config options */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Add the headers function to set Cross-Origin policies
  async headers() {
    return [
      {
        // Apply these headers to all routes matching this source pattern.
        // '/(.*)' matches all paths.
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            // This value allows popups (like Firebase Auth) to interact
            // with your application page.
            value: 'same-origin-allow-popups',
          },
          // If you ever need Cross-Origin-Embedder-Policy (COEP), you can add it here.
          // For the current issue, COOP is the relevant header.
          // {
          //   key: 'Cross-Origin-Embedder-Policy',
          //   value: 'require-corp', // or 'unsafe-none'
          // },
        ],
      },
    ];
  },
};

export default nextConfig;