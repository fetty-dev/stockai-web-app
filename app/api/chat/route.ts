import { NextRequest, NextResponse } from 'next/server'
import { getOpenAiApiKey, sanitizeForLogging } from '@/utils/env'
import OpenAI from 'openai'

export interface ChatResponse {
  success: boolean
  message?: string
  sources?: string[]
  error?: string
}

const openai = new OpenAI({
  apiKey: getOpenAiApiKey(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, symbol, stockData, conversationHistory = [] } = body

    if (!message || !symbol) {
      return NextResponse.json<ChatResponse>({
        success: false,
        error: 'Message and symbol are required'
      }, { status: 400 })
    }

    // Create comprehensive system prompt for financial analysis
    const systemPrompt = `You are an expert financial analyst AI specializing in ${symbol}. You provide clear, educational, and helpful analysis.

Current Stock Data for ${symbol}:
- Current Price: $${stockData?.price || 'N/A'}
- Price Change: ${stockData?.change >= 0 ? '+' : ''}$${stockData?.change || 'N/A'} (${stockData?.changePercent || 'N/A'}%)
- Trading Volume: ${stockData?.volume?.toLocaleString() || 'N/A'} shares
- Market Cap: ${stockData?.marketCap ? '$' + (stockData.marketCap / 1000000000).toFixed(1) + 'B' : 'N/A'}
- Company: ${stockData?.companyName || symbol}

Your role:
1. Provide helpful, accurate analysis based on the current stock data
2. Explain financial concepts in simple, beginner-friendly terms
3. Use the provided stock data to give specific insights
4. Be conversational and engaging, like a knowledgeable friend
5. Always include appropriate investment risk disclaimers
6. Focus on educational content rather than investment advice
7. If asked about recent news or events you don't know about, acknowledge the limitation

Important: Respond with natural, conversational text only. Do not use JSON format or include technical metadata.`

    // Build conversation messages with proper context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6), // Keep last 6 messages for context while staying within limits
      { role: 'user', content: message }
    ]

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 800
    })

    const aiResponse = completion.choices[0]?.message?.content
    
    if (!aiResponse) {
      throw new Error('Empty response from OpenAI')
    }

    // Clean response and add disclaimers if needed
    let cleanResponse = aiResponse.trim()
    
    // Add disclaimer if not already present and discussing financial advice
    if (!cleanResponse.toLowerCase().includes('disclaimer') && 
        !cleanResponse.toLowerCase().includes('not financial advice') &&
        (cleanResponse.toLowerCase().includes('buy') || 
         cleanResponse.toLowerCase().includes('sell') ||
         cleanResponse.toLowerCase().includes('invest'))) {
      cleanResponse += "\n\n*Disclaimer: This analysis is for educational purposes only and should not be considered financial advice. Always do your own research and consult with financial professionals before making investment decisions.*"
    }

    return NextResponse.json<ChatResponse>({
      success: true,
      message: cleanResponse,
      sources: ['OpenAI GPT-4o-mini', 'Current Stock Data']
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    const apiKey = getOpenAiApiKey()
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const sanitizedMessage = errorMessage.replace(apiKey, sanitizeForLogging(apiKey))

    return NextResponse.json<ChatResponse>({
      success: false,
      error: `Failed to process chat message: ${sanitizedMessage}`
    }, { status: 500 })
  }
}

// Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed',
    message: 'Only POST requests are supported'
  }, { status: 405 })
}