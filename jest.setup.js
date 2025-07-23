// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Learn more: https://jestjs.io/docs/configuration#setupfilesafterenv-array

import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

// Extend Jest matchers with accessibility testing
expect.extend(toHaveNoViolations)

// Mock environment variables for testing
process.env.ALPHA_VANTAGE_API_KEY = 'test_alpha_vantage_key_12345'
process.env.OPENAI_API_KEY = 'test-key-sk-1234567890abcdef1234567890abcdef'
process.env.NODE_ENV = 'test'