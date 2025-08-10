
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    allowedDevOrigins: ['replit.dev', 'replit.co', 'repl.it']
  }
}

module.exports = nextConfig
