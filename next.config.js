const withPWA = require("@ducanh2912/next-pwa").default({
  dest: 'public'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
}

module.exports = withPWA(nextConfig);
