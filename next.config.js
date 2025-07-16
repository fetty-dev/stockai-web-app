/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is enabled by default in Next.js 13+
  
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Experimental features (if needed for future development)
  // experimental: {
  //   serverActions: {
  //     allowedOrigins: ["localhost:3000"]
  //   },
  // },
}

module.exports = nextConfig