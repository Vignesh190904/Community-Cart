/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable Next.js dev indicators (build activity / ISR status)
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
};

module.exports = nextConfig;
