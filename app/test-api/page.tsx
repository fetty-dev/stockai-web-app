'use client'

import { useState } from 'react'
import { StockQuoteResponse } from '@/types'

export default function TestApiPage() {
  const [symbol, setSymbol] = useState('AAPL')
  const [result, setResult] = useState<StockQuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stock?symbol=${symbol}`)
      const data: StockQuoteResponse = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error testing API:', error)
      setResult({
        success: false,
        error: 'Failed to fetch data',
        sources: []
      })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Stock API Test Page</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Stock Symbol:
        </label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="border border-gray-300 rounded px-3 py-2 mr-2"
          placeholder="Enter symbol (e.g., AAPL)"
        />
        <button
          onClick={testApi}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test API'}
        </button>
      </div>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">API Response:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.success && result.data && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-800">Stock Data:</h3>
              <p><strong>Company:</strong> {result.data.companyName}</p>
              <p><strong>Price:</strong> ${result.data.price.toFixed(2)}</p>
              <p><strong>Change:</strong> {result.data.change.toFixed(2)} ({result.data.changePercent.toFixed(2)}%)</p>
              <p><strong>Volume:</strong> {result.data.volume.toLocaleString()}</p>
              <p><strong>Market Cap:</strong> ${(result.data.marketCap / 1e9).toFixed(2)}B</p>
            </div>
          )}
          
          {!result.success && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold text-red-800">Error:</h3>
              <p>{result.error}</p>
              <p className="text-sm text-red-600">{result.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}