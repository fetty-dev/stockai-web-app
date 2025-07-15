'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { StockData } from '@/types'

export default function StockPage() {
  const params = useParams()
  const router = useRouter()
  const symbol = params.symbol as string
  
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/stock?symbol=${symbol}`)
        const data = await response.json()
        
        if (data.success) {
          setStockData(data.data)
        } else {
          setError(data.error || 'Failed to fetch stock data')
        }
      } catch (err) {
        setError('Network error occurred')
        console.error('Stock fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (symbol) {
      fetchStockData()
    }
  }, [symbol])

  const handleNewSearch = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="animate-spin" style={{ 
            width: '3rem', 
            height: '3rem', 
            border: '2px solid rgba(255, 255, 255, 0.3)', 
            borderTopColor: 'rgba(255, 255, 255, 0.9)', 
            borderRadius: '50%', 
            margin: '0 auto' 
          }}></div>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '1rem' }}>
            Loading {symbol} data...
          </p>
        </div>
      </div>
    )
  }

  if (error || !stockData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1rem' }}>
            Stock Not Found
          </h2>
          <p style={{ color: '#f87171', marginBottom: '1.5rem' }}>
            {error || `No data found for symbol: ${symbol}`}
          </p>
          <button 
            onClick={handleNewSearch}
            className="glass-button"
            style={{ padding: '0.5rem 1.5rem' }}
          >
            Try Another Symbol
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            📈 StockAI
          </h1>
          <button 
            onClick={handleNewSearch}
            className="glass-button"
            style={{ padding: '0.5rem 1rem' }}
          >
            New Search
          </button>
        </div>

        {/* Stock Data Card */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '0.5rem' 
            }}>
              {stockData.symbol}
            </h2>
            <p style={{ 
              fontSize: '1rem', 
              color: 'rgba(255, 255, 255, 0.6)' 
            }}>
              {stockData.companyName}
            </p>
          </div>

          {/* Price Information */}
          <div style={{ marginBottom: '2rem' }}>
            <div className="gradient-text" style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem' 
            }}>
              ${stockData.price.toFixed(2)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ 
                fontSize: '1.125rem', 
                fontWeight: '500',
                color: stockData.change >= 0 ? '#4ade80' : '#f87171'
              }}>
                {stockData.change >= 0 ? '+' : ''}
                ${Math.abs(stockData.change).toFixed(2)}
              </span>
              <span style={{ 
                fontSize: '1.125rem', 
                fontWeight: '500',
                color: stockData.change >= 0 ? '#4ade80' : '#f87171'
              }}>
                ({stockData.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Additional Info */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '1rem' 
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Volume
              </div>
              <div style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                {stockData.volume.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Last Updated
              </div>
              <div style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                {new Date(stockData.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Source Attribution */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '1rem' 
          }}>
            🔗 Data Sources
          </h3>
          <div style={{ 
            padding: '0.75rem', 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '8px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#4ade80' 
              }}></div>
              <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Alpha Vantage
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                (Real-time stock data)
              </span>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '1rem' 
          }}>
            🤖 AI Analysis
          </h3>
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '8px',
            textAlign: 'center' 
          }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              AI-powered explanations coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}