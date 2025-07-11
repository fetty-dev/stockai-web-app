// Core stock data interface
export interface StockData {
  symbol: string
  companyName: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  peRatio?: number
  dividendYield?: number
  high52Week?: number
  low52Week?: number
  lastUpdated: Date
}

// Alpha Vantage API raw response types (used in alpha-vantage.ts)
export interface AlphaVantageQuote {
  '01. symbol': string
  '02. open': string
  '03. high': string
  '04. low': string
  '05. price': string
  '06. volume': string
  '07. latest trading day': string
  '08. previous close': string
  '09. change': string
  '10. change percent': string
}

export interface AlphaVantageResponse {
  'Global Quote': AlphaVantageQuote
  'Error Message'?: string
  'Note'?: string
}

// Source attribution for data transparency
export interface SourceAttribution {
  source: string
  timestamp: Date
  apiVersion?: string
}

// Standardized API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  sources: SourceAttribution[]
}

// Stock quote response
export interface StockQuoteResponse extends ApiResponse<StockData> {}

// Validation types
export type StockSymbol = string

// Input validation
export interface StockLookupRequest {
  symbol: StockSymbol
}

// AI analysis types (for future use)
export interface AIAnalysis {
  summary: string
  pros: string[]
  cons: string[]
  recommendation: 'BUY' | 'HOLD' | 'SELL'
  confidence: number
  reasoning: string
}

export interface AIAnalysisResponse extends ApiResponse<AIAnalysis> {}