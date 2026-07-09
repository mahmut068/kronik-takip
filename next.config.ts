import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.226.176', 'localhost'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'better-sqlite3'],
    outputFileTracingIncludes: {
      '/*': ['./prisma/dev.db'],
      '/api/**/*': ['./prisma/dev.db'],
    },
  },
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
