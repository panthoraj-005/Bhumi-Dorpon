/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  async redirects() {
    return [
      {
        source: "/flood/recorded",
        destination: "/flood",
        permanent: false,
      },
      {
        source: "/flood/forecast",
        destination: "/flood",
        permanent: false,
      },
    ];
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
