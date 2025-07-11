// Stock data types
export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  peRatio: number
  dividendYield: number
  high52Week: number
  low52Week: number
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Stock quote response
export interface StockQuoteResponse extends ApiResponse<StockData> {}

// AI analysis types
export interface AIAnalysis {
  summary: string
  pros: string[]
  cons: string[]
  recommendation: 'BUY' | 'HOLD' | 'SELL'
  confidence: number
  reasoning: string
}

export interface AIAnalysisResponse extends ApiResponse<AIAnalysis> {}