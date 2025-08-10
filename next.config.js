
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: [
      'replit.dev', 
      'replit.co', 
      'repl.it',
      /\.replit\.dev$/,
      /\.replit\.co$/,
      /\.repl\.it$/
    ]
  }
}

module.exports = nextConfig
