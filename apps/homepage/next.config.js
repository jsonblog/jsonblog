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
};

module.exports = nextConfig;
