/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ❌ Ignores TypeScript build errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ❌ Ignores ESLint warnings and errors during builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
