'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchLanding() {
  const [symbol, setSymbol] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symbol.trim()) return

    setLoading(true)
    // Navigate to stock results page
    router.push(`/stock/${symbol.toUpperCase().trim()}`)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%', padding: '2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="gradient-text" style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem' 
          }}>
            📈 StockAI
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'rgba(255, 255, 255, 0.7)', 
            maxWidth: '400px', 
            margin: '0 auto' 
          }}>
            AI-Powered Stock Analysis Made Simple
          </p>
          <p style={{ 
            fontSize: '1rem', 
            color: 'rgba(255, 255, 255, 0.5)', 
            marginTop: '0.5rem' 
          }}>
            Understand market movements with clear explanations
          </p>
        </div>

        {/* Search Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSearch}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="stock-symbol" 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  marginBottom: '0.5rem' 
                }}
              >
                Enter Stock Symbol
              </label>
              <input
                id="stock-symbol"
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g., AAPL, GOOGL, TSLA"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1.125rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.4)'
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)'
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={!symbol.trim() || loading}
              className="glass-button"
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '12px',
                cursor: loading ? 'wait' : 'pointer',
                opacity: (!symbol.trim() || loading) ? 0.5 : 1
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="animate-spin" style={{ 
                    width: '1rem', 
                    height: '1rem', 
                    border: '2px solid rgba(255, 255, 255, 0.3)', 
                    borderTopColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '50%', 
                    marginRight: '0.5rem' 
                  }}></div>
                  Searching...
                </span>
              ) : (
                'Get AI Analysis'
              )}
            </button>
          </form>
        </div>

        {/* Features */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
          gap: '1rem', 
          marginTop: '2rem' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Smart Stock Lookup
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              AI-Powered Explanations
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Transparent Sources
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}