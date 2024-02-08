const withPWA = require("@ducanh2912/next-pwa").default({
  dest: 'public'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    dirs: ['app', 'components', 'models']
  }
}

module.exports = withPWA(nextConfig);
