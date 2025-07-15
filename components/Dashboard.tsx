'use client'

import { useState, useEffect } from 'react'
import { StockData } from '@/types'

interface PortfolioHolding {
  symbol: string
  shares: number
  stockData?: StockData
}

interface PortfolioData {
  totalValue: number
  totalChange: number
  totalChangePercent: number
  holdings: PortfolioHolding[]
}

const PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  { symbol: 'AAPL', shares: 150 },
  { symbol: 'GOOGL', shares: 75 },
  { symbol: 'MSFT', shares: 120 },
  { symbol: 'TSLA', shares: 50 },
  { symbol: 'AMZN', shares: 25 },
  { symbol: 'NVDA', shares: 80 }
]

export default function Dashboard() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true)
        
        // Fetch all stock data in parallel
        const stockPromises = PORTFOLIO_HOLDINGS.map(async (holding) => {
          const response = await fetch(`/api/stock?symbol=${holding.symbol}`)
          const data = await response.json()
          
          if (data.success) {
            return {
              ...holding,
              stockData: data.data
            }
          }
          return holding
        })

        const holdings = await Promise.all(stockPromises)
        
        // Calculate portfolio totals
        let totalValue = 0
        let totalChange = 0
        
        holdings.forEach(holding => {
          if (holding.stockData) {
            totalValue += holding.stockData.price * holding.shares
            totalChange += holding.stockData.change * holding.shares
          }
        })

        const totalChangePercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0

        setPortfolioData({
          totalValue,
          totalChange,
          totalChangePercent,
          holdings
        })
      } catch (err) {
        setError('Failed to load portfolio data')
        console.error('Portfolio fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolioData()
  }, [])

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
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '1rem' }}>Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (error || !portfolioData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error || 'Failed to load portfolio'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="glass-button"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <header className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '300', 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '0.5rem' 
              }}>
                Total net worth
              </h1>
              <div className="gradient-text" style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold' 
              }}>
                ${portfolioData.totalValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} USD
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: 'rgba(255, 255, 255, 0.6)', 
                  marginRight: '0.5rem' 
                }}>
                  24h
                </span>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: portfolioData.totalChange >= 0 ? '#4ade80' : '#f87171'
                }}>
                  {portfolioData.totalChange >= 0 ? '+' : ''}
                  ${Math.abs(portfolioData.totalChange).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ({portfolioData.totalChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '2.5rem', 
                height: '2.5rem', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
              }}></div>
            </div>
          </div>
        </header>

        {/* Portfolio Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {portfolioData.holdings.map((holding) => (
            <div key={holding.symbol} className="glass-card-hover" style={{ padding: '1.5rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '1rem' 
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: 'rgba(255, 255, 255, 0.9)' 
                  }}>
                    {holding.symbol}
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'rgba(255, 255, 255, 0.6)' 
                  }}>
                    {holding.shares} shares
                  </p>
                </div>
                {holding.stockData && (
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    color: holding.stockData.change >= 0 ? '#4ade80' : '#f87171'
                  }}>
                    {holding.stockData.changePercent.toFixed(2)}%
                  </div>
                )}
              </div>
              
              {holding.stockData ? (
                <div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    marginBottom: '0.5rem' 
                  }}>
                    ${holding.stockData.price.toFixed(2)}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    marginBottom: '1rem' 
                  }}>
                    Position: ${(holding.stockData.price * holding.shares).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      fontSize: '0.875rem',
                      color: holding.stockData.change >= 0 ? '#4ade80' : '#f87171'
                    }}>
                      {holding.stockData.change >= 0 ? '+' : ''}
                      ${holding.stockData.change.toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    height: '1.5rem', 
                    borderRadius: '4px', 
                    marginBottom: '0.5rem' 
                  }}></div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    height: '1rem', 
                    borderRadius: '4px' 
                  }}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}