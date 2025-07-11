import { NextRequest, NextResponse } from 'next/server'
import { fetchStockDataFromAlphaVantage, AlphaVantageError } from '@/utils/alpha-vantage'
import { StockQuoteResponse, SourceAttribution } from '@/types'

export async function GET(request: NextRequest) {
  try {
    // Extract symbol from query parameters
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    // Validate symbol parameter
    if (!symbol) {
      return NextResponse.json<StockQuoteResponse>({
        success: false,
        error: 'Missing required parameter: symbol',
        message: 'Please provide a stock symbol as a query parameter',
        sources: []
      }, { status: 400 })
    }

    // Fetch stock data from Alpha Vantage
    const stockData = await fetchStockDataFromAlphaVantage(symbol)

    // Create source attribution
    const sources: SourceAttribution[] = [
      {
        source: 'Alpha Vantage',
        timestamp: new Date(),
        apiVersion: 'v1'
      }
    ]

    // Return successful response
    return NextResponse.json<StockQuoteResponse>({
      success: true,
      data: stockData,
      sources
    }, { status: 200 })

  } catch (error) {
    console.error('Stock API Error:', error)

    // Handle Alpha Vantage specific errors
    if (error instanceof AlphaVantageError) {
      const statusCode = error.statusCode || 400
      
      return NextResponse.json<StockQuoteResponse>({
        success: false,
        error: error.message,
        message: 'Failed to fetch stock data',
        sources: []
      }, { status: statusCode })
    }

    // Handle unexpected errors
    return NextResponse.json<StockQuoteResponse>({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred while fetching stock data',
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