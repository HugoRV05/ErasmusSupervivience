import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages expects the site to be at /ErasmusSupervivience/
  basePath: '/ErasmusSupervivience',
  assetPrefix: '/ErasmusSupervivience',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
