import { NextRequest, NextResponse } from 'next/server'
import { fetchStockData, getSourceAttribution, HybridStockApiError } from '@/utils/hybrid-stock-api'
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

    // Fetch stock data using hybrid approach (Finnhub -> Alpha Vantage -> Mock)
    const stockDataResult = await fetchStockData(symbol)

    // Create source attribution based on actual data source
    const sources: SourceAttribution[] = [
      {
        source: getSourceAttribution(stockDataResult),
        timestamp: new Date(),
        apiVersion: 'v1'
      }
    ]

    // Remove hybrid-specific fields before returning
    const { source, isMockData, ...stockData } = stockDataResult

    // Return successful response
    return NextResponse.json<StockQuoteResponse>({
      success: true,
      data: stockData,
      sources
    }, { status: 200 })

  } catch (error) {
    console.error('Stock API Error:', error)

    // Handle hybrid stock API specific errors
    if (error instanceof HybridStockApiError) {
      const statusCode = error.statusCode || 400
      
      return NextResponse.json<StockQuoteResponse>({
        success: false,
        error: error.message,
        message: 'Failed to fetch stock data from all sources',
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