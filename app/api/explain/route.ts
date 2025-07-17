import { NextRequest, NextResponse } from 'next/server'
import { explainStockMove, OpenAIError } from '@/utils/openai'
import { fetchStockDataFromAlphaVantage, AlphaVantageError } from '@/utils/alpha-vantage'
import { StockData, SourceAttribution } from '@/types'

export interface ExplainResponse {
  success: boolean
  data?: {
    stockData: StockData
    explanation: any
  }
  error?: string
  message?: string
  sources: SourceAttribution[]
}

export async function GET(request: NextRequest) {
  try {
    // Extract symbol from query parameters
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    // Validate symbol parameter
    if (!symbol) {
      return NextResponse.json<ExplainResponse>({
        success: false,
        error: 'Missing required parameter: symbol',
        message: 'Please provide a stock symbol as a query parameter',
        sources: []
      }, { status: 400 })
    }

    // Fetch stock data first
    const stockData = await fetchStockDataFromAlphaVantage(symbol)
    
    // Generate AI explanation
    const explanation = await explainStockMove(stockData)

    // Create source attribution
    const sources: SourceAttribution[] = [
      {
        source: 'Alpha Vantage',
        timestamp: new Date(),
        apiVersion: 'v1'
      },
      {
        source: 'OpenAI GPT-3.5',
        timestamp: new Date(),
        apiVersion: 'v1'
      }
    ]

    // Return successful response
    return NextResponse.json<ExplainResponse>({
      success: true,
      data: {
        stockData,
        explanation
      },
      sources
    }, { status: 200 })

  } catch (error) {
    console.error('Explain API Error:', error)

    // Handle OpenAI specific errors
    if (error instanceof OpenAIError) {
      const statusCode = error.statusCode || 500
      
      return NextResponse.json<ExplainResponse>({
        success: false,
        error: error.message,
        message: 'Failed to generate stock explanation',
        sources: []
      }, { status: statusCode })
    }

    // Handle Alpha Vantage specific errors
    if (error instanceof AlphaVantageError) {
      const statusCode = error.statusCode || 400
      
      return NextResponse.json<ExplainResponse>({
        success: false,
        error: error.message,
        message: 'Failed to fetch stock data',
        sources: []
      }, { status: statusCode })
    }

    // Handle unexpected errors
    return NextResponse.json<ExplainResponse>({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred while generating explanation',
      sources: []
    }, { status: 500 })
  }
}

// Handle unsupported HTTP methods
export async function POST() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed',
    message: 'Only GET requests are supported'
  }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed',
    message: 'Only GET requests are supported'
  }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed',
    message: 'Only GET requests are supported'
  }, { status: 405 })
}