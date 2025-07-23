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
  
  // Development environment setup
  webpack: (config, { dev, isServer }) => {
    // Add accessibility feedback in development
    if (dev && !isServer) {
      const originalEntry = config.entry
      config.entry = async () => {
        const entries = await originalEntry()
        
        if (entries['main.js'] && !entries['main.js'].includes('./utils/axe-setup.js')) {
          entries['main.js'].unshift('./utils/axe-setup.js')
        }
        
        return entries
      }
    }
    
    return config
  },
}

module.exports = nextConfig