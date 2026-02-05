import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow larger request bodies for file uploads (500MB)
  serverExternalPackages: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
  // Configure allowed image domains if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'interview-screener.s3.us-east-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
