import { StockData, AlphaVantageQuote, AlphaVantageResponse } from '@/types'
import { getAlphaVantageApiKey, sanitizeForLogging } from '@/utils/env'

export class AlphaVantageError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'AlphaVantageError'
  }
}

export async function fetchStockDataFromAlphaVantage(symbol: string): Promise<StockData & { isMockData?: boolean }> {
  if (!symbol || typeof symbol !== 'string') {
    throw new AlphaVantageError('Invalid stock symbol provided')
  }

  const cleanSymbol = symbol.trim().toUpperCase()
  
  if (!isValidStockSymbol(cleanSymbol)) {
    throw new AlphaVantageError('Stock symbol must be 1-5 uppercase letters')
  }

  const apiKey = getAlphaVantageApiKey()

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${cleanSymbol}&apikey=${apiKey}`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'StockAI/1.0'
      }
    })

    if (!response.ok) {
      throw new AlphaVantageError(
        `Alpha Vantage API error: ${response.status}`,
        response.status
      )
    }

    const data: AlphaVantageResponse = await response.json()
    
    // Check for API errors
    if (data['Error Message']) {
      throw new AlphaVantageError(`Alpha Vantage API error: ${data['Error Message']}`)
    }

    // Check for rate limiting - fallback to mock data for demo purposes
    if (data['Note'] || data['Information']) {
      console.log('Alpha Vantage rate limit reached, using mock data for demo')
      return { ...generateMockStockData(cleanSymbol), isMockData: true }
    }

    if (!data['Global Quote']) {
      throw new AlphaVantageError(`No data found for symbol: ${cleanSymbol}`)
    }

    const quote = data['Global Quote']
    return transformAlphaVantageQuoteToStockData(quote)
    
  } catch (error) {
    if (error instanceof AlphaVantageError) {
      throw error
    }
    
    if (error instanceof TypeError) {
      throw new AlphaVantageError('Network error: Unable to reach Alpha Vantage API')
    }
    
    // Sanitize error messages to prevent API key leakage
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const sanitizedMessage = errorMessage.replace(apiKey, sanitizeForLogging(apiKey))
    
    throw new AlphaVantageError(`Unexpected error: ${sanitizedMessage}`)
  }
}

// Generate mock stock data for demo purposes when API is rate limited
function generateMockStockData(symbol: string): StockData {
  const mockData: Record<string, { name: string; basePrice: number; change: number }> = {
    'AAPL': { name: 'Apple Inc.', basePrice: 210.16, change: 1.05 },
    'GOOGL': { name: 'Alphabet Inc.', basePrice: 2800.50, change: -15.30 },
    'TSLA': { name: 'Tesla Inc.', basePrice: 321.67, change: 10.89 },
    'MSFT': { name: 'Microsoft Corp.', basePrice: 420.85, change: 2.40 },
    'AMZN': { name: 'Amazon.com Inc.', basePrice: 3401.80, change: -8.20 },
    'NVDA': { name: 'NVIDIA Corp.', basePrice: 890.30, change: 25.60 },
    'META': { name: 'Meta Platforms Inc.', basePrice: 485.20, change: 7.15 },
    'NFLX': { name: 'Netflix Inc.', basePrice: 670.45, change: -3.80 }
  }

  const stock = mockData[symbol] || { 
    name: `${symbol} Corp.`, 
    basePrice: 100 + Math.random() * 200, 
    change: (Math.random() - 0.5) * 10 
  }

  const price = stock.basePrice + (Math.random() - 0.5) * 2 // Small random variation
  const change = stock.change + (Math.random() - 0.5) * 0.5 // Small random variation
  const changePercent = (change / (price - change)) * 100

  return {
    symbol,
    companyName: stock.name,
    price: Number(price.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(4)),
    volume: Math.floor(Math.random() * 100000000) + 10000000, // 10M to 110M
    marketCap: 0,
    peRatio: undefined,
    dividendYield: undefined,
    high52Week: undefined,
    low52Week: undefined,
    lastUpdated: new Date()
  }
}

function transformAlphaVantageQuoteToStockData(quote: AlphaVantageQuote): StockData {
  const symbol = quote['01. symbol']
  const price = parseFloat(quote['05. price'])
  const change = parseFloat(quote['09. change'])
  const changePercentStr = quote['10. change percent'].replace('%', '')
  const changePercent = parseFloat(changePercentStr)
  const volume = parseInt(quote['06. volume'], 10)

  // Validate required fields
  if (!symbol) {
    throw new AlphaVantageError('Invalid quote data: missing symbol')
  }
  
  if (isNaN(price)) {
    throw new AlphaVantageError('Invalid quote data: missing or invalid price')
  }

  return {
    symbol,
    companyName: symbol, // Alpha Vantage Global Quote doesn't include company name
    price,
    change: isNaN(change) ? 0 : change,
    changePercent: isNaN(changePercent) ? 0 : changePercent,
    volume: isNaN(volume) ? 0 : volume,
    marketCap: 0, // Not available in Global Quote endpoint
    peRatio: undefined,
    dividendYield: undefined,
    high52Week: undefined,
    low52Week: undefined,
    lastUpdated: new Date()
  }
}

export function isValidStockSymbol(symbol: string): boolean {
  // Stock symbols are typically 1-5 uppercase letters
  const symbolRegex = /^[A-Z]{1,5}$/
  return symbolRegex.test(symbol)
}

// Type guard for Alpha Vantage response
export function isAlphaVantageResponse(data: any): data is AlphaVantageResponse {
  return (
    data &&
    typeof data === 'object' &&
    (data['Global Quote'] || data['Error Message'] || data['Note'])
  )
}