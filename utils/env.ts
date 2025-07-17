/**
 * Environment variable utilities for secure API key management
 */

export class EnvironmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentError'
  }
}

/**
 * Securely retrieve and validate API keys from environment variables
 */
export function getRequiredEnvVar(key: string, validation?: (value: string) => boolean): string {
  const value = process.env[key]
  
  if (!value) {
    throw new EnvironmentError(`Missing required environment variable: ${key}`)
  }

  // Basic security check - don't allow obvious placeholder values
  const placeholderPatterns = [
    /^your_.*_here$/i,
    /^placeholder$/i,
    /^change_me$/i,
    /^replace_this$/i
  ]

  if (placeholderPatterns.some(pattern => pattern.test(value))) {
    throw new EnvironmentError(`Environment variable ${key} contains placeholder value`)
  }

  // Apply custom validation if provided
  if (validation && !validation(value)) {
    throw new EnvironmentError(`Environment variable ${key} failed validation`)
  }

  return value
}

/**
 * Get Alpha Vantage API key with validation
 */
export function getAlphaVantageApiKey(): string {
  return getRequiredEnvVar('ALPHA_VANTAGE_API_KEY', (key) => {
    // Alpha Vantage keys are typically alphanumeric and 8+ characters
    return key.length >= 8 && /^[A-Za-z0-9]+$/.test(key)
  })
}

/**
 * Get OpenAI API key with validation (for future use)
 */
export function getOpenAiApiKey(): string {
  return getRequiredEnvVar('OPENAI_API_KEY', (key) => {
    // OpenAI keys start with 'sk-' and are 51+ characters
    return key.startsWith('sk-') && key.length >= 51
  })
}

/**
 * Sanitize sensitive data for logging (replaces with asterisks)
 */
export function sanitizeForLogging(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars) {
    return '*'.repeat(value.length)
  }
  
  const visible = value.slice(0, visibleChars)
  const hidden = '*'.repeat(value.length - visibleChars)
  return visible + hidden
}

/**
 * Validate environment configuration on app startup
 */
export function validateEnvironment(): void {
  try {
    // Check required API keys
    getAlphaVantageApiKey()
    getOpenAiApiKey()
    
    // Check Node environment
    const nodeEnv = process.env.NODE_ENV || 'development'
    if (!['development', 'production', 'test'].includes(nodeEnv)) {
      throw new EnvironmentError(`Invalid NODE_ENV: ${nodeEnv}`)
    }

    console.log('✅ Environment validation passed')
  } catch (error) {
    console.error('❌ Environment validation failed:', error instanceof Error ? error.message : error)
    throw error
  }
}