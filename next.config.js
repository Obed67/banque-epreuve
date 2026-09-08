/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  transpilePackages: ["recharts"],
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
};

module.exports = nextConfig;
