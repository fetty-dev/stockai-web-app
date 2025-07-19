import { StockData } from '@/types'
import { fetchStockDataFromFinnhub, FinnhubError } from '@/utils/finnhub'
import { fetchStockDataFromAlphaVantage, AlphaVantageError } from '@/utils/alpha-vantage'
import { getFinnhubApiKey } from '@/utils/env'

export class HybridStockApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'HybridStockApiError'
  }
}

export interface StockApiResult extends StockData {
  source: 'finnhub' | 'alpha_vantage' | 'mock'
  isMockData?: boolean
}

/**
 * Fetch stock data using hybrid approach:
 * 1. Try Finnhub first (60 calls/minute)
 * 2. Fallback to Alpha Vantage (25 calls/day)
 * 3. Final fallback to mock data
 */
export async function fetchStockData(symbol: string): Promise<StockApiResult> {
  const cleanSymbol = symbol.trim().toUpperCase()
  
  // Strategy 1: Try Finnhub first (if API key available)
  try {
    getFinnhubApiKey() // Check if Finnhub key is available
    const finnhubData = await fetchStockDataFromFinnhub(cleanSymbol)
    console.log(`✅ Stock data fetched from Finnhub for ${cleanSymbol}`)
    
    return {
      ...finnhubData,
      source: 'finnhub'
    }
  } catch (error) {
    if (error instanceof FinnhubError) {
      console.log(`⚠️ Finnhub failed for ${cleanSymbol}: ${error.message}`)
    } else {
      console.log(`⚠️ Finnhub API key not available, falling back to Alpha Vantage`)
    }
  }

  // Strategy 2: Fallback to Alpha Vantage
  try {
    const alphaVantageData = await fetchStockDataFromAlphaVantage(cleanSymbol)
    
    // Check if Alpha Vantage returned mock data
    if ((alphaVantageData as any).isMockData) {
      console.log(`⚠️ Alpha Vantage rate limited for ${cleanSymbol}, using mock data`)
      return {
        ...alphaVantageData,
        source: 'mock',
        isMockData: true
      }
    }
    
    console.log(`✅ Stock data fetched from Alpha Vantage for ${cleanSymbol}`)
    return {
      ...alphaVantageData,
      source: 'alpha_vantage'
    }
  } catch (error) {
    if (error instanceof AlphaVantageError) {
      console.log(`⚠️ Alpha Vantage failed for ${cleanSymbol}: ${error.message}`)
    }
  }

  // Strategy 3: Final fallback - throw error
  throw new HybridStockApiError(
    `Unable to fetch stock data for ${cleanSymbol} from any source`,
    500
  )
}

/**
 * Get the appropriate source attribution based on the data source
 */
export function getSourceAttribution(result: StockApiResult): string {
  switch (result.source) {
    case 'finnhub':
      return 'Finnhub'
    case 'alpha_vantage':
      return 'Alpha Vantage'
    case 'mock':
      return 'Mock Data (Demo)'
    default:
      return 'Unknown Source'
  }
}

/**
 * Check if Finnhub API is available and working
 */
export async function checkFinnhubAvailability(): Promise<boolean> {
  try {
    getFinnhubApiKey()
    // Try a simple test call
    await fetchStockDataFromFinnhub('AAPL')
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get API status information for debugging
 */
export async function getApiStatus(): Promise<{
  finnhub: boolean
  alphaVantage: boolean
  recommendedSource: string
}> {
  let finnhubAvailable = false
  let alphaVantageAvailable = false

  // Check Finnhub
  try {
    getFinnhubApiKey()
    finnhubAvailable = true
  } catch (error) {
    // Finnhub key not available
  }

  // Check Alpha Vantage
  try {
    const testResult = await fetchStockDataFromAlphaVantage('AAPL')
    alphaVantageAvailable = !(testResult as any).isMockData
  } catch (error) {
    // Alpha Vantage not available
  }

  const recommendedSource = finnhubAvailable 
    ? 'Finnhub (60 calls/minute)' 
    : alphaVantageAvailable 
      ? 'Alpha Vantage (25 calls/day)'
      : 'Mock Data (Demo mode)'

  return {
    finnhub: finnhubAvailable,
    alphaVantage: alphaVantageAvailable,
    recommendedSource
  }
}