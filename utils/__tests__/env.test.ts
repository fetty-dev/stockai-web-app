import { 
  getRequiredEnvVar, 
  getAlphaVantageApiKey,
  sanitizeForLogging,
  EnvironmentError 
} from '../env'

describe('Environment Utilities', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment before each test
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('getRequiredEnvVar', () => {
    it('should return environment variable value when present', () => {
      process.env.TEST_VAR = 'test_value'
      expect(getRequiredEnvVar('TEST_VAR')).toBe('test_value')
    })

    it('should throw error when environment variable is missing', () => {
      delete process.env.TEST_VAR
      expect(() => getRequiredEnvVar('TEST_VAR')).toThrow(EnvironmentError)
      expect(() => getRequiredEnvVar('TEST_VAR')).toThrow('Missing required environment variable: TEST_VAR')
    })

    it('should reject placeholder values', () => {
      process.env.TEST_VAR = 'your_api_key_here'
      expect(() => getRequiredEnvVar('TEST_VAR')).toThrow(EnvironmentError)
      expect(() => getRequiredEnvVar('TEST_VAR')).toThrow('placeholder value')
    })

    it('should apply custom validation when provided', () => {
      process.env.TEST_VAR = 'invalid'
      const validation = (value: string) => value === 'valid'
      
      expect(() => getRequiredEnvVar('TEST_VAR', validation)).toThrow(EnvironmentError)
      expect(() => getRequiredEnvVar('TEST_VAR', validation)).toThrow('failed validation')
    })
  })

  describe('getAlphaVantageApiKey', () => {
    it('should return valid Alpha Vantage API key', () => {
      process.env.ALPHA_VANTAGE_API_KEY = 'ABCD123456789'
      expect(getAlphaVantageApiKey()).toBe('ABCD123456789')
    })

    it('should reject short API keys', () => {
      process.env.ALPHA_VANTAGE_API_KEY = 'ABC123'
      expect(() => getAlphaVantageApiKey()).toThrow(EnvironmentError)
    })

    it('should reject API keys with special characters', () => {
      process.env.ALPHA_VANTAGE_API_KEY = 'ABC123!@#$%^'
      expect(() => getAlphaVantageApiKey()).toThrow(EnvironmentError)
    })
  })

  describe('sanitizeForLogging', () => {
    it('should hide sensitive data with asterisks', () => {
      // 'secretkey123' = 12 chars, visible 4, hidden 8
      expect(sanitizeForLogging('secretkey123', 4)).toBe('secr********')
    })

    it('should handle short strings', () => {
      expect(sanitizeForLogging('abc', 4)).toBe('***')
    })

    it('should respect visible characters parameter', () => {
      // 'secretkey123' = 12 chars, visible 2, hidden 10
      expect(sanitizeForLogging('secretkey123', 2)).toBe('se**********')
    })
  })
})