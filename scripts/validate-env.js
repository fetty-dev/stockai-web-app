#!/usr/bin/env node

/**
 * Environment validation script
 * Run with: node scripts/validate-env.js
 */

require('dotenv').config({ path: '.env.local' })

try {
  // Import validation function
  const { validateEnvironment } = require('../utils/env.ts')
  
  console.log('🔍 Validating environment configuration...')
  validateEnvironment()
  
  console.log('🎉 All environment variables are properly configured!')
  process.exit(0)
} catch (error) {
  console.error('💥 Environment validation failed:')
  console.error(error.message)
  console.error('\n📝 Next steps:')
  console.error('1. Copy .env.example to .env.local')
  console.error('2. Add your Alpha Vantage API key')
  console.error('3. Run this script again')
  process.exit(1)
}