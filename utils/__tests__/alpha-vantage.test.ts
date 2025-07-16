import { isValidStockSymbol, AlphaVantageError } from '../alpha-vantage'

describe('Alpha Vantage Utilities', () => {
  describe('isValidStockSymbol', () => {
    it('should accept valid stock symbols', () => {
      expect(isValidStockSymbol('AAPL')).toBe(true)
      expect(isValidStockSymbol('GOOGL')).toBe(true)
      expect(isValidStockSymbol('MSFT')).toBe(true)
      expect(isValidStockSymbol('A')).toBe(true)
      expect(isValidStockSymbol('ABCDE')).toBe(true)
    })

    it('should reject invalid stock symbols', () => {
      expect(isValidStockSymbol('aapl')).toBe(false) // lowercase
      expect(isValidStockSymbol('ABCDEF')).toBe(false) // too long
      expect(isValidStockSymbol('')).toBe(false) // empty
      expect(isValidStockSymbol('ABC123')).toBe(false) // contains numbers
      expect(isValidStockSymbol('ABC-D')).toBe(false) // contains special chars
    })
  })

  describe('AlphaVantageError', () => {
    it('should create error with message', () => {
      const error = new AlphaVantageError('Test error')
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('AlphaVantageError')
      expect(error.statusCode).toBeUndefined()
    })

    it('should create error with message and status code', () => {
      const error = new AlphaVantageError('Test error', 404)
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('AlphaVantageError')
      expect(error.statusCode).toBe(404)
    })
  })
})