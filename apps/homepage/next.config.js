const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@jsonblog/schema', '@jsonblog/generator-boilerplate'],
  outputFileTracingRoot: path.join(__dirname, '../..'),
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Serve demo index.html files when accessed without /index.html
        {
          source: '/demos/:generator',
          destination: '/demos/:generator/index.html',
        },
        {
          source: '/demos/:generator/:page',
          destination: '/demos/:generator/:page/index.html',
        },
      ],
    };
  },
};

module.exports = nextConfig;
