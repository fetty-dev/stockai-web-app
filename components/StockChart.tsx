'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts'

interface StockChartProps {
  symbol: string
  currentPrice: number
  change: number
}

interface ChartDataPoint {
  time: string
  price: number
  timestamp: number
}

// Generate simulated intra-day data based on current price and change
function generateIntradayData(currentPrice: number, change: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const openPrice = currentPrice - change
  const points = 78 // 6.5 hours * 12 points per hour (5-minute intervals)
  
  // Create realistic price movement throughout the day
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1)
    
    // Add some realistic volatility
    const volatility = Math.sin(i * 0.1) * 0.3 + Math.random() * 0.2 - 0.1
    const trendComponent = change * progress
    const price = openPrice + trendComponent + volatility
    
    // Create timestamp (9:30 AM to 4:00 PM EST)
    const startTime = new Date()
    startTime.setHours(9, 30, 0, 0)
    const timestamp = startTime.getTime() + (i * 5 * 60 * 1000) // 5-minute intervals
    
    data.push({
      time: new Date(timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }),
      price: Math.max(0, price),
      timestamp
    })
  }
  
  // Ensure the last point matches current price
  data[data.length - 1].price = currentPrice
  
  return data
}

export default function StockChart({ symbol, currentPrice, change }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate chart data when component mounts or props change
    const data = generateIntradayData(currentPrice, change)
    setChartData(data)
    setLoading(false)
  }, [currentPrice, change, symbol])

  const openPrice = currentPrice - change
  const isPositive = change >= 0

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-spin" style={{ 
            width: '2rem', 
            height: '2rem', 
            border: '2px solid rgba(255, 255, 255, 0.3)', 
            borderTopColor: 'rgba(255, 255, 255, 0.9)', 
            borderRadius: '50%' 
          }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: 'rgba(255, 255, 255, 0.9)', 
          marginBottom: '0.5rem' 
        }}>
          📊 Today's Chart
        </h3>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'rgba(255, 255, 255, 0.6)' 
        }}>
          Market Hours: 9:30 AM - 4:00 PM EST
        </p>
      </div>

      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['dataMin - 0.5', 'dataMax + 0.5']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <ReferenceLine 
              y={openPrice} 
              stroke="rgba(255, 255, 255, 0.3)" 
              strokeDasharray="5 5" 
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? '#4ade80' : '#f87171'}
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: isPositive ? '#4ade80' : '#f87171',
                stroke: 'rgba(255, 255, 255, 0.8)',
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px'
      }}>
        <div>
          <span style={{ 
            fontSize: '0.875rem', 
            color: 'rgba(255, 255, 255, 0.6)' 
          }}>
            Open: ${openPrice.toFixed(2)}
          </span>
        </div>
        <div>
          <span style={{ 
            fontSize: '0.875rem', 
            color: 'rgba(255, 255, 255, 0.6)' 
          }}>
            Current: ${currentPrice.toFixed(2)}
          </span>
        </div>
        <div>
          <span style={{ 
            fontSize: '0.875rem', 
            color: isPositive ? '#4ade80' : '#f87171',
            fontWeight: '500'
          }}>
            {isPositive ? '+' : ''}${change.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}